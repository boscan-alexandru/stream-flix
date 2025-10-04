// src/app/components/EditFormWrapper.jsx

"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import MovieForm from "@/app/components/MovieForm";
import { convertSecondsToHMS } from "@/app/utils/timeConverters"; // The required import

// ❌ REMOVED the local function definition here:
// The imported function 'convertSecondsToHMS' is now assumed to exist and be correct.

export default function EditFormWrapper({ initialMovieData }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const movieId = initialMovieData.id;

  // Transform seconds (from DB) back into the { h, m, s } structure
  const transformedInitialData = useMemo(
    () => ({
      ...initialMovieData,
      // NOTE: The utility function must return { h, m, s } or be adjusted
      // The current usage implies convertSecondsToHMS returns an object.
      lengthTotal: convertSecondsToHMS(initialMovieData.lengthTotal),
      lengthIntro: convertSecondsToHMS(initialMovieData.lengthIntro),
      lengthCredits: convertSecondsToHMS(initialMovieData.lengthCredits),
    }),
    [initialMovieData]
  );

  // --- DELETE Functionality ---
  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${initialMovieData.title}"?`
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
        alert(`✅ Movie "${initialMovieData.title}" deleted successfully.`);
        // Redirect back to the admin dashboard
        router.push("/admin");
        router.refresh();
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
    <div className="space-y-8">
      {/* 1. Pass data to a modified MovieForm instance */}
      <MovieForm
        initialState={transformedInitialData}
        movieId={movieId}
        // NOTE: You must update MovieForm.jsx to accept initialState and use PUT if movieId is present.
      />

      {/* 2. Delete Button */}
      <div className="border-t pt-6 mt-6 border-gray-200">
        <h2 className="text-xl font-semibold text-red-700 mb-4">Danger Zone</h2>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
        >
          {isDeleting
            ? "Deleting..."
            : `Delete Movie: ${initialMovieData.title}`}
        </button>
      </div>
    </div>
  );
}
