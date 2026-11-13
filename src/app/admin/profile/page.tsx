"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminSidebar from "@/components/AdminSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import {
  UserRound,
  Mail,
  ShieldCheck,
  CalendarDays,
  LoaderCircle,
  Menu,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Admin {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

function AdminProfileContent() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load profile.");
        }

        setAdmin(data.user);
      } catch (error) {
        console.error("Admin profile error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 transition-colors dark:bg-[#071226]">
      <AdminSidebar
        mobileOpen={mobileOpen}
        closeMobile={() => setMobileOpen(false)}
      />

      <main className="min-h-screen md:ml-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-[#0b1930]/90 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
            >
              <Menu size={22} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                Admin Profile
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                View your account information
              </p>
            </div>
          </div>

          <ThemeToggle />
        </header>

        <div className="mx-auto max-w-5xl p-5 md:p-8">
          {loading ? (
            <div className="flex min-h-[60vh] items-center justify-center">
              <LoaderCircle
                size={36}
                className="animate-spin text-indigo-500"
              />
            </div>
          ) : !admin ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-[#0b1930]">
              <UserRound
                size={40}
                className="mx-auto text-slate-400"
              />
              <h2 className="mt-4 text-lg font-semibold text-slate-800 dark:text-white">
                Unable to load profile
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Please refresh the page and try again.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0b1930]">
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600" />

                <div className="px-6 pb-7">
                  <div className="-mt-12 flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-indigo-100 text-3xl font-bold text-indigo-600 shadow-md dark:border-[#0b1930] dark:bg-indigo-950 dark:text-indigo-300">
                    {admin.name?.charAt(0).toUpperCase()}
                  </div>

                  <div className="mt-4">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                      {admin.name}
                    </h2>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        Administrator
                      </span>

                      <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0b1930]">
                <h3 className="mb-6 text-lg font-bold text-slate-800 dark:text-white">
                  Account Information
                </h3>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                      <UserRound size={21} />
                    </div>

                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Full Name
                      </p>
                      <p className="mt-1 font-semibold text-slate-800 dark:text-white">
                        {admin.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                      <Mail size={21} />
                    </div>

                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Email Address
                      </p>
                      <p className="mt-1 break-all font-semibold text-slate-800 dark:text-white">
                        {admin.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-950 dark:text-purple-300">
                      <ShieldCheck size={21} />
                    </div>

                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Account Role
                      </p>
                      <p className="mt-1 font-semibold capitalize text-slate-800 dark:text-white">
                        {admin.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-green-100 p-3 text-green-600 dark:bg-green-950 dark:text-green-300">
                      <CalendarDays size={21} />
                    </div>

                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Account Created
                      </p>
                      <p className="mt-1 font-semibold text-slate-800 dark:text-white">
                        {admin.createdAt
                          ? new Date(admin.createdAt).toLocaleDateString()
                          : "Not available"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AdminProfilePage() {
  return (
    <ProtectedRoute allowedRole="admin">
      <AdminProfileContent />
    </ProtectedRoute>
  );
}