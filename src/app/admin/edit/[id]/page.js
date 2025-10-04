// src/app/admin/edit/[id]/page.js
import EditFormWrapper from "@/app/components/EditFormWrapper";
import { notFound } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Server-side function to fetch the movie data
async function getMovieData(movieId) {
  // Use the ID API route created earlier
  const API_URL = `${API_BASE}/api/movies/${movieId}`;

  try {
    const response = await fetch(API_URL, {
      cache: "no-store", // Always fetch fresh data for editing
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Server Fetch Error:", error);
    return null;
  }
}

export default async function EditMoviePage({ params }) {
  const { id } = params;

  // 1. Fetch movie data
  const movieData = await getMovieData(id);

  if (!movieData) {
    notFound();
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900">
        Edit Movie: {movieData.title}
      </h1>

      {/* 2. Pass the initial data and the ID to the client component */}
      <EditFormWrapper initialMovieData={movieData} />
    </div>
  );
}
