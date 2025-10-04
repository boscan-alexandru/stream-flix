// src/app/components/SearchBar.jsx
"use client";

import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  // 💡 NOTE: In a real app, this function would perform client-side routing
  // or trigger a search API call.
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      console.log(`Searching for: ${query}`);
      // Example routing: router.push(`/search?q=${query}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-sm">
      <input
        type="text"
        placeholder="Search movies, shows..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-white/10 text-white placeholder-gray-400 
                   py-2 pl-4 pr-10 rounded-full 
                   border border-white/20 focus:border-indigo-400 
                   focus:ring-1 focus:ring-indigo-400 transition duration-150"
      />
      <button
        type="submit"
        className="absolute right-0 top-0 h-full w-10 text-gray-300 hover:text-indigo-400 transition"
        aria-label="Search"
      >
        <Search className="h-5 w-5 mx-auto" />
      </button>
    </form>
  );
}
