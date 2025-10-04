"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// Removed: dynamic import of EditMovieModal, convertSecondsToHMS

const DEFAULT_COVER_IMAGE = "/default-cover.png";

// Helper to convert total seconds back to a simple H:M:S format for display
const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  // Seconds are often omitted in this display, but we'll include them for accuracy
  const seconds = totalSeconds % 60;

  // Format as Hh Mm
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  // Only show seconds if total time is less than a minute
  if (hours === 0 && minutes === 0) parts.push(`${seconds}s`);

  return parts.join(" ");
};

// --- MovieCard Component (Designed for Frontend Gallery) ---
const MovieCard = ({ movie }) => {
  const imageUrl = movie.coverPhoto || DEFAULT_COVER_IMAGE;

  return (
    // Make the entire card a link
    <Link
      href={`/stream/${movie.slug}`}
      className="block w-full h-full rounded-lg overflow-hidden transition-transform duration-300 transform hover:scale-[1.03] hover:shadow-2xl bg-gray-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
    >
      <article>
        {/* Cover Image Container (16:9 Aspect Ratio) */}
        <div className="relative aspect-video bg-gray-900">
          <img
            src={imageUrl}
            alt={`Cover for ${movie.title}`}
            // Use object-cover to fill the space without distortion
            className="w-full h-full object-cover transition-opacity duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_COVER_IMAGE;
            }}
          />
        </div>

        {/* Text Overlay/Bottom Bar */}
        <div className="p-3">
          <h3 className="text-white text-md font-semibold truncate leading-tight">
            {movie.title}
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {formatTime(movie.lengthTotal)}
          </p>
          {/* Removed: Slug display as it's not needed for the user */}
        </div>
      </article>
    </Link>
  );
};

// --- MovieGallery Component (Frontend Fetching Logic) ---
export default function MovieGallery() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Removed: Modal state variables

  // Function to fetch the entire movie list
  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(false);
      // Calls the /api/movies GET handler
      const response = await fetch("/api/movies");

      if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.status}`);
      }

      const data = await response.json();
      setMovies(data);
    } catch (err) {
      console.error("Failed to load movies:", err);
      setError(true);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Removed: handleEditClick and handleModalClose handlers

  if (loading) {
    // Simple placeholder for loading state
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6 p-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="aspect-video bg-gray-700 animate-pulse rounded-lg h-full"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-900/20 text-red-300 rounded-lg">
        Could not load movies. Please check the backend service.
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        No movies available right now.
      </div>
    );
  }

  // Gallery Display
  return (
    <div className="px-4 py-8">
      <h2 className="text-3xl font-bold text-white mb-6">Featured Streams</h2>

      {/* Grid structure for a responsive gallery/carousel-like appearance */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
