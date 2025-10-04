import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Helper to convert H:M:S structure back to total seconds
const convertHMSToSeconds = ({ h, m, s }) => {
  // Ensure we handle non-string/non-number values gracefully by defaulting to 0
  return (
    parseInt(h || 0, 10) * 3600 +
    parseInt(m || 0, 10) * 60 +
    parseInt(s || 0, 10)
  );
};

// Helper to safely process a time field
const processTimeField = (value) => {
  // 1. If the value is already a number (or string representation of a number), return it.
  // This handles direct API calls like the one you made.
  if (typeof value === "number" && !isNaN(value)) {
    return value;
  }
  // 2. If the value is an object, assume it's the {h, m, s} structure and convert it.
  // This handles the data coming from your MovieForm component.
  if (typeof value === "object" && value !== null) {
    return convertHMSToSeconds(value);
  }
  // 3. Otherwise, default to 0.
  return 0;
};

// --- GET: Fetch Single Movie by ID ---
export async function GET(request, { params }) {
  const movieId = params.id;

  try {
    const movie = await prisma.movie.findUnique({
      where: { id: parseInt(movieId, 10) },
    });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(movie, { status: 200 });
  } catch (error) {
    console.error("Error fetching movie:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const movieId = params.id;
  let body;

  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Prepare the data to update
  const dataToUpdate = {
    ...body,
    // --- FIX APPLIED HERE ---
    // Safely process each time field. If it's an integer, it passes through. If it's {h,m,s}, it gets converted.
    lengthTotal:
      body.lengthTotal !== undefined
        ? processTimeField(body.lengthTotal)
        : undefined,
    lengthIntro:
      body.lengthIntro !== undefined
        ? processTimeField(body.lengthIntro)
        : undefined,
    lengthCredits:
      body.lengthCredits !== undefined
        ? processTimeField(body.lengthCredits)
        : undefined,
  };

  // Clean up undefined values (Prisma ignores undefined but it's good practice)
  Object.keys(dataToUpdate).forEach((key) => {
    if (dataToUpdate[key] === undefined) {
      delete dataToUpdate[key];
    }
  });

  // Remove the ID field to prevent Prisma errors
  delete dataToUpdate.id;

  try {
    const updatedMovie = await prisma.movie.update({
      where: { id: parseInt(movieId, 10) },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedMovie, { status: 200 });
  } catch (error) {
    console.error("Error updating movie:", error);
    // If you see validation errors here, check your Prisma schema constraints
    return NextResponse.json(
      { error: "Failed to update movie" },
      { status: 500 }
    );
  }
}

// --- DELETE: Delete Movie by ID ---
export async function DELETE(request, { params }) {
  const movieId = params.id;

  try {
    await prisma.movie.delete({
      where: { id: parseInt(movieId, 10) },
    });

    return new NextResponse(null, { status: 204 }); // 204 No Content on successful deletion
  } catch (error) {
    console.error("Error deleting movie:", error);
    return NextResponse.json(
      { error: "Failed to delete movie" },
      { status: 500 }
    );
  }
}
