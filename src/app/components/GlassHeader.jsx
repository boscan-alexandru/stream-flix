// src/app/components/GlassHeader.jsx

import Link from "next/link";
import SearchBar from "./SearchBar";

// 🚀 NEW: Revised MoviePopcornLogo Component (Trapezoid shape with outer stripes)
const MoviePopcornLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-9 h-9 text-white"
  >
    {/* 1. Popcorn Box Base (White Trapezoid) */}
    {/* The polygon coordinates create a trapezoid, with the base wider than the top. */}
    <polygon
      points="5 20, 19 20, 17 8, 7 8"
      fill="white"
      stroke="#CCCCCC" // Light gray border for definition
      strokeWidth="0.5"
    />

    {/* 2. Red Stripes (Outer definition) */}
    {/* Left Red Stripe */}
    <polygon points="5 20, 7 20, 7.8 8, 7 8" fill="#D90000" />
    {/* Right Red Stripe */}
    <polygon points="17 8, 16.2 8, 19 20, 17 20" fill="#D90000" />
    {/* Central Red Stripes */}
    <rect x="9.5" y="8" width="1" height="12" fill="#D90000" />
    <rect x="13.5" y="8" width="1" height="12" fill="#D90000" />

    {/* 3. Popcorn Fluff (Top) */}
    <path
      d="M7 8C6 6.5 7.5 5 9 6L12 5L15 6C16.5 5 18 5.5 17 8H7Z"
      fill="#FFD700"
      stroke="#FFA500"
      strokeWidth="0.5"
    />
    <circle
      cx="10"
      cy="7"
      r="1.5"
      fill="#FFD700"
      stroke="#FFA500"
      strokeWidth="0.5"
    />
    <circle
      cx="14"
      cy="7.5"
      r="1.5"
      fill="#FFD700"
      stroke="#FFA500"
      strokeWidth="0.5"
    />
    <circle
      cx="8"
      cy="8"
      r="1.5"
      fill="#FFD700"
      stroke="#FFA500"
      strokeWidth="0.5"
    />

    {/* 4. Old Movie Camera Silhouette (Subtle, Dark Grey/Silver) */}
    {/* Camera Body and Lens Barrel */}
    <rect
      x="2"
      y="14"
      width="5"
      height="4"
      rx="1"
      fill="currentColor"
      opacity="0.6"
    />
    {/* Main Lens */}
    <circle
      cx="5"
      cy="16"
      r="1.5"
      fill="black"
      stroke="white"
      strokeWidth="0.5"
      opacity="0.9"
    />
    {/* Film Reel Handle (Top left corner of popcorn box) */}
    <path
      d="M7 8L6 5.5M7 8L6 10"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.7"
    />
  </svg>
);

export default function GlassHeader() {
  return (
    <header
      className="fixed top-0 left-0 w-full z-30 
                       bg-gray-900/80 backdrop-blur-md 
                       shadow-xl border-b border-white/10 transition-all"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 sm:px-8">
        {/* Logo and Home Link */}
        <Link
          href="/"
          className="flex items-center space-x-2 transition-transform hover:scale-[1.05]"
          aria-label="Go to Homepage"
        >
          <MoviePopcornLogo /> {/* 🚀 Using the new, revised logo */}
          <span className="text-xl font-extrabold text-white hidden sm:block">
            StreamFlix
          </span>
        </Link>

        {/* Search Bar */}
        <div className="w-1/2 md:w-1/3">
          <SearchBar />
        </div>

        {/* Optional: User Profile/Settings/Admin Link */}
        <Link
          href="/admin/movies"
          className="text-sm text-gray-400 hover:text-indigo-400 transition"
        >
          Admin
        </Link>
      </div>
    </header>
  );
}
