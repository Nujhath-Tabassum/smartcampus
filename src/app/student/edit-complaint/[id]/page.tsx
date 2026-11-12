
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ArrowLeft, Save, UploadCloud } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Complaint {
  title: string;
  category: string;
  building: string;
  room: string;
  description: string;
  priority: string;
  status: string;
  imageUrl: string | null;
}

function EditComplaintContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    building: "",
    room: "",
    description: "",
    priority: "Medium",
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

        const complaint: Complaint = data.complaint;

        if (complaint.status !== "Pending") {
          setError("Only pending complaints can be edited.");
          return;
        }

        setFormData({
          title: complaint.title,
          category: complaint.category,
          building: complaint.building,
          room: complaint.room || "",
          description: complaint.description,
          priority: complaint.priority,
        });

        setImagePreview(complaint.imageUrl);
      } catch (error) {
        console.error("Fetch complaint error:", error);
        setError("Failed to load complaint.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchComplaint();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setError("Only JPG and PNG images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError("");
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });

      if (image) {
        form.append("image", image);
      }

      const response = await fetch(
        `${API_URL}/api/complaints/${id}`,
        {
          method: "PATCH",
          credentials: "include",
          body: form,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to update complaint.");
        return;
      }

      setSuccess("Complaint updated successfully!");

      setTimeout(() => {
        router.push(`/student/complaint-details/${id}`);
      }, 1000);
    } catch (error) {
      console.error("Update complaint error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRole="student">
      <main className="min-h-screen p-8 text-white">
        <Link
          href={`/student/complaint-details/${id}`}
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Complaint Details
        </Link>

        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Edit Complaint</h1>
            <p className="mt-2 text-slate-400">
              Update your complaint information.
            </p>
          </div>

          {loading ? (
            <p className="py-10 text-center text-slate-400">
              Loading complaint information...
            </p>
          ) : error && !formData.title ? (
            <div className="rounded-2xl border border-red-500/20 bg-[#0b1930] p-6 text-center">
              <p className="text-red-400">{error}</p>

              <Link
                href="/student/my-complaints"
                className="mt-5 inline-block rounded-xl bg-indigo-600 px-5 py-3 text-sm hover:bg-indigo-700"
              >
                Back to My Complaints
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-2xl border border-slate-800 bg-[#0b1930] p-6"
            >
              {error && (
                <p className="rounded-xl bg-red-500/10 p-4 text-sm text-red-400">
                  {error}
                </p>
              )}

              {success && (
                <p className="rounded-xl bg-green-500/10 p-4 text-sm text-green-400">
                  {success}
                </p>
              )}

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Complaint Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-[#071226] px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Category *
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-[#071226] px-4 py-3 outline-none focus:border-indigo-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Internet">Internet</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Priority *
                  </label>

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-[#071226] px-4 py-3 outline-none focus:border-indigo-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Building *
                  </label>

                  <input
                    type="text"
                    name="building"
                    value={formData.building}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-[#071226] px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Room
                  </label>

                  <input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-[#071226] px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full resize-none rounded-xl border border-slate-700 bg-[#071226] px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm text-slate-300">
                  Complaint Image
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-600 bg-[#071226] p-6 transition hover:border-indigo-500">
                  <UploadCloud className="mb-2 text-indigo-400" size={30} />

                  <span className="text-sm text-slate-300">
                    Click to upload a new image
                  </span>

                  <span className="mt-1 text-xs text-slate-500">
                    JPG or PNG, maximum 5MB
                  </span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {imagePreview && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm text-slate-400">
                      Current image / New image preview
                    </p>

                    <img
                      src={imagePreview}
                      alt="Complaint preview"
                      className="max-h-64 rounded-xl border border-slate-700 object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={18} />
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>

                <Link
                  href={`/student/complaint-details/${id}`}
                  className="rounded-xl border border-slate-700 px-6 py-3 text-sm transition hover:bg-slate-800"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}

export default function EditComplaintPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#071226] text-slate-400">
          Loading edit page...
        </div>
      }
    >
      <EditComplaintContent />
    </Suspense>
  );
}
