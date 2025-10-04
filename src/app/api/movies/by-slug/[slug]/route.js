// src/app/api/movies/by-slug/[slug]/route.js

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// --- GET: Fetch Single Movie by Slug ---
export async function GET(request, { params }) {
  // 💡 FINAL FIX: Await the params object before using its properties.
  // This satisfies the Next.js runtime's requirement for synchronous dynamic APIs.
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { error: "Slug parameter is missing" },
      { status: 400 }
    );
  }

  try {
    const movie = await prisma.movie.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    // Return the movie object
    return NextResponse.json(movie, { status: 200 });
  } catch (error) {
    console.error("Database Error fetching movie by slug:", error);
    return NextResponse.json(
      { error: "Failed to retrieve movie data" },
      { status: 500 }
    );
  }
}
