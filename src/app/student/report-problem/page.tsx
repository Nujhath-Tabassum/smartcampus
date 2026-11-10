"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  ArrowLeft,
  Upload,
  ImagePlus,
  X,
} from "lucide-react";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ReportProblemPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [building, setBuilding] = useState("");
  const [room, setRoom] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!title || !category || !building || !description) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("category", category);
      formData.append("building", building);
      formData.append("room", room);
      formData.append("description", description);
      formData.append("priority", priority);

      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(`${API_URL}/api/complaints`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit complaint.");
      }

      router.push("/student/my-complaints");
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

  return (
    <ProtectedRoute allowedRole="student">
      <main className="min-h-screen bg-[#071226] px-5 py-10 text-white md:px-8">
        <div className="mx-auto max-w-3xl">

          <Link
            href="/student/dashboard"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <div className="mb-8">
            <p className="text-sm font-medium text-indigo-400">
              STUDENT DASHBOARD
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Report a Problem
            </h1>

            <p className="mt-3 text-slate-400">
              Tell us about the issue you are experiencing on campus.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-slate-800 bg-[#101e35] p-6 md:p-8"
          >
            <div>
              <label className="mb-2 block text-sm font-medium">
                Complaint Title *
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a short title"
                className="w-full rounded-lg border border-slate-700 bg-[#071226] px-4 py-3 outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Category *
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#071226] px-4 py-3 outline-none focus:border-indigo-500"
                required
              >
                <option value="">Select a category</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Furniture">Furniture</option>
                <option value="Internet">Internet</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Building *
                </label>

                <input
                  type="text"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  placeholder="Building name"
                  className="w-full rounded-lg border border-slate-700 bg-[#071226] px-4 py-3 outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Room Number
                </label>

                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="e.g. 302"
                  className="w-full rounded-lg border border-slate-700 bg-[#071226] px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#071226] px-4 py-3 outline-none focus:border-indigo-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Problem Description *
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the problem in detail..."
                rows={5}
                className="w-full resize-none rounded-lg border border-slate-700 bg-[#071226] px-4 py-3 outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Attach Image (Optional)
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-[#071226] p-8 transition hover:border-indigo-500">
                <ImagePlus className="mb-3 h-8 w-8 text-indigo-400" />

                <span className="text-sm text-slate-300">
                  {image ? image.name : "Click to upload an image"}
                </span>

                <span className="mt-2 text-xs text-slate-500">
                  PNG, JPG or JPEG
                </span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  className="hidden"
                  onChange={(e) =>
                    setImage(e.target.files?.[0] || null)
                  }
                />
              </label>

              {image && (
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="mt-3 flex items-center gap-2 text-sm text-red-400"
                >
                  <X size={16} />
                  Remove image
                </button>
              )}
            </div>

            {error && (
              <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload size={18} />
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        </div>
      </main>
    </ProtectedRoute>
  );
}