"use client";

import Image from "next/image";
import Globe from "@/components/ui/globe";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import ShimmerButton from "@/components/ui/shimmer-button";
import { useSearch } from './useSearch';
import MapComponent from './map';

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string;
  const endpoint = 'https://maps.googleapis.com/maps/api/geocode/json';
  
  const { searchQuery, setSearchQuery, searchResults, handleSearch } = useSearch(apiKey, endpoint);
  const [activeTab, setActiveTab] = useState("Map");

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Globe (only show when no search results) */}
      {activeTab === "Map" && searchResults.length === 0 && (
        <div className="fixed inset-0 flex items-center justify-center translate-y-40">
          <Globe className="w-[800px] h-[800px] opacity-75" />
        </div>
      )}

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen pt-32">
        <span className="text-8xl font-semibold mb-8">
          MapWise
        </span>

        <div className="flex items-center gap-4 w-full justify-center mb-8">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter address or location"
            className="w-3/4 max-w-md p-3 text-lg"
          />
          <ShimmerButton 
            className="shadow-2xl px-4 py-2" 
            onClick={handleSearch}
          >
            <span className="text-sm font-medium text-white">
              Search
            </span>
          </ShimmerButton>
        </div>

        {/* Navigation bar */}
        <div className="flex justify-center w-full mb-8">
          <div className="flex gap-8 border-b border-gray-200 w-full max-w-md justify-center">
            <button
              className={`px-4 py-2 text-lg font-medium ${
                activeTab === "Map"
                  ? "border-b-2 border-black"
                  : "text-gray-500 hover:text-black hover:border-b-2 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("Map")}
            >
              Map
            </button>
            <button
              className={`px-4 py-2 text-lg font-medium ${
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
        {activeTab === "Map" && (
          <div className="w-full max-w-6xl px-4">
            <MapComponent 
              searchQuery={searchQuery} 
              searchResults={searchResults}
            />
          </div>
        )}

        {/* Favorite Locations Display */}
        {activeTab === "Favorite Locations" && (
          <div className="mt-16 flex justify-center items-center">
            <div className="w-[600px] h-[1000px] bg-gray-100 shadow-lg rounded-lg flex items-center justify-center">
              <p className="text-lg font-medium text-gray-600">
                Favorite Locations Chart (placeholder)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}