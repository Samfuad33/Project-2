import React, { useEffect, useRef } from 'react';

interface MapComponentProps {
  searchQuery: string;
  searchResults: any[];
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const MapComponent: React.FC<MapComponentProps> = ({ searchQuery, searchResults }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Load Google Maps Script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, []);

  useEffect(() => {
    // Update markers when search results change
    if (mapInstanceRef.current && searchResults.length > 0) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add new markers and center map
      const bounds = new window.google.maps.LatLngBounds();
      
      searchResults.forEach(result => {
        const position = {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng
        };
        
        const marker = new window.google.maps.Marker({
          position,
          map: mapInstanceRef.current,
          title: result.formatted_address
        });
        
        markersRef.current.push(marker);
        bounds.extend(position);
      });

      mapInstanceRef.current.fitBounds(bounds);
      
      // If only one result, zoom in closer
      if (searchResults.length === 1) {
        mapInstanceRef.current.setZoom(15);
      }
    }
  }, [searchResults]);

  const initMap = () => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: -33.860664, lng: 151.208138 },
        zoom: 13,
      });
    }
  };

  return (
    <div 
      ref={mapRef} 
      className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg mt-8"
    />
  );
};

export default MapComponent;