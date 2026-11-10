"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function StaffDashboard() {
  return (
    <ProtectedRoute allowedRole="staff">
      <main className="min-h-screen bg-[#071226] p-8 text-white">
        <h1 className="text-3xl font-bold">
          Staff Dashboard
        </h1>

        <p className="mt-3 text-slate-400">
          Welcome to Smart Campus Staff Portal!
        </p>
      </main>
    </ProtectedRoute>
  );
}