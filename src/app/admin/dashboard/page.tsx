"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRole="admin">
      <main className="min-h-screen bg-[#071226] p-8 text-white">
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-3 text-slate-400">
          Welcome to Smart Campus Administration!
        </p>
      </main>
    </ProtectedRoute>
  );
}