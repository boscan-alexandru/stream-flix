"use client";

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Play } from "lucide-react"; // 🚀 Added import for a nice icon (You may need to install lucide-react)

// Convert seconds to a displayable format for the button (e.g., "1:30")
const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return null;
  const s = parseInt(seconds, 10);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

/**
 * HlsPlayer component initializes hls.js for video playback.
 * @param {object} props
 * @param {string} props.streamUrl - The HLS URL path and query.
 * @param {number} props.introTime - The time in seconds to skip to (start of movie).
 */
const HlsPlayer = ({ streamUrl, introTime }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const introTimeInSeconds = parseInt(introTime, 10);

  // --- New State for UI Visibility ---
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [isPointerOver, setIsPointerOver] = useState(true); // Assume active initially
  const [isPaused, setIsPaused] = useState(true);

  const pointerTimeoutRef = useRef(null);

  // --- Core Hls.js and Video Initialization (Simplified for this update) ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    // Use the proxy URL you have set up
    const proxyUrl = `/stream-proxy/${streamUrl}`;

    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.attachMedia(video);
      hls.loadSource(proxyUrl);

      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data.fatal) {
          console.error(`Hls.js Fatal Error: ${data.details}`);
          hls.destroy();
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = proxyUrl;
    }

    // Add event listeners for pause/play
    const handlePlay = () => setIsPaused(false);
    const handlePause = () => setIsPaused(true);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    // Cleanup function
    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [streamUrl]);

  // --- SKIP INTRO LOGIC ---

  // Time Update Listener to show/hide button based on playback time
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !introTimeInSeconds || introTimeInSeconds <= 0) return;

    const updateSkipButtonVisibility = () => {
      const isBeforeIntro = video.currentTime < introTimeInSeconds;

      // Only show the button if:
      // 1. We are currently in the intro phase.
      // 2. The player is not paused.
      // 3. The pointer is currently over the video element (controls are visible/active).
      setShowSkipButton(isBeforeIntro);
    };

    video.addEventListener("timeupdate", updateSkipButtonVisibility);

    // The pointer/pause state check logic is handled below. We only update setShowSkipButton here.

    return () => {
      video.removeEventListener("timeupdate", updateSkipButtonVisibility);
    };
  }, [introTimeInSeconds]);

  // --- MOUSE ACTIVITY LOGIC (Hiding the button when controls fade) ---
  const handlePointerEnter = () => {
    clearTimeout(pointerTimeoutRef.current);
    setIsPointerOver(true);
  };

  const handlePointerLeave = () => {
    // Start a timer to hide the button after a delay (similar to controls)
    pointerTimeoutRef.current = setTimeout(() => {
      setIsPointerOver(false);
    }, 3000); // 3 seconds delay before hiding
  };

  // --- The Skip function ---
  const handleSkipIntro = () => {
    const video = videoRef.current;
    if (video && introTimeInSeconds > 0) {
      video.currentTime = introTimeInSeconds;
      setShowSkipButton(false); // Hide immediately after skipping
    }
  };

  // The button should be displayed only if:
  // 1. The playback time is before the intro end time (determined by timeupdate)
  // 2. The mouse is currently over the player area (isPointerOver is true)
  // 3. The video is playing (isPaused is false) - optional, but standard
  const shouldShowButton = showSkipButton && isPointerOver && !isPaused;
  const skipToTimeDisplay = formatDuration(introTimeInSeconds);

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
    >
      <video
        ref={videoRef}
        controls
        autoPlay={false}
        className="w-full h-full object-contain bg-black"
      />

      {/* Skip Intro Button UI */}
      {shouldShowButton && (
        <button
          onClick={handleSkipIntro}
          // 🚀 Improved, professional styling
          className={`
                    absolute right-4 bottom-4 md:right-8 md:bottom-8 
                    bg-gray-100/20 backdrop-blur-sm 
                    text-white font-bold py-3 px-6 rounded-full 
                    flex items-center space-x-2 
                    shadow-2xl z-20 transition-opacity duration-300
                    border border-white/30
                    hover:bg-white/30
                `}
          title={`Skip to ${skipToTimeDisplay}`}
        >
          {/* Use an icon for visual appeal */}
          <Play className="h-5 w-5 fill-white" />
          <span>Skip Intro</span>
        </button>
      )}
    </div>
  );
};

export default HlsPlayer;
