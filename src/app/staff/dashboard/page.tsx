"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import StaffSidebar from "@/components/StaffSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import {
  LayoutDashboard,
  ClipboardList,
  Clock,
  CheckCircle,
  LoaderCircle,
  Menu,
  ArrowRight,
  AlertCircle,
  CalendarDays,
  Wrench,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Complaint {
  _id: string;
  title: string;
  category: string;
  building: string;
  room: string;
  priority: string;
  status: string;
  createdAt: string;
  assignedAt?: string;
}

interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

interface DashboardData {
  success: boolean;
  stats: DashboardStats;
  recentDuties: Complaint[];
}

function StaffDashboardContent() {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  const [recentDuties, setRecentDuties] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/complaints/staff/dashboard`,
          {
            credentials: "include",
          }
        );

        const data: DashboardData = await response.json();

        if (!response.ok || !data.success) {
          throw new Error("Failed to load dashboard data.");
        }

        setStats(data.stats);
        setRecentDuties(data.recentDuties || []);
      } catch (error) {
        console.error("Staff dashboard error:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Could not load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const statCards = [
    {
      title: "Total Assigned",
      value: stats.total,
      icon: ClipboardList,
      color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Wrench,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    },
    {
      title: "Resolved",
      value: stats.resolved,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    },
  ];

  return (
    <ProtectedRoute allowedRole="staff">
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-[#071226] dark:text-white">
        <StaffSidebar
          mobileOpen={mobileOpen}
          closeMobile={() => setMobileOpen(false)}
        />

        <main className="min-h-screen lg:ml-72">
          <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 transition-colors dark:border-slate-800 dark:bg-[#0b1730] sm:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>

              <div>
                <h1 className="text-xl font-bold sm:text-2xl">
                  Staff Dashboard
                </h1>
                <p className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
                  Manage your assigned campus complaints.
                </p>
              </div>
            </div>

            <ThemeToggle />
          </header>

          <div className="p-5 sm:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">
                Welcome to Your Workspace
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Track your assigned duties and monitor complaint progress.
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-[#0b1930]"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {card.title}
                        </p>

                        <h3 className="mt-3 text-3xl font-bold">
                          {loading ? (
                            <LoaderCircle
                              className="animate-spin text-indigo-500"
                              size={28}
                            />
                          ) : (
                            card.value
                          )}
                        </h3>
                      </div>

                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
                      >
                        <Icon size={24} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mb-8 grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0b1930]">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <LayoutDashboard size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Assigned Duties
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Your current workload
                    </p>
                  </div>
                </div>

                <p className="text-3xl font-bold">
                  {loading ? "..." : stats.total}
                </p>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Total complaints assigned to you.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0b1930]">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                    <CheckCircle size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Completed Duties
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Successfully resolved
                    </p>
                  </div>
                </div>

                <p className="text-3xl font-bold">
                  {loading ? "..." : stats.resolved}
                </p>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Complaints marked as resolved.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1930]">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-6 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-bold">
                    Recent Assigned Complaints
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Your latest assigned duties.
                  </p>
                </div>

                <Link
                  href="/staff/complaints"
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                  View All
                  <ArrowRight size={16} />
                </Link>
              </div>

              {loading ? (
                <div className="flex items-center justify-center gap-3 py-16 text-slate-500 dark:text-slate-400">
                  <LoaderCircle
                    className="animate-spin"
                    size={22}
                  />
                  Loading assigned complaints...
                </div>
              ) : recentDuties.length === 0 ? (
                <div className="py-16 text-center">
                  <ClipboardList
                    size={42}
                    className="mx-auto mb-4 text-slate-300 dark:text-slate-600"
                  />

                  <h3 className="font-semibold">
                    No Assigned Complaints
                  </h3>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    New duties will appear here when assigned by the admin.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 dark:bg-[#101f38] dark:text-slate-400">
                      <tr>
                        <th className="px-6 py-4 font-medium">
                          Complaint
                        </th>
                        <th className="px-6 py-4 font-medium">
                          Category
                        </th>
                        <th className="px-6 py-4 font-medium">
                          Priority
                        </th>
                        <th className="px-6 py-4 font-medium">
                          Status
                        </th>
                        <th className="px-6 py-4 font-medium">
                          Date
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {recentDuties.map((complaint) => (
                        <tr
                          key={complaint._id}
                          className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                        >
                          <td className="px-6 py-4">
                            <p className="font-semibold">
                              {complaint.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {complaint.building}
                              {complaint.room
                                ? ` • Room ${complaint.room}`
                                : ""}
                            </p>
                          </td>

                          <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                            {complaint.category}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                complaint.priority === "High"
                                  ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                                  : complaint.priority === "Medium"
                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
                                    : "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                              }`}
                            >
                              {complaint.priority}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                complaint.status === "Resolved"
                                  ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                                  : complaint.status === "In Progress"
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
                              }`}
                            >
                              {complaint.status}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-2">
                              <CalendarDays size={15} />
                              {new Date(
                                complaint.assignedAt ||
                                  complaint.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function StaffDashboard() {
  return <StaffDashboardContent />;
}