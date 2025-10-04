"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// --- TIME CONVERTER HELPERS ---
const convertHMSToSeconds = ({ h, m, s }) => {
  return (
    parseInt(h || 0, 10) * 3600 +
    parseInt(m || 0, 10) * 60 +
    parseInt(s || 0, 10)
  );
};

const convertSecondsToHMS = (totalSeconds) => {
  const s = parseInt(totalSeconds || 0, 10);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return {
    h: h > 0 ? h : "",
    m: m > 0 ? m : "",
    s: sec > 0 ? sec : "",
  };
};

const handleTimeChange = (timeValue, field, part) => {
  if (timeValue === "") {
    return { ...field, [part]: "" };
  }
  const value = parseInt(timeValue, 10);
  // Allow empty string or valid number (limiting M/S to 59 is not enforced here, but good practice)
  if (isNaN(value) || value < 0) return field;

  return {
    ...field,
    [part]: value,
  };
};

// --- URL PARSER ---
const parseStreamUrl = (fullUrl) => {
  try {
    const url = new URL(fullUrl);

    // Domain: Protocol + Host (e.g., https://domain.com)
    const streamDomain = url.protocol + "//" + url.host;

    // Path: Everything after the host, before the query (e.g., /hls2/01/...)
    // We strip the leading slash from the path.
    const streamPath = url.pathname.startsWith("/")
      ? url.pathname.substring(1)
      : url.pathname;

    // Tokens: Everything in the search/query part (?t=...&s=...)
    // We strip the leading '?'
    const streamTokens = url.search.startsWith("?")
      ? url.search.substring(1)
      : url.search;

    return { streamDomain, streamPath, streamTokens };
  } catch (e) {
    // Return empty strings if the URL is invalid
    return { streamDomain: "", streamPath: "", streamTokens: "" };
  }
};

// --- INITIAL STATE STRUCTURE ---
const INITIAL_FORM_STATE = {
  title: "",
  slug: "",
  coverPhoto: "",
  subtitles: "",
  // HMS objects for form inputs
  lengthTotal: { h: "", m: "", s: "" },
  lengthIntro: { h: "", m: "", s: "" },
  lengthCredits: { h: "", m: "", s: "" },
};

// --- MOVIE FORM COMPONENT ---

export default function MovieForm({
  initialData = null, // Used for editing an existing movie
  movieId = null, // Used for the API route path
}) {
  const router = useRouter();
  const isEditing = !!movieId && !!initialData;

  // Form state for non-time fields
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [streamUrl, setStreamUrl] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to populate form when editing
  useEffect(() => {
    if (isEditing) {
      // Convert seconds back to HMS for form display
      const initialHMS = {
        lengthTotal: convertSecondsToHMS(initialData.lengthTotal),
        lengthIntro: convertSecondsToHMS(initialData.lengthIntro),
        lengthCredits: convertSecondsToHMS(initialData.lengthCredits),
      };

      setForm({
        title: initialData.title || "",
        slug: initialData.slug || "",
        coverPhoto: initialData.coverPhoto || "",
        subtitles: initialData.subtitles || "",
        ...initialHMS,
      });

      // Reconstruct the full streamUrl for the input field
      let fullUrl = initialData.streamDomain + "/" + initialData.streamPath;
      if (initialData.streamTokens) {
        fullUrl += `?${initialData.streamTokens}`;
      }
      setStreamUrl(fullUrl);
    } else {
      setForm(INITIAL_FORM_STATE);
      setStreamUrl("");
    }
    setStatus("");
  }, [initialData, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStreamUrlChange = (e) => {
    setStreamUrl(e.target.value);
  };

  const handleTimeFieldChange = (timeType, part) => (e) => {
    setForm((prev) => ({
      ...prev,
      [timeType]: handleTimeChange(e.target.value, prev[timeType], part),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(isEditing ? "Updating movie..." : "Adding new movie...");

    // --- STEP 1: Parse the single URL input ---
    const { streamDomain, streamPath, streamTokens } =
      parseStreamUrl(streamUrl);

    // Basic validation
    if (!form.title || !form.slug || !streamPath) {
      setIsSubmitting(false);
      setStatus("❌ Error: Title, Slug, and a valid Stream URL are required.");
      return;
    }

    // --- STEP 2: Construct the final payload ---
    const finalFormData = {
      ...form,
      lengthTotal: convertHMSToSeconds(form.lengthTotal),
      lengthIntro: convertHMSToSeconds(form.lengthIntro),
      lengthCredits: convertHMSToSeconds(form.lengthCredits),
      slug: form.slug.toLowerCase().trim(),
      // OVERRIDE stream fields with parsed values
      streamDomain,
      streamPath,
      streamTokens,
    };

    const method = isEditing ? "PUT" : "POST";
    // API URL depends on whether we are creating or updating
    const apiURL = isEditing ? `/api/movies/${movieId}` : "/api/movies";

    try {
      const response = await fetch(apiURL, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalFormData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(`✅ Success! Movie "${data.title}" saved.`);
        if (!isEditing) {
          // Reset for new entry
          setForm(INITIAL_FORM_STATE);
          setStreamUrl("");
        }
        // If editing, can redirect or reload the page
        // if (isEditing) router.refresh();
      } else {
        setStatus(
          `❌ Error (${response.status}): ${
            data.error || "Failed to save movie."
          }`
        );
      }
    } catch (error) {
      setStatus(
        `⚠️ Network Error: Could not connect to the server. ${error.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-xl space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-4">
        {isEditing ? `Edit Movie ID: ${movieId}` : "Create New Movie"}
      </h2>

      {/* --- CORE MOVIE DETAILS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Slug Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            pattern="[a-z0-9-]+"
            title="Slug must be lowercase letters, numbers, or hyphens."
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>
      </div>

      {/* Cover Photo URL & Subtitles */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cover Photo URL
        </label>
        <input
          type="url"
          name="coverPhoto"
          value={form.coverPhoto}
          onChange={handleChange}
          placeholder="e.g., https://example.com/cover.jpg"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subtitle Track URL (VTT/SRT)
        </label>
        <input
          type="url"
          name="subtitles"
          value={form.subtitles}
          onChange={handleChange}
          placeholder="e.g., https://example.com/subs.vtt"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* --- STREAMING URL (REVISED) --- */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800">
          Streaming URL <span className="text-red-500">*</span>
        </h3>

        {/* Single Stream URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Stream Manifest URL (HLS)
          </label>
          <input
            type="url"
            name="streamUrl"
            value={streamUrl}
            onChange={handleStreamUrlChange}
            required
            placeholder="e.g., https://domain.com/path/to/master.m3u8?t=token&s=sig"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            The link will be automatically split into Domain, Path, and Tokens.
          </p>
        </div>
      </div>

      {/* --- TIME FIELDS (LENGTHS) --- */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800">
          Timing Information (Hours:Minutes:Seconds)
        </h3>
        <p className="text-sm text-gray-500">
          Required for playback/skip features. Values are stored in seconds.
        </p>

        <TimeInput
          label="Total Movie Length"
          timeType="lengthTotal"
          timeValue={form.lengthTotal}
          onChange={handleTimeFieldChange}
          required
        />
        <TimeInput
          label="Intro End Time (Skip Intro Target)"
          timeType="lengthIntro"
          timeValue={form.lengthIntro}
          onChange={handleTimeFieldChange}
        />
        <TimeInput
          label="Credits Start Time"
          timeType="lengthCredits"
          timeValue={form.lengthCredits}
          onChange={handleTimeFieldChange}
        />
      </div>

      {/* --- SUBMIT & STATUS --- */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {isSubmitting
            ? "Processing..."
            : isEditing
            ? "Save Changes"
            : "Add Movie"}
        </button>
      </div>

      {status && (
        <p
          className={`text-center font-medium p-3 rounded-md ${
            status.startsWith("✅")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </p>
      )}
    </form>
  );
}

// --- TIME INPUT COMPONENT ---
const TimeInput = ({ label, timeType, timeValue, onChange, required }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="flex space-x-2">
      <input
        type="number"
        placeholder="H"
        value={timeValue.h}
        onChange={onChange(timeType, "h")}
        className="w-1/3 p-2 border border-gray-300 rounded-md text-center"
        required={required}
      />
      <input
        type="number"
        placeholder="M"
        value={timeValue.m}
        onChange={onChange(timeType, "m")}
        className="w-1/3 p-2 border border-gray-300 rounded-md text-center"
        required={required}
      />
      <input
        type="number"
        placeholder="S"
        value={timeValue.s}
        onChange={onChange(timeType, "s")}
        className="w-1/3 p-2 border border-gray-300 rounded-md text-center"
        required={required}
      />
    </div>
  </div>
);
