// src/app/components/MovieList.jsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { convertSecondsToHMS } from "@/app/lib/utils"; // ⚠️ Ensure this helper is available

// Dynamic import of the form and modal to keep initial bundle small
const EditMovieModal = dynamic(() => import("./EditMovieModal"), {
  ssr: false,
});

const DEFAULT_COVER_IMAGE = "/not-found.png";
const COVER_IMAGE_SIZE = 120;

// Helper to convert total seconds back to a simple H:M:S format for display
const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((v) => v.toString().padStart(2, "0"))
    .join(":");
};

// --- MovieCard Component (Updated with Edit Button) ---
const MovieCard = ({ movie, onEditClick }) => {
  const imageUrl = movie.coverPhoto || DEFAULT_COVER_IMAGE;

  return (
    <div className="flex items-start bg-white p-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 justify-between">
      {/* Link and Movie Info Section */}
      <Link
        href={`/stream/${movie.slug}`}
        className="flex items-start space-x-4 flex-grow min-w-0"
      >
        {/* Cover Image */}
        <div
          style={{ width: COVER_IMAGE_SIZE, height: COVER_IMAGE_SIZE * 0.5625 }}
          className="flex-shrink-0 bg-gray-100 rounded overflow-hidden"
        >
          <img
            src={imageUrl}
            alt={`Cover for ${movie.title}`}
            width={COVER_IMAGE_SIZE}
            height={COVER_IMAGE_SIZE * 0.5625}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_COVER_IMAGE;
            }}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Movie Info */}
        <div className="flex-1 min-w-0 pr-4">
          <p className="text-lg font-semibold text-gray-900 truncate">
            {movie.title}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Length: {formatTime(movie.lengthTotal)}
          </p>
          <p className="text-xs text-indigo-600 mt-1">Slug: /{movie.slug}</p>
        </div>
      </Link>

      {/* Edit Button Section */}
      <div className="flex-shrink-0 self-center">
        <button
          onClick={() => onEditClick(movie)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors shadow-md"
          aria-label={`Edit ${movie.title}`}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

// --- MovieList Component (Updated with Modal State) ---
export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movieToEdit, setMovieToEdit] = useState(null);

  // Function to fetch the entire movie list (used for initial load and after updates)
  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/movies");
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Failed to load movies:", error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Handler for when a user clicks the Edit button on a card
  const handleEditClick = (movie) => {
    // We must ensure the time values are converted from number to { h, m, s }
    const transformedMovie = {
      ...movie,
      lengthTotal: convertSecondsToHMS(movie.lengthTotal),
      lengthIntro: convertSecondsToHMS(movie.lengthIntro),
      lengthCredits: convertSecondsToHMS(movie.lengthCredits),
    };

    setMovieToEdit(transformedMovie);
    setIsModalOpen(true);
  };

  // Handler called when the form inside the modal successfully saves or deletes a movie
  const handleModalClose = (didUpdate = false) => {
    setIsModalOpen(false);
    setMovieToEdit(null);
    if (didUpdate) {
      // Re-fetch the movie list to update the cards
      fetchMovies();
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">Loading movie list...</div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Uploaded Movies ({movies.length})
      </h2>

      {movies.length === 0 ? (
        <p className="text-gray-500">
          No movies uploaded yet. Use the form to the left.
        </p>
      ) : (
        <div className="space-y-3">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onEditClick={handleEditClick} // Pass the edit handler down
            />
          ))}
        </div>
      )}

      {/* Edit Modal Component */}
      {movieToEdit && (
        <EditMovieModal
          isOpen={isModalOpen}
          movie={movieToEdit}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

/**
 * ⚠️ REQUIRED FILES:
 * 1. src/app/utils/timeConverters.js (or wherever your convertSecondsToHMS function is)
 * 2. src/app/components/MovieForm.jsx (The complete form component)
 * 3. src/app/components/EditMovieModal.jsx (The new modal component below)
 */
