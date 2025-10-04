import { SocksProxyAgent } from "socks-proxy-agent"; // 👈 NEW IMPORT

// This is your external HLS server's base domain.
const STREAM_BASE_HOST = "be7713.rcr82.waw05.i8yz83pn.com";

// --- Proxy Setup Integration ---
// Get the proxy URL from environment variables
const PROXY_URL = process.env.VIDEO_PROXY_URL;
// Instantiate the agent only if the URL is present
const proxyAgent = PROXY_URL ? new SocksProxyAgent(PROXY_URL) : undefined;
if (!proxyAgent) {
  console.warn(
    "VIDEO_PROXY_URL is not set. Requests will be blocked by external CDN."
  );
}
// -----------------------------

// Note: Using "force-dynamic" or "dynamic = 'force-dynamic'" is necessary
// for streaming proxy routes to prevent caching issues.
export const dynamic = "force-dynamic";

/**
 * Handles all GET requests to /stream-proxy/[...path]
 */
export async function GET(request, { params }) {
  try {
    // 1. Reconstruct the Path and Query
    const relativePath = params.path.join("/");
    const queryString = request.url.split("?")[1] || "";
    const externalUrl = `https://${STREAM_BASE_HOST}/${relativePath}${
      queryString ? "?" + queryString : ""
    }`;

    console.log(`[PROXY] Attempting proxied request to: ${externalUrl}`);

    // --- 2. Configure Fetch Options for Proxy ---
    const fetchOptions = {
      // ⚠️ CRITICAL: Use the proxy agent
      agent: proxyAgent,
      // Set headers to mimic a common browser to avoid simple bot detection
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      // Ensure we don't accidentally cache the response
      cache: "no-store",
    };
    // ------------------------------------------

    // 3. Fetch the data from the External Server using the proxy agent
    const response = await fetch(externalUrl, fetchOptions); // 👈 UPDATED FETCH

    if (!response.ok) {
      console.error(
        `[PROXY] External fetch failed: ${response.status} ${response.statusText}`
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
    // (The rewriting logic below is already correct for HLS playback)
    const contentType = response.headers.get("content-type");

    if (
      (contentType && contentType.includes("application/vnd.apple.mpegurl")) ||
      contentType.includes("audio/mpegurl") ||
      contentType.includes("application/x-mpegURL") ||
      externalUrl.endsWith(".m3u8")
    ) {
      // It's a playlist file (.m3u8)
      const text = await response.text();

      // ... (Rest of the HLS rewriting logic remains unchanged) ...
      const externalBaseUrlMatch = externalUrl.match(
        /^(https:\/\/[^/]+\/.*)\/[^/]+(\?.*)?$/
      );
      const externalBasePath = externalBaseUrlMatch
        ? externalBaseUrlMatch[1]
        : "";

      const rewrittenText = text.replace(
        new RegExp(
          `(https?://${STREAM_BASE_HOST}|${externalBasePath})(/[^\\s\\n\\r]+)([^\\s\\n\\r]*)`,
          "g"
        ),
        (match, p1, p2, p3) => {
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
    // For all other files, stream the response body directly back to the client.
    return new Response(response.body, {
      status: 200,
      headers: response.headers,
    });
  } catch (error) {
    // If the proxy fails (e.g., bad credentials, host down), the error will be caught here.
    console.error("Proxy Fatal Error:", error);
    return new Response(
      "Internal Proxy Error: Could not connect to SOCKS5 server.",
      { status: 500 }
    );
  }
}
