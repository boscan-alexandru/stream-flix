// src/app/page.js

import MovieGallery from "@/app/components/MovieGallery";
import GlassHeader from "@/app/components/GlassHeader";
import HomePageBanner from "@/app/components/HomePageBanner"; // 🚀 Import the new banner

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Fixed Header */}
      <GlassHeader />

      <main className="pt-16">
        {" "}
        {/* Padding for the fixed header */}
        {/* 🚀 NEW: The Home Page Banner */}
        <HomePageBanner />
        {/* The Movie Gallery/Carousel Component */}
        {/* You can add an ID here to link from the banner's "Start Watching Now" button */}
        <section id="movies-gallery">
          <MovieGallery />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-gray-500 text-sm py-4 border-t border-gray-800">
        &copy; {new Date().getFullYear()} StreamFlix. All rights reserved.
      </footer>
    </div>
  );
}
