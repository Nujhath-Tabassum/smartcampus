
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  ArrowLeft,
  ClipboardList,
  Clock,
  MapPin,
  Image as ImageIcon,
  ArrowUpRight,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Complaint {
  _id: string;
  title: string;
  category: string;
  building: string;
  room: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  hasImage: boolean;
}

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/complaints/my`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load complaints."
          );
        }

        setComplaints(data.complaints);
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
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";

      case "In Progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";

      default:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";
    }
  };

  return (
    <ProtectedRoute allowedRole="student">
      <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 transition-colors duration-300 dark:bg-[#080f1e] dark:text-white">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/student/dashboard"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                STUDENT DASHBOARD
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                My Complaints
              </h1>

              <p className="mt-3 text-slate-600 dark:text-slate-400">
                View and track all your submitted complaints.
              </p>
            </div>

            <Link
              href="/student/report-problem"
              className="rounded-lg bg-indigo-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              + Report a Problem
            </Link>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-[#101e35]">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />

              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Loading complaints...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          ) : complaints.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-800 dark:bg-[#101e35]">
              <ClipboardList
                size={45}
                className="mx-auto text-slate-500"
              />

              <h2 className="mt-5 text-xl font-semibold">
                No Complaints Yet
              </h2>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                You haven&apos;t submitted any complaints.
              </p>

              <Link
                href="/student/report-problem"
                className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Report Your First Problem
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {complaints.map((complaint) => (
                <Link
                  key={complaint._id}
                  href={`/student/complaint-details/${complaint._id}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-800 dark:bg-[#101e35] dark:hover:border-indigo-500/50 dark:hover:bg-[#14233d]"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-semibold">
                          {complaint.title}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                            complaint.status
                          )}`}
                        >
                          {complaint.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-indigo-600 dark:text-indigo-400">
                        {complaint.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-fit rounded-lg bg-slate-100 px-3 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {complaint.priority} Priority
                      </span>

                      <ArrowUpRight
                        size={18}
                        className="text-slate-500"
                      />
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {complaint.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-5 border-t border-slate-200 pt-5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <span className="flex items-center gap-2">
                      <MapPin size={15} />
                      {complaint.building}
                      {complaint.room &&
                        `, Room ${complaint.room}`}
                    </span>

                    <span className="flex items-center gap-2">
                      <Clock size={15} />
                      {new Date(
                        complaint.createdAt
                      ).toLocaleDateString()}
                    </span>

                    {complaint.hasImage && (
                      <span className="flex items-center gap-2">
                        <ImageIcon size={15} />
                        Image attached
                      </span>
                    )}
                  </div>

                  <p className="mt-4 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    Click to view complaint details →
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
