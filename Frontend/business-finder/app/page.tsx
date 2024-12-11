import Image from "next/image";
import Globe from "@/components/ui/globe";
import { Input } from "@/components/ui/input";
import ShimmerButton from "@/components/ui/shimmer-button";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full">
      {/* Globe container positioned lower */}
      <div className="fixed inset-0 flex items-center justify-center translate-y-40">
        <Globe className="w-[800px] h-[800px] opacity-75" />
      </div>
      
      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen pt-32">
        <span className="text-8xl font-semibold mb-8">
          MapWise
        </span>
        
        <div className="flex items-center gap-4 w-full justify-center mb-8">
          <Input
            type="address"
            placeholder="Enter address or location"
            className="w-3/4 max-w-md p-3 text-lg"
          />
          <ShimmerButton className="shadow-2xl px-4 py-2">
            <span className="text-sm font-medium text-white">
              Search
            </span>
          </ShimmerButton>
        </div>

        {/* Navigation bar */}
        <div className="flex justify-center w-full">
          <div className="flex gap-8 border-b border-gray-200 w-full max-w-md justify-center">
            <button className="px-4 py-2 text-lg font-medium border-b-2 border-black">
              Map
            </button>
            <button className="px-4 py-2 text-lg font-medium text-gray-500 hover:text-black hover:border-b-2 hover:border-gray-300">
              Favorite Locations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}