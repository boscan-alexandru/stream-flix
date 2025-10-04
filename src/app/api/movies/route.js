// src/app/api/movies/route.js

import { NextResponse } from "next/server";
// Import both creation and retrieval functions from your service
import { createMovie, getAllMovies } from "@/app/services/movieService";

// --- HANDLER FOR GET REQUESTS (Listing Movies) ---
export async function GET() {
  try {
    // 1. Call the Service Layer to fetch all movies from Prisma
    const movies = await getAllMovies();

    // 2. Return the list of movies as a JSON response
    return NextResponse.json(movies, { status: 200 });
  } catch (error) {
    console.error("Error fetching movie list:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching movie list." },
      { status: 500 }
    );
  }
}

// --- HANDLER FOR POST REQUESTS (Creating a Movie) ---
export async function POST(request) {
  try {
    const movieData = await request.json();

    // 1. Server-side validation
    if (
      !movieData.title ||
      !movieData.slug ||
      !movieData.streamPath ||
      !movieData.lengthTotal
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, slug, streamPath, or lengthTotal.",
        },
        { status: 400 }
      );
    }

    // 2. Call the service to save the movie via Prisma
    const savedMovie = await createMovie(movieData);

    return NextResponse.json(savedMovie, { status: 201 });
  } catch (error) {
    console.error("Error saving movie:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Slug is already in use. Please choose a different one." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process request due to a server error." },
      { status: 500 }
    );
  }
}
