
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  ArrowLeft,
  ClipboardList,
  Pencil,
  Trash2,
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
  assignedStaff: string | null;
  createdAt: string;
  hasImage: boolean;
  imageUrl: string | null;
}

function ComplaintDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/complaints/${id}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          setError(data.message || "Complaint not found.");
          return;
        }

        setComplaint(data.complaint);
      } catch (error) {
        console.error("Complaint details error:", error);
        setError("Could not load complaint details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchComplaint();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const response = await fetch(
        `${API_URL}/api/complaints/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Complaint deleted successfully!");

        setShowDelete(false);

        setTimeout(() => {
          router.push("/student/my-complaints");
        }, 1000);
      } else {
        toast.error(data.message || "Failed to delete complaint.");
        setShowDelete(false);
      }
    } catch (error) {
      console.error("Delete complaint error:", error);
      toast.error("Something went wrong. Please try again.");
      setShowDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ProtectedRoute allowedRole="student">
      <main className="min-h-screen bg-slate-50 p-8 text-slate-900 transition-colors dark:bg-[#071226] dark:text-white">
        <Link
          href="/student/my-complaints"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to My Complaints
        </Link>

        {loading ? (
          <p className="py-10 text-center text-slate-500 dark:text-slate-400">
            Loading complaint details...
          </p>
        ) : error && !complaint ? (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center dark:border-red-500/20 dark:bg-[#0b1930]">
            <p className="text-red-600 dark:text-red-400">{error}</p>

            <button
              onClick={() => router.push("/student/my-complaints")}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm text-white transition hover:bg-indigo-700"
            >
              Back to My Complaints
            </button>
          </div>
        ) : complaint ? (
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <div className="mb-3 flex items-center gap-3">
                <ClipboardList className="text-indigo-600 dark:text-indigo-400" size={28} />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Complaint Details
                </span>
              </div>

              <h1 className="text-3xl font-bold">
                {complaint.title}
              </h1>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Submitted on{" "}
                {new Date(complaint.createdAt).toLocaleDateString()}
              </p>
            </div>

            {error && (
              <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
                {error}
              </p>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0b1930]">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">
                  Complaint Information
                </h2>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      complaint.status === "Resolved"
                        ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                        : complaint.status === "In Progress"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
                    }`}
                  >
                    {complaint.status}
                  </span>

                  {complaint.status === "Pending" && (
                    <>
                      <Link
                        href={`/student/edit-complaint/${complaint._id}`}
                        className="flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm text-blue-600 transition hover:bg-blue-50 dark:border-blue-500/30 dark:text-blue-400 dark:hover:bg-blue-500/10"
                      >
                        <Pencil size={16} />
                        Edit
                      </Link>

                      <button
                        onClick={() => setShowDelete(true)}
                        className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Category</p>
                  <p className="mt-2 font-medium">
                    {complaint.category}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Priority</p>
                  <p className="mt-2 font-medium">
                    {complaint.priority}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Building</p>
                  <p className="mt-2 font-medium">
                    {complaint.building}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Room</p>
                  <p className="mt-2 font-medium">
                    {complaint.room || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Assigned Staff
                  </p>
                  <p className="mt-2 font-medium">
                    {complaint.assignedStaff || "Not assigned yet"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Attached Image
                  </p>

                  {complaint.imageUrl ? (
                    <img
                      src={complaint.imageUrl}
                      alt="Complaint attachment"
                      className="mt-3 max-h-80 w-full rounded-xl border border-slate-200 object-contain dark:border-slate-700"
                    />
                  ) : (
                    <p className="mt-2 font-medium text-slate-500 dark:text-slate-400">
                      No image attached
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
                <h3 className="mb-3 font-semibold">Description</h3>

                <p className="whitespace-pre-wrap leading-7 text-slate-700 dark:text-slate-300">
                  {complaint.description}
                </p>
              </div>
            </div>

            {showDelete && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-[#0b1930]">
                  <h2 className="text-xl font-semibold">
                    Delete Complaint?
                  </h2>

                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                    Are you sure you want to delete this complaint?
                    This action cannot be undone.
                  </p>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => setShowDelete(false)}
                      disabled={deleting}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </main>
    </ProtectedRoute>
  );
}

export default function ComplaintDetails() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500 transition-colors dark:bg-[#071226] dark:text-slate-400">
          Loading complaint details...
        </div>
      }
    >
      <ComplaintDetailsContent />
    </Suspense>
  );
}