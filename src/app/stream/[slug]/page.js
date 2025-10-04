// src/app/stream/[slug]/page.js
// This is a Server Component, responsible for fetching movie details via the API.

import HlsPlayer from "@/app/components/HlsPlayer";
import GlassHeader from "@/app/components/GlassHeader"; // 🚀 New Import
import { notFound } from "next/navigation";
import { headers } from "next/headers";

/**
 * Fetches movie data from the local API Route Handler (/api/movies/[slug]).
 * [Keep fetchMovieData function as is]
 */
async function fetchMovieData(slug) {
  const host = headers().get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const apiUrl = `${protocol}://${host}/api/movies/${slug}`;

  console.log(`[SERVER] Attempting internal API fetch: ${apiUrl}`);

  try {
    const res = await fetch(apiUrl, {
      cache: "no-store",
    });

    if (res.status === 404) {
      console.warn(`Movie with slug "${slug}" not found (404).`);
      return null;
    }

    if (!res.ok) {
      console.error(`API fetch failed with status: ${res.status}`);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error(`Network or fetching error for slug ${slug}:`, error);
    return null;
  }
}

export default async function StreamPage({ params }) {
  const { slug } = params;

  const movieData = await fetchMovieData(slug);

  if (!movieData) {
    return notFound();
  }

  const { title, streamPath, streamTokens, lengthIntro } = movieData;

  let streamUrlForPlayer = streamPath;
  if (streamTokens) {
    const tokens = streamTokens.startsWith("?")
      ? streamTokens.substring(1)
      : streamTokens;
    streamUrlForPlayer += `?${tokens}`;
  }

  const streamStatus = "Active";
  const introTimeDisplay = lengthIntro
    ? `${Math.floor(lengthIntro / 60)}m ${lengthIntro % 60}s`
    : "N/A";

  return (
    // 🚀 Added pt-16 to the main container to account for the fixed header height (h-16)
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center pt-16">
      {/* 🚀 NEW: Glass Header Component */}
      <GlassHeader />

      <main className="w-full max-w-4xl p-4 sm:p-8">
        {/* Video Player Container */}
        <div className="relative aspect-video bg-black rounded-lg shadow-2xl overflow-hidden">
          <HlsPlayer streamUrl={streamUrlForPlayer} introTime={lengthIntro} />
        </div>

        {/* Stream Information */}
        <section className="mt-8 bg-gray-800 p-6 rounded-lg shadow-xl">
          {/* Moved Title here to be closer to the info section */}
          <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>

          <div className="flex gap-3 items-center border-b border-gray-700 pb-2 mb-2">
            <p className="text-gray-400">Status:</p>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                streamStatus === "Active" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {streamStatus.toUpperCase()}
            </span>
          </div>
          <p className="text-gray-300 text-sm">
            You are watching <strong>{title}</strong>. Click the play button to
            begin playback. Intro ends at: <strong>{introTimeDisplay}</strong>.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 w-full max-w-4xl text-center text-gray-500 text-sm p-4">
        &copy; {new Date().getFullYear()} StreamService Inc. All rights
        reserved.
      </footer>
    </div>
  );
}
