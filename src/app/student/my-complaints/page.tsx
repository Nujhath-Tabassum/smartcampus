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
        return "bg-green-500/10 text-green-400";

      case "In Progress":
        return "bg-blue-500/10 text-blue-400";

      default:
        return "bg-yellow-500/10 text-yellow-400";
    }
  };

  return (
    <ProtectedRoute allowedRole="student">
      <main className="min-h-screen bg-[#071226] px-5 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/student/dashboard"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-indigo-400">
                STUDENT DASHBOARD
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                My Complaints
              </h1>

              <p className="mt-3 text-slate-400">
                View and track all your submitted complaints.
              </p>
            </div>

            <Link
              href="/student/report-problem"
              className="rounded-lg bg-indigo-600 px-5 py-3 text-center text-sm font-semibold transition hover:bg-indigo-500"
            >
              + Report a Problem
            </Link>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-800 bg-[#101e35] p-10 text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />

              <p className="mt-4 text-slate-400">
                Loading complaints...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-center text-red-400">
              {error}
            </div>
          ) : complaints.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-[#101e35] px-6 py-16 text-center">
              <ClipboardList
                size={45}
                className="mx-auto text-slate-500"
              />

              <h2 className="mt-5 text-xl font-semibold">
                No Complaints Yet
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                You haven&apos;t submitted any complaints.
              </p>

              <Link
                href="/student/report-problem"
                className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold hover:bg-indigo-500"
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
                  className="block rounded-2xl border border-slate-800 bg-[#101e35] p-6 transition hover:border-indigo-500/50 hover:bg-[#14233d]"
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

                      <p className="mt-2 text-sm text-indigo-400">
                        {complaint.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-fit rounded-lg bg-slate-800 px-3 py-1 text-xs text-slate-300">
                        {complaint.priority} Priority
                      </span>

                      <ArrowUpRight
                        size={18}
                        className="text-slate-400"
                      />
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    {complaint.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-5 border-t border-slate-800 pt-5 text-xs text-slate-400">
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

                  <p className="mt-4 text-xs font-medium text-indigo-400">
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