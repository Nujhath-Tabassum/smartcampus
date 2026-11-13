"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminSidebar from "@/components/AdminSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import {
  ClipboardList,
  Search,
  Menu,
  Eye,
  LoaderCircle,
  AlertCircle,
  Filter,
  RefreshCw,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Complaint {
  _id: string;
  title: string;
  category: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  building: string;
  room: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
}

export default function AdminComplaintsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        if (search.trim()) {
          params.append("search", search.trim());
        }

        if (status !== "All") {
          params.append("status", status);
        }

        if (priority !== "All") {
          params.append("priority", priority);
        }

        const response = await fetch(
          `${API_URL}/api/complaints/admin/all?${params.toString()}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load complaints.");
        }

        setComplaints(data.complaints || []);
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

    fetchComplaints();
  }, [search, status, priority]);

  const getStatusStyle = (value: string) => {
    switch (value) {
      case "Resolved":
        return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";

      case "In Progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";

      default:
        return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
    }
  };

  const getPriorityStyle = (value: string) => {
    switch (value?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";

      case "medium":
        return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";

      case "low":
        return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";

      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
    }
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
                  Complaints Management
                </h1>
                <p className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
                  View and manage all campus complaints
                </p>
              </div>
            </div>

            <ThemeToggle />
          </header>

          <div className="p-5 sm:p-8">
            <section className="mb-7">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">
                  All Complaints
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Monitor complaints submitted by students.
                </p>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0b1930] lg:grid-cols-3">
                <div className="relative lg:col-span-1">
                  <Search
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="Search complaints..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="relative">
                  <Filter
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Showing{" "}
                  <span className="font-bold text-slate-800 dark:text-white">
                    {complaints.length}
                  </span>{" "}
                  complaints
                </p>

                <button
                  onClick={() => {
                    setSearch("");
                    setStatus("All");
                    setPriority("All");
                  }}
                  className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <RefreshCw size={15} />
                  Reset Filters
                </button>
              </div>

              {loading ? (
                <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1930]">
                  <div className="text-center">
                    <LoaderCircle
                      size={36}
                      className="mx-auto animate-spin text-indigo-600"
                    />
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                      Loading complaints...
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                  <AlertCircle size={22} />
                  <p>{error}</p>
                </div>
              ) : complaints.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-[#0b1930]">
                  <ClipboardList
                    size={42}
                    className="mx-auto text-slate-400"
                  />
                  <h3 className="mt-4 text-lg font-bold">
                    No complaints found
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Try changing your search or filters.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0b1930]">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[950px] text-left">
                      <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                        <tr>
                          <th className="px-5 py-4">Complaint</th>
                          <th className="px-5 py-4">Student</th>
                          <th className="px-5 py-4">Category</th>
                          <th className="px-5 py-4">Priority</th>
                          <th className="px-5 py-4">Status</th>
                          <th className="px-5 py-4">Date</th>
                          <th className="px-5 py-4">Action</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {complaints.map((complaint) => (
                          <tr
                            key={complaint._id}
                            className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                          >
                            <td className="px-5 py-4">
                              <p className="max-w-48 truncate font-semibold">
                                {complaint.title}
                              </p>
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {complaint.building} · Room {complaint.room}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-sm font-medium">
                                {complaint.studentName}
                              </p>
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {complaint.studentId}
                              </p>
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                              {complaint.category}
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                                  complaint.priority
                                )}`}
                              >
                                {complaint.priority || "Normal"}
                              </span>
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

                            <td className="px-5 py-4">
                              <Link
                                href={`/admin/complaints/${complaint._id}`}
                                className="inline-flex items-center gap-2 rounded-lg bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20"
                              >
                                <Eye size={16} />
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}