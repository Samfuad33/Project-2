import React, { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';

interface Place {
  name: string;
  rating?: number;
  user_ratings_total?: number;
  vicinity: string;
  types: string[];
  photos?: any[];
  place_id: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface FavoritePlace {
  id: string;
  name: string;
  address: string;
  rating?: number;
  reviews?: number;
  location: {
    lat: number;
    lng: number;
  };
  placeType: string;
}

interface MapComponentProps {
  searchQuery: string;
  searchResults: any[];
  onAddFavorite: (place: any) => void;
  onRemoveFavorite: (id: string) => void;
  favorites: FavoritePlace[];
  center?: { lat: number; lng: number } | null;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const MapComponent: React.FC<MapComponentProps> = ({
  searchQuery,
  searchResults,
  onAddFavorite,
  onRemoveFavorite,
  favorites,
  center
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');

  const placeTypes = [
    { label: 'All', value: '' },
    { label: 'Restaurants', value: 'restaurant' },
    { label: 'Museums', value: 'museum' },
    { label: 'Parks', value: 'park' },
    { label: 'Tourist Attractions', value: 'tourist_attraction' },
    { label: 'Shopping', value: 'shopping_mall' }
  ];

  useEffect(() => {
    if (center && mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(center);
      mapInstanceRef.current.setZoom(15);
    }
  }, [center]);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, []);

  const isPlaceFavorited = (placeId: string) => {
    return favorites.some(place => place.id === placeId);
  };

  const searchNearbyPlaces = (location: any, type: string = '') => {
    const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);
    const request = {
      location: location,
      radius: 1500,
      type: type || undefined
    };

    service.nearbySearch(request, (results: Place[], status: any) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setNearbyPlaces(results);
        updateMarkers(results);
      }
    });
  };

  const updateMarkers = (places: Place[]) => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();

    places.forEach((place) => {
      const marker = new window.google.maps.Marker({
        position: place.geometry.location,
        map: mapInstanceRef.current,
        title: place.name,
      });

      const isFavorite = isPlaceFavorited(place.place_id);
      
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-lg">${place.name}</h3>
              <button 
                id="fav-${place.place_id}"
                class="favorite-btn"
                style="color: ${isFavorite ? '#ef4444' : '#9ca3af'};"
              >
                ♥
              </button>
            </div>
            ${place.rating ? 
              `<p class="text-sm mb-1">Rating: ${place.rating} ⭐ (${place.user_ratings_total} reviews)</p>` 
              : ''
            }
            <p class="text-sm">${place.vicinity}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
        
        setTimeout(() => {
          const favBtn = document.getElementById(`fav-${place.place_id}`);
          if (favBtn) {
            favBtn.addEventListener('click', () => {
              if (isPlaceFavorited(place.place_id)) {
                onRemoveFavorite(place.place_id);
              } else {
                onAddFavorite(place);
              }
              infoWindow.close();
            });
          }
        }, 100);
      });

      markersRef.current.push(marker);
      bounds.extend(place.geometry.location);
    });

    mapInstanceRef.current.fitBounds(bounds);
  };

  const initMap = () => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: center || { lat: 48.8566, lng: 2.3522 },
        zoom: 13,
      });
    }
  };

  useEffect(() => {
    if (mapInstanceRef.current && searchResults.length > 0) {
      const location = {
        lat: searchResults[0].geometry.location.lat,
        lng: searchResults[0].geometry.location.lng
      };
      searchNearbyPlaces(location, selectedType);
    }
  }, [searchResults]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    if (mapInstanceRef.current) {
      const center = mapInstanceRef.current.getCenter();
      searchNearbyPlaces(center, type);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex justify-center mb-4">
        <div className="flex justify-center gap-2 w-full max-w-5xl">
          {placeTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => handleTypeChange(type.value)}
              className={`
                px-4 
                py-2 
                rounded-full 
                text-sm
                font-medium
                transition-all
                flex-shrink-0
                ${
                  selectedType === type.value
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        <div
          ref={mapRef}
          className="w-2/3 h-[600px] rounded-lg overflow-hidden shadow-lg"
        />
        <div className="w-1/3 overflow-y-auto h-[600px]">
          {nearbyPlaces.map((place, index) => (
            <div
              key={index}
              className="p-4 border-b hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold">{place.name}</h3>
                <button
                  onClick={() => {
                    if (isPlaceFavorited(place.place_id)) {
                      onRemoveFavorite(place.place_id);
                    } else {
                      onAddFavorite(place);
                    }
                  }}
                  className="transition-colors"
                >
                  <Heart 
                    className={`w-5 h-5 ${
                      isPlaceFavorited(place.place_id) 
                        ? 'text-red-500 fill-current' 
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>
              {place.rating && (
                <p className="text-sm text-gray-600">
                  Rating: {place.rating} ⭐ ({place.user_ratings_total} reviews)
                </p>
              )}
              <p className="text-sm text-gray-600">{place.vicinity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapComponent;