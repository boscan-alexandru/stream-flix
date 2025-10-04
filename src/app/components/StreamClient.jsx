// src/app/components/StreamClient.jsx (REVERTED TO USE manifestUrl)

"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const HlsPlayer = dynamic(() => import("@/app/components/HlsPlayer"), {
  ssr: false,
});

// Helper function to format seconds (rest remains the same)
const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return [hours, minutes, seconds]
      .map((v) => v.toString().padStart(2, "0"))
      .join(":");
  }
  return [minutes, seconds].map((v) => v.toString().padStart(2, "0")).join(":");
};

// --- NOTE: Skip Intro logic is still removed/disabled here ---

export default function StreamClient({ movie, manifestUrl }) {
  // accepts manifestUrl again
  const [currentTime] = useState(0);

  // Client-side warning check
  useEffect(() => {
    if (!movie.streamDomain.includes("i8yz83pn.com")) {
      console.warn(
        "Proxy configuration in next.config.js may need updating for this domain!"
      );
    }
  }, [movie]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 lg:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Video Player Section */}
        <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl relative">
          <HlsPlayer
            // ✅ FIX: Pass the single proxy URL as videoUrl
            videoUrl={manifestUrl}
          />
        </div>

        {/* Info Section (rest remains the same) */}
        <div className="mt-8">
          <h1 className="text-4xl font-extrabold mb-3">{movie.title}</h1>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span>Length: {formatTime(movie.lengthTotal)}</span>
            <span>Intro: {formatTime(movie.lengthIntro)}</span>
            <span>Credits: {formatTime(movie.lengthCredits)}</span>
          </div>
          {/* ... (subtitles and time display) ... */}
        </div>
      </div>
    </div>
  );
}
