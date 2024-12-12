import React, { useEffect, useRef, useState } from 'react';

interface Place {
  name: string;
  rating?: number;
  user_ratings_total?: number;
  vicinity: string;
  types: string[];
  photos?: any[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface MapComponentProps {
  searchQuery: string;
  searchResults: any[];
  onPlaceSelected?: (place: any) => void;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const MapComponent: React.FC<MapComponentProps> = ({ searchQuery, searchResults, onPlaceSelected }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const autocompleteRef = useRef<any>(null);
  const searchBoxRef = useRef<HTMLInputElement>(null);
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

  const searchNearbyPlaces = (location: any, type: string = '') => {
    const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);
    const request = {
      location: location,
      radius: 1500, // 1.5km radius
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
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Create bounds object to fit all markers
    const bounds = new window.google.maps.LatLngBounds();

    places.forEach((place) => {
      const marker = new window.google.maps.Marker({
        position: place.geometry.location,
        map: mapInstanceRef.current,
        title: place.name,
      });

      // Create info window for each marker
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-bold">${place.name}</h3>
            ${place.rating ? `<p>Rating: ${place.rating} ⭐ (${place.user_ratings_total} reviews)</p>` : ''}
            <p>${place.vicinity}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
      bounds.extend(place.geometry.location);
    });

    // Fit map to show all markers
    mapInstanceRef.current.fitBounds(bounds);
  };

  const initMap = () => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 48.8566, lng: 2.3522 }, // Paris coordinates
        zoom: 13,
      });

      if (searchBoxRef.current) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(searchBoxRef.current, {
          types: ['geocode', 'establishment']
        });

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          
          if (place.geometry) {
            mapInstanceRef.current.setCenter(place.geometry.location);
            mapInstanceRef.current.setZoom(15);

            // Search for nearby places when a location is selected
            searchNearbyPlaces(place.geometry.location, selectedType);

            if (onPlaceSelected) {
              onPlaceSelected(place);
            }
          }
        });
      }
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    if (mapInstanceRef.current) {
      const center = mapInstanceRef.current.getCenter();
      searchNearbyPlaces(center, type);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full mb-4">
        <input
          ref={searchBoxRef}
          type="text"
          placeholder="Search locations..."
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          defaultValue={searchQuery}
        />
      </div>
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {placeTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => handleTypeChange(type.value)}
            className={`px-4 py-2 rounded-full ${
              selectedType === type.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {type.label}
          </button>
        ))}
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
              className="p-4 border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                mapInstanceRef.current.setCenter(place.geometry.location);
                mapInstanceRef.current.setZoom(17);
              }}
            >
              <h3 className="font-bold">{place.name}</h3>
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