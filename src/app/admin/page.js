// src/app/admin/page.js
import MovieForm from "@/app/components/MovieForm";
import MovieList from "@/app/components/MovieList";

export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900">
        Admin Dashboard
      </h1>

      {/* Grid Layout: 2/3 for Form, 1/3 for List */}
      <div className="grid grid-cols-12 gap-8">
        {/* Form - Takes 8 out of 12 columns (2/3) */}
        <div className="col-span-12 lg:col-span-8">
          <MovieForm />
        </div>

        {/* List - Takes 4 out of 12 columns (1/3) */}
        <div className="col-span-12 lg:col-span-4">
          <MovieList />
        </div>
      </div>
    </div>
  );
}
