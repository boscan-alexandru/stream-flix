// src/app/components/EditMovieModal.jsx

"use client";

import { useState } from "react";
import MovieForm from "@/app/components/MovieForm"; // Re-use the form component

// Note: Tailwind CSS classes like 'fixed', 'inset-0', 'bg-opacity-75', 'z-50'
// are required for the modal to display correctly over the page.

const EditMovieModal = ({ isOpen, movie, onClose }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const movieId = movie.id;

  // --- DELETE Functionality (Moved here for clean separation) ---
  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${movie.title}"? This cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/movies/${movieId}`, {
        method: "DELETE",
      });

      if (response.status === 204) {
        alert(`✅ Movie "${movie.title}" deleted successfully.`);
        // Close modal and signal to parent to refresh the list (true)
        onClose(true);
      } else {
        const data = await response.json();
        alert(`❌ Error deleting movie: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      alert(`⚠️ Network Error: Failed to connect to server.`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={() => onClose()}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors text-3xl"
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="p-8">
          <h1 className="text-3xl font-extrabold mb-6 text-gray-900">
            Edit Movie: {movie.title}
          </h1>

          {/* MovieForm component, re-used for editing */}
          <MovieForm
            initialState={movie}
            movieId={movieId}
            // After successful update, close the modal and refresh the list
            onSuccess={() => onClose(true)}
          />

          {/* Delete Section */}
          <div className="border-t pt-6 mt-6 border-red-200">
            <h2 className="text-xl font-semibold text-red-700 mb-4">
              Danger Zone
            </h2>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 shadow-md"
            >
              {isDeleting ? "Deleting..." : `Delete Movie: ${movie.title}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMovieModal;
