"use client";

import Image from "next/image";
import Globe from "@/components/ui/globe";
import react, { useState } from "react";
import { Input } from "@/components/ui/input";
import ShimmerButton from "@/components/ui/shimmer-button";
import { useSearch } from './useSearch';

export default function Home() {

  /* api Key*/
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string;
  const endpoint = 'https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={api_key}'
  /* Takes care of API requesnt based on client searches */
  const { searchQuery, setSearchQuery, searchResults, handleSearch } = useSearch(apiKey, endpoint);

  /* Keep track of current tab user is on, defaulted to Map */
  const [activeTab, setActiveTab] = useState("Map");
  return (
    <div className="relative min-h-screen w-full">
      {activeTab === "Map" && (
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
            onChange={(e) => setSearchQuery(e.target.value)} /* When there is a change we will set the new search query*/
            placeholder="Enter address or location"
            className="w-3/4 max-w-md p-3 text-lg"
          />
          <ShimmerButton className="shadow-2xl px-4 py-2" onClick = {handleSearch}>
            <span className="text-sm font-medium text-white">
              Search
            </span>
          </ShimmerButton>
        </div>

        {/* Navigation bar */}
        <div className="flex justify-center w-full">
          <div className="flex gap-8 border-b border-gray-200 w-full max-w-md justify-center">
            <button
              className={`px-4 py-2 text-lg font-medium ${
                activeTab === "Map" /* Set active tab to Map when user selects it, only displaying the map */
                  ? "border-b-2 border-black"
                  : "text-gray-500 hover:text-black hover:border-b-2 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("Map")}
            >
              Map
            </button>
            <button
              className={`px-4 py-2 text-lg font-medium ${
                activeTab === "Favorite Locations" /* Set active tab to favorite locations when user selects it, only displaying the favorites */
                  ? "border-b-2 border-black"
                  : "text-gray-500 hover:text-black hover:border-b-2 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("Favorite Locations")}
            >
              Favorite Locations
            </button>
          </div>
        </div>

        {/* Conditionally render chart */}
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