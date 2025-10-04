// src/services/movieService.js

// 🚨 IMPORTANT: Replace this with the actual path to your Prisma client import.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // Instantiate the client

// --- CREATE ---

/**
 * Creates a new movie record in the database.
 * Used by POST /api/movies.
 * @param {object} data - Movie data from the form payload.
 * @returns {Promise<object>} The newly created movie record.
 */
export async function createMovie(data) {
  try {
    const newMovie = await prisma.movie.create({
      data: {
        title: data.title,
        slug: data.slug,
        streamDomain: data.streamDomain,
        streamPath: data.streamPath,
        streamTokens: data.streamTokens,
        lengthTotal: data.lengthTotal || null,
        lengthIntro: data.lengthIntro || null,
        lengthCredits: data.lengthCredits || null,
        coverPhoto: data.coverPhoto,
        subtitles: data.subtitles,
        // Include any other required fields
      },
    });
    return newMovie;
  } catch (error) {
    console.error("[Prisma Error] Failed to create movie:", error);
    throw error;
  }
}

// -----------------------------------------------------------------------------

// --- READ ---

/**
 * Retrieves a movie by its slug.
 * Used by /stream/[slug]/page.js (Server Component).
 * @param {string} slug - The URL-friendly identifier for the movie.
 * @returns {Promise<object|null>} The movie record or null if not found.
 */
export async function getMovieBySlug(slug) {
  try {
    const movie = await prisma.movie.findUnique({
      where: { slug: slug },
      select: {
        id: true,
        title: true,
        slug: true,
        streamPath: true,
        streamTokens: true,
        streamDomain: true,
        lengthTotal: true,
        lengthIntro: true,
        lengthCredits: true,
        // Include other fields needed for the StreamPage UI
      },
    });
    return movie;
  } catch (error) {
    console.error("[Prisma Error] Failed to get movie by slug:", error);
    return null;
  }
}

/**
 * Retrieves a movie by its primary ID.
 * Used for fetching data to pre-populate the edit form.
 * @param {number} id - The movie's primary ID.
 * @returns {Promise<object|null>} The movie record or null if not found.
 */
export async function getMovieById(id) {
  try {
    // Ensure the ID is a number, as Prisma expects integers for IDs
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    const movie = await prisma.movie.findUnique({
      where: { id: numericId },
    });
    return movie;
  } catch (error) {
    console.error("[Prisma Error] Failed to get movie by ID:", error);
    return null;
  }
}

/**
 * Retrieves all movies. (Useful for listing in the admin area).
 * @returns {Promise<object[]>} An array of all movie records.
 */
export async function getAllMovies() {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: { title: "asc" }, // Example: order by title
    });
    return movies;
  } catch (error) {
    console.error("[Prisma Error] Failed to get all movies:", error);
    return [];
  }
}

// -----------------------------------------------------------------------------

// --- UPDATE ---

/**
 * Updates an existing movie record.
 * Used by PUT /api/movies/[id].
 * @param {number} id - The ID of the movie to update.
 * @param {object} data - The fields to update.
 * @returns {Promise<object>} The updated movie record.
 */
export async function updateMovie(id, data) {
  try {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId))
      throw new Error("Invalid Movie ID provided for update.");

    const updatedMovie = await prisma.movie.update({
      where: { id: numericId },
      data: {
        // Ensure you only pass fields that can be updated
        title: data.title,
        slug: data.slug,
        streamDomain: data.streamDomain,
        streamPath: data.streamPath,
        streamTokens: data.streamTokens,
        lengthTotal: data.lengthTotal || null,
        lengthIntro: data.lengthIntro || null,
        lengthCredits: data.lengthCredits || null,
        coverPhoto: data.coverPhoto,
        subtitles: data.subtitles,
        // ... include other updateable fields
      },
    });
    return updatedMovie;
  } catch (error) {
    console.error(`[Prisma Error] Failed to update movie ID ${id}:`, error);
    throw error;
  }
}

// -----------------------------------------------------------------------------

// --- DELETE ---

/**
 * Deletes a movie record by ID.
 * Used by DELETE /api/movies/[id].
 * @param {number} id - The ID of the movie to delete.
 * @returns {Promise<object>} The deleted movie record.
 */
export async function deleteMovie(id) {
  try {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId))
      throw new Error("Invalid Movie ID provided for deletion.");

    const deletedMovie = await prisma.movie.delete({
      where: { id: numericId },
    });
    return deletedMovie;
  } catch (error) {
    console.error(`[Prisma Error] Failed to delete movie ID ${id}:`, error);
    throw error;
  }
}
