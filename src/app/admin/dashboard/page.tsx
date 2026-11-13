"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminSidebar from "@/components/AdminSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import {
  LayoutDashboard,
  ClipboardList,
  Clock,
  CheckCircle,
  Users,
  UserRound,
  Menu,
  ArrowUpRight,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Stats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  totalStudents: number;
  totalStaff: number;
}

interface Complaint {
  _id: string;
  title: string;
  category: string;
  studentName: string;
  studentId: string;
  status: string;
  priority: string;
  createdAt: string;
}

const initialStats: Stats = {
  total: 0,
  pending: 0,
  inProgress: 0,
  resolved: 0,
  totalStudents: 0,
  totalStaff: 0,
};

export default function AdminDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/complaints/admin/dashboard`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load dashboard.");
        }

        setStats(data.stats);
        setComplaints(data.recentComplaints || []);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const statCards = [
    {
      title: "Total Complaints",
      value: stats.total,
      icon: ClipboardList,
      color: "text-indigo-600",
      bg: "bg-indigo-100 dark:bg-indigo-500/10",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-100 dark:bg-amber-500/10",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: LayoutDashboard,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-500/10",
    },
    {
      title: "Resolved",
      value: stats.resolved,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-500/10",
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-500/10",
    },
    {
      title: "Total Staff",
      value: stats.totalStaff,
      icon: UserRound,
      color: "text-pink-600",
      bg: "bg-pink-100 dark:bg-pink-500/10",
    },
  ];

  const getStatusStyle = (status: string) => {
    if (status === "Resolved") {
      return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
    }

    if (status === "In Progress") {
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
    }

    return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
  };

  return (
    <ProtectedRoute allowedRole="admin">
      <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors dark:bg-[#071226] dark:text-white">
        <AdminSidebar
          mobileOpen={mobileOpen}
          closeMobile={() => setMobileOpen(false)}
        />

        <main className="min-h-screen lg:ml-72">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur-md dark:border-slate-800 dark:bg-[#0b1930]/90 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={23} />
              </button>

              <div>
                <h1 className="text-xl font-bold sm:text-2xl">
                  Admin Dashboard
                </h1>
                <p className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
                  Manage your campus activities
                </p>
              </div>
            </div>

            <ThemeToggle />
          </header>

          <div className="p-5 sm:p-8">
            <section className="mb-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-lg sm:p-8">
              <p className="mb-2 text-sm font-medium text-indigo-100">
                Administration Panel
              </p>

              <h2 className="text-2xl font-bold sm:text-3xl">
                Welcome, Admin!
              </h2>

              <p className="mt-2 max-w-xl text-sm text-indigo-100 sm:text-base">
                Monitor campus complaints, track their progress, and manage
                your campus community from one place.
              </p>
            </section>

            {loading ? (
              <div className="flex min-h-72 items-center justify-center">
                <div className="text-center">
                  <LoaderCircle
                    size={38}
                    className="mx-auto animate-spin text-indigo-600"
                  />
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    Loading dashboard...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                <AlertCircle size={22} />
                <p>{error}</p>
              </div>
            ) : (
              <>
                <section className="mb-8">
                  <div className="mb-5">
                    <h2 className="text-lg font-bold">
                      Overview
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Current campus statistics
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {statCards.map((card) => {
                      const Icon = card.icon;

                      return (
                        <div
                          key={card.title}
                          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-[#0b1930]"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                {card.title}
                              </p>

                              <h3 className="mt-3 text-3xl font-bold">
                                {card.value}
                              </h3>
                            </div>

                            <div className={`rounded-xl p-3 ${card.bg}`}>
                              <Icon
                                size={25}
                                className={card.color}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0b1930]">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5 dark:border-slate-800">
                    <div>
                      <h2 className="text-lg font-bold">
                        Recent Complaints
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Latest complaints submitted by students
                      </p>
                    </div>

                    <Link
                      href="/admin/complaints"
                      className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                    >
                      View All
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>

                  {complaints.length === 0 ? (
                    <div className="p-10 text-center">
                      <ClipboardList
                        size={38}
                        className="mx-auto text-slate-400"
                      />
                      <p className="mt-3 font-medium">
                        No complaints found
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        New complaints will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[750px] text-left">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                          <tr>
                            <th className="px-5 py-4">Complaint</th>
                            <th className="px-5 py-4">Student</th>
                            <th className="px-5 py-4">Category</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4">Date</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                          {complaints.map((complaint) => (
                            <tr
                              key={complaint._id}
                              className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                            >
                              <td className="px-5 py-4">
                                <Link
                                  href={`/admin/complaints/${complaint._id}`}
                                  className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                                >
                                  {complaint.title}
                                </Link>
                              </td>

                              <td className="px-5 py-4 text-sm">
                                {complaint.studentName}
                              </td>

                              <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                                {complaint.category}
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                    complaint.status
                                  )}`}
                                >
                                  {complaint.status}
                                </span>
                              </td>

                              <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                                {new Date(
                                  complaint.createdAt
                                ).toLocaleDateString("en-GB")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}