// This is your external HLS server's base domain.
// You must use the host name ONLY (no http/https or trailing slash).
const STREAM_BASE_HOST = "be7713.rcr82.waw05.i8yz83pn.com";

// Note: Using "force-dynamic" or "dynamic = 'force-dynamic'" is necessary
// for streaming proxy routes to prevent caching issues.
export const dynamic = "force-dynamic";

/**
 * Handles all GET requests to /stream-proxy/[...path]
 */
export async function GET(request, { params }) {
  try {
    // 1. Reconstruct the Path and Query
    // 'params.path' is an array of URL segments after '/stream-proxy/'.
    // Example: ['hls2', '01', '03454', 'n4afqaq1f3fz_x', 'index-v1-a1.m3u8']
    const relativePath = params.path.join("/");

    // The query string remains the same as the client's request
    const queryString = request.url.split("?")[1] || "";

    // 2. Build the FULL External URL
    const externalUrl = `https://${STREAM_BASE_HOST}/${relativePath}${
      queryString ? "?" + queryString : ""
    }`;

    console.log(`Proxying request to: ${externalUrl}`);

    // 3. Fetch the data from the External Server
    const response = await fetch(externalUrl);

    if (!response.ok) {
      console.error(
        `External fetch failed: ${response.status} ${response.statusText}`
      );
      // Pass the error status back to the client
      return new Response(
        `Error fetching stream data: ${response.statusText}`,
        {
          status: response.status,
          headers: { "Content-Type": "text/plain" },
        }
      );
    }

    // 4. Handle and Rewrite the M3U8 Playlist Content
    // This is the CRITICAL STEP for HLS playback.
    // The manifest files (.m3u8) contain relative or absolute URLs to other files (chunks, keys).
    // We must rewrite the URLs *inside* the manifest to point back to our proxy.
    const contentType = response.headers.get("content-type");

    if (
      (contentType && contentType.includes("application/vnd.apple.mpegurl")) ||
      contentType.includes("audio/mpegurl") ||
      contentType.includes("application/x-mpegURL") ||
      externalUrl.endsWith(".m3u8")
    ) {
      // It's a playlist file (.m3u8)
      const text = await response.text();

      // The base URL for the HLS path *inside* the manifest is always
      // the external URL's path minus the specific manifest file itself.
      const externalBaseUrlMatch = externalUrl.match(
        /^(https:\/\/[^/]+\/.*)\/[^/]+(\?.*)?$/
      );
      const externalBasePath = externalBaseUrlMatch
        ? externalBaseUrlMatch[1]
        : "";

      // The URL where the client is expecting the new chunks/keys to load from
      const proxyBaseUrl = `/stream-proxy/${params.path
        .slice(0, -1)
        .join("/")}`;

      // Regex to find all external URLs in the manifest and replace them
      // We look for 'https://' followed by the stream host to ensure we only
      // rewrite URLs that belong to the stream server, not external keys if they exist.
      const rewrittenText = text.replace(
        new RegExp(
          `(https?://${STREAM_BASE_HOST}|${externalBasePath})(/[^\\s\\n\\r]+)([^\\s\\n\\r]*)`,
          "g"
        ),
        (match, p1, p2, p3) => {
          // p1: The external base (e.g., https://be7713.rcr82.waw05.i8yz83pn.com/hls2/01/03454/n4afqaq1f3fz_x)
          // p2: The file path (e.g., /index-v1-a1.m3u8 or /seg-1-v1-a1.ts)
          // p3: The query string (e.g., ?t=...&s=...)

          // To maintain the correct path structure for our proxy:
          // The proxy prefix: /stream-proxy
          // The HLS path: /hls2/01/03454/n4afqaq1f3fz_x
          // The rest of the path (which starts with a '/'): index-v1-a1.m3u8?t=...

          // Recreate the new URL pointing back to our proxy
          // Note: We use the entire path (p2) because the rewrite needs to
          // point to the proxy's root followed by the full HLS resource path.
          // The `p2` variable here is the relative path from the domain root.
          return `/stream-proxy${p2}${p3}`;
        }
      );

      // Return the rewritten manifest to the client
      return new Response(rewrittenText, {
        status: 200,
        headers: response.headers,
      });
    }

    // 5. Handle all other files (TS segments, Key files)
    // For all other files (like .ts video chunks or .key encryption files),
    // we simply stream the response body directly back to the client.
    return new Response(response.body, {
      status: 200,
      headers: response.headers,
    });
  } catch (error) {
    console.error("Proxy Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
