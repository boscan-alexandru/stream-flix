// src/app/components/HomePageBanner.jsx
"use client";

import React from "react";
import Link from "next/link";
import { PlayCircle, DollarSign, Clock } from "lucide-react"; // Icons for visual appeal

// 🚀 Use a constant for the new background image path
const HERO_BACKGROUND_IMAGE = "/cinema.png";

export default function HomePageBanner() {
  return (
    // Set min height and relative positioning for the background image
    <div className="relative w-full min-h-[500px] flex items-center justify-center overflow-hidden bg-gray-900">
      {/* 🚀 NEW: Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BACKGROUND_IMAGE}
          alt="Cinematic background with curtains and popcorn"
          // Ensure the image covers the entire container and is responsive
          className="w-full h-full object-cover object-bottom"
          width={2400} // Set width appropriate for a doubled-width image (assuming original was ~1200)
          height={500} // Set height to match container height
        />
        {/* Semi-transparent overlay for contrast and darkness */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Main Content Area (Z-index 10 ensures it sits above the image) */}
      <div className="relative z-10 text-center max-w-2xl p-6 bg-gray-900/70 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 mx-4">
        {/* Main Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-400 drop-shadow-lg leading-tight mb-4">
          StreamFlix
        </h1>
        <p className="text-xl md:text-2xl text-white font-medium mb-6">
          Your ultimate FREE movie destination
        </p>

        {/* Key Features/Messaging */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-8">
          <div className="flex items-center bg-gray-800/50 p-4 rounded-lg border border-gray-700 shadow-inner">
            <DollarSign className="h-7 w-7 text-green-400 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-white">
                Completely Free
              </h3>
              <p className="text-gray-300 text-sm">
                Enjoy unlimited movies at no cost!
              </p>
            </div>
          </div>
          <div className="flex items-center bg-gray-800/50 p-4 rounded-lg border border-gray-700 shadow-inner">
            <Clock className="h-7 w-7 text-yellow-400 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-white">
                Ad-Free Viewing
              </h3>
              <p className="text-gray-300 text-sm">
                No ads from 8:00 AM to 6:00 PM daily.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <Link
          href="/#movies-gallery"
          className="inline-flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 
                     text-white text-xl font-bold rounded-full 
                     shadow-lg transform transition-all duration-300 hover:scale-105"
        >
          <PlayCircle className="h-7 w-7 mr-3 fill-transparent" />
          Watch Now
        </Link>
      </div>
    </div>
  );
}
