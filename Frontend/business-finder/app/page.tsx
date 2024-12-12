"use client";

import Image from "next/image";
import Globe from "@/components/ui/globe";
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import ShimmerButton from "@/components/ui/shimmer-button";
import { useSearch } from './useSearch';
import MapComponent from './map';
import { Heart } from 'lucide-react';

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

declare global {
  interface Window {
    google: any;
  }
}

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string;
  const endpoint = 'https://maps.googleapis.com/maps/api/geocode/json';
  
  const { searchQuery, setSearchQuery, searchResults, handleSearch } = useSearch(apiKey, endpoint);
  const [activeTab, setActiveTab] = useState("Map");
  const [favorites, setFavorites] = useState<FavoritePlace[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mapFavorites');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mapFavorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initAutocomplete;
      document.head.appendChild(script);
    } else {
      initAutocomplete();
    }
  }, []);

  const initAutocomplete = () => {
    if (searchInputRef.current && window.google) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        searchInputRef.current,
        { types: ['geocode', 'establishment'] }
      );

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
          setSearchQuery(place.formatted_address);
          handleSearchWithState();
        }
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchWithState();
    }
  };

  const handleSearchWithState = async () => {
    setIsLoading(true);
    await handleSearch();
    setHasSearched(true);
    setIsLoading(false);
  };

  const handleAddFavorite = (place: any) => {
    const newFavorite: FavoritePlace = {
      id: place.place_id || Math.random().toString(36).substr(2, 9),
      name: place.name,
      address: place.vicinity || place.formatted_address,
      rating: place.rating,
      reviews: place.user_ratings_total,
      location: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      },
      placeType: place.types?.[0] || 'place'
    };

    setFavorites(prev => {
      if (prev.some(f => f.id === newFavorite.id)) return prev;
      return [...prev, newFavorite];
    });
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites(prev => prev.filter(place => place.id !== id));
  };

  const handleLocationClick = (location: { lat: number; lng: number }) => {
    setMapCenter(location);
    setActiveTab("Map");
    setHasSearched(true);
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Globe */}
      {activeTab === "Map" && !hasSearched && (
        <div className="fixed inset-0 flex items-center justify-center translate-y-40">
          <Globe className="w-[800px] h-[800px] opacity-75" />
        </div>
      )}

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen pt-32">
        <span 
          className="text-8xl font-semibold mb-8 hover:scale-105 transition-transform cursor-pointer"
          onClick={() => {setHasSearched(false); setSearchQuery('');}}
        >
          MapWise
        </span>

        <div className="flex items-center gap-4 w-full justify-center mb-8">
          <div className="relative w-3/4 max-w-md">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter address or location"
              className="w-full p-3 text-lg border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all focus:scale-105"
              disabled={isLoading}
            />
          </div>
          <ShimmerButton 
            className="shadow-2xl px-4 py-2 transition-transform hover:scale-105"
            onClick={handleSearchWithState}
            disabled={isLoading}
          >
            <span className="text-sm font-medium text-white">
              {isLoading ? 'Searching...' : 'Search'}
            </span>
          </ShimmerButton>
        </div>

        {/* Navigation bar */}
        <div className="flex justify-center w-full mb-8">
          <div className="flex gap-8 border-b border-gray-200 w-full max-w-md justify-center">
            <button
              className={`px-4 py-2 text-lg font-medium transition-all ${
                activeTab === "Map"
                  ? "border-b-2 border-black"
                  : "text-gray-500 hover:text-black hover:border-b-2 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("Map")}
            >
              Map
            </button>
            <button
              className={`px-4 py-2 text-lg font-medium transition-all ${
                activeTab === "Favorite Locations"
                  ? "border-b-2 border-black"
                  : "text-gray-500 hover:text-black hover:border-b-2 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("Favorite Locations")}
            >
              Favorite Locations
            </button>
          </div>
        </div>

        {/* Map Display */}
        {activeTab === "Map" && hasSearched && (
          <div className="w-full max-w-6xl px-4 animate-fadeIn">
            <MapComponent
              searchQuery={searchQuery}
              searchResults={searchResults}
              onAddFavorite={handleAddFavorite}
              onRemoveFavorite={handleRemoveFavorite}
              favorites={favorites}
              center={mapCenter}
            />
          </div>
        )}

        {/* Favorite Locations Display */}
        {activeTab === "Favorite Locations" && (
          <div className="w-full max-w-6xl px-4 animate-fadeIn">
            {favorites.length === 0 ? (
              <div className="mt-16 flex flex-col items-center justify-center gap-4">
                <Heart className="w-16 h-16 text-gray-400" />
                <p className="text-xl font-medium text-gray-600">No favorite locations yet</p>
                <p className="text-gray-500">Click the heart icon on any location to add it to your favorites</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((place) => (
                  <div
                    key={place.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 p-6"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg">{place.name}</h3>
                      <button
                        onClick={() => handleRemoveFavorite(place.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Heart className="w-5 h-5 fill-current" />
                      </button>
                    </div>
                    
                    <p className="text-gray-600 mt-2">{place.address}</p>
                    
                    {place.rating && (
                      <p className="text-gray-600 mt-2">
                        Rating: {place.rating} ⭐ ({place.reviews} reviews)
                      </p>
                    )}
                    
                    <button
                      onClick={() => handleLocationClick(place.location)}
                      className="mt-4 w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition-all hover:scale-105"
                    >
                      View on Map
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}