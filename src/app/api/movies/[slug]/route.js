// /app/api/movies/[slug]/route.js
import { NextResponse } from "next/server";
import { getMovieBySlug } from "@/app/services/movieService";
import { HttpsProxyAgent } from "https-proxy-agent";
import { fetchVideoStreamUrl } from "@/app/services/videoStreamService"; // Assuming a new service

// Handler for GET requests to /api/movies/[slug]
export async function GET(request, { params }) {
  const { slug } = params; // params is already an object, no need for 'await'

  if (!slug) {
    return NextResponse.json(
      { error: "Slug parameter is required." },
      { status: 400 }
    );
  }

  try {
    // 1. Fetch the core movie data from Prisma (using existing service)
    const movieData = await getMovieBySlug(slug);

    if (!movieData) {
      return NextResponse.json({ error: "Movie not found." }, { status: 404 });
    }

    // 2. Fetch the external video stream URL (using a new service that handles the proxy)
    // NOTE: Replace 'movieData.externalStreamId' with the actual field that holds the required ID or base URL.
    const externalId = movieData.externalStreamId; // Example placeholder

    if (externalId) {
      console.log(`[SERVER] Fetching stream URL for: ${slug}`);

      // We assume fetchVideoStreamUrl handles the proxy internally
      const streamUrl = await fetchVideoStreamUrl(externalId);

      if (streamUrl) {
        // Attach the working stream URL to the movie data object
        movieData.streamUrl = streamUrl;
      } else {
        console.warn(
          `[SERVER] Failed to get stream URL for ${slug}. Continuing with movie data.`
        );
        // You can choose to throw an error here if the stream URL is critical
      }
    }

    // 3. Return the enhanced data to the client
    return NextResponse.json(movieData);
  } catch (error) {
    console.error(`Error fetching movie data for slug ${slug}:`, error);
    return NextResponse.json(
      { error: "Internal server error while fetching movie data." },
      { status: 500 }
    );
  }
}

// ⚠️ IMPORTANT NEXT STEP:
// You must create the 'videoStreamService.js' file and implement
// the proxy-enabled fetch logic there.
