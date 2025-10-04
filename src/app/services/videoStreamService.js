// /app/services/videoStreamService.js

import { HttpsProxyAgent } from "https-proxy-agent";

// Get the proxy URL from environment variables
const PROXY_URL = process.env.VIDEO_PROXY_URL;
const proxyAgent = PROXY_URL ? new HttpsProxyAgent(PROXY_URL) : undefined;

// This function simulates fetching the final video stream URL from the blocked domain
export async function fetchVideoStreamUrl(externalId) {
  // 1. Construct the external URL (this part depends on your exact logic)
  const baseBlockedDomain = "https://be2719.rcr22.ams01.i8yz83pn.com";
  // You need the full path, which likely includes the externalId and the security tokens
  const fullStreamFetchUrl = `${baseBlockedDomain}/hls2/.../${externalId}/master.m3u8?t=...`;

  if (!proxyAgent) {
    console.warn(
      "VIDEO_PROXY_URL is not set. Fetching stream directly (may be blocked)."
    );
  }

  try {
    const fetchOptions = {
      // Use the proxy agent
      agent: proxyAgent,
      // Use a common User-Agent to further evade detection
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    };

    // Perform the request through the proxy
    const response = await fetch(fullStreamFetchUrl, fetchOptions);

    if (!response.ok) {
      // If the proxy fails or the host still blocks
      throw new Error(
        `External stream fetch failed with status: ${response.status}`
      );
    }

    // Since the actual stream URL is likely what you need to return
    // to the client's video player, you return the original URL,
    // assuming this fetch merely validated it or retrieved dynamic tokens.
    // If the server must download the playlist content, you would handle that here.

    // Returning the URL that was successfully fetched via proxy
    return fullStreamFetchUrl;
  } catch (error) {
    console.error(
      `[STREAM FETCH ERROR] Could not fetch stream via proxy:`,
      error.message
    );
    return null; // Return null if fetching the URL fails
  }
}
