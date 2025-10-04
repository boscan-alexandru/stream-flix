// src/app/api/movies/[slug]/route.js
import { NextResponse } from "next/server";
import { getMovieBySlug } from "@/app/services/movieService";

// Handler for GET requests to /api/movies/[slug]
export async function GET(request, { params }) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { error: "Slug parameter is required." },
      { status: 400 }
    );
  }

  try {
    // Call the Service Layer to fetch data from Prisma
    const movieData = await getMovieBySlug(slug);

    if (!movieData) {
      return NextResponse.json({ error: "Movie not found." }, { status: 404 });
    }

    // Return the data to the client (or in this case, the Server Component)
    return NextResponse.json(movieData);
  } catch (error) {
    console.error(`Error fetching movie data for slug ${slug}:`, error);
    return NextResponse.json(
      { error: "Internal server error while fetching movie data." },
      { status: 500 }
    );
  }
}
