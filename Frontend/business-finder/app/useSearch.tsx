"use client";

import { useState } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface Geometry {
  location: Location;
}

interface SearchResult {
  geometry: Geometry;
  formatted_address: string;
  place_id: string;
}

export const useSearch = (apiKey: string, endpoint: string) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(`${endpoint}?address=${encodeURIComponent(searchQuery)}&key=${apiKey}`);
      const data = await response.json();

      if (data.status === 'OK' && data.results) {
        setSearchResults(data.results);
      } else {
        console.error('Geocoding API error:', data.status);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    handleSearch,
  };
};