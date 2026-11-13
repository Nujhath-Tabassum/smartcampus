
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "react-toastify";
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !category || !building || !description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (
      image &&
      !["image/png", "image/jpeg"].includes(image.type)
    ) {
      toast.error("Only JPG and PNG images are allowed.");
      return;
    }

    if (image && image.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
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

      if (!response.ok || !data.success) {
        toast.error(data.message || "Failed to submit complaint.");
        return;
      }

      toast.success("Complaint submitted successfully!");

      setTimeout(() => {
        router.push("/student/my-complaints");
      }, 1000);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-[#071226] dark:text-white dark:placeholder:text-slate-500";

  return (
    <ProtectedRoute allowedRole="student">
      <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 transition-colors duration-300 dark:bg-[#080f1e] dark:text-white md:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/student/dashboard"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <div className="mb-8">
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              STUDENT DASHBOARD
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Report a Problem
            </h1>

            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Tell us about the issue you are experiencing on campus.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101e35] md:p-8"
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
                className={inputStyle}
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
                className={inputStyle}
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
                  className={inputStyle}
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
                  className={inputStyle}
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
                className={inputStyle}
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
                className={`${inputStyle} resize-none`}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Attach Image (Optional)
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 transition hover:border-indigo-500 hover:bg-indigo-50 dark:border-slate-700 dark:bg-[#071226] dark:hover:bg-[#14233d]">
                <ImagePlus className="mb-3 h-8 w-8 text-indigo-500 dark:text-indigo-400" />

                <span className="text-sm text-slate-700 dark:text-slate-300">
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
                  className="mt-3 flex items-center gap-2 text-sm text-red-500 transition hover:text-red-600 dark:text-red-400"
                >
                  <X size={16} />
                  Remove image
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
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
