
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
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
      toast.error("Only JPG and PNG images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
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
        toast.error(data.message || "Failed to update complaint.");
        return;
      }

      toast.success("Complaint updated successfully!");

      setTimeout(() => {
        router.push(`/student/complaint-details/${id}`);
      }, 1000);
    } catch (error) {
      console.error("Update complaint error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 dark:border-slate-700 dark:bg-[#071226] dark:text-white dark:placeholder:text-slate-500";

  return (
    <ProtectedRoute allowedRole="student">
      <main className="min-h-screen bg-slate-50 p-8 text-slate-900 transition-colors dark:bg-[#071226] dark:text-white">
        <Link
          href={`/student/complaint-details/${id}`}
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Complaint Details
        </Link>

        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Edit Complaint</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Update your complaint information.
            </p>
          </div>

          {loading ? (
            <p className="py-10 text-center text-slate-500 dark:text-slate-400">
              Loading complaint information...
            </p>
          ) : error && !formData.title ? (
            <div className="rounded-2xl border border-red-200 bg-white p-6 text-center dark:border-red-500/20 dark:bg-[#0b1930]">
              <p className="text-red-600 dark:text-red-400">{error}</p>

              <Link
                href="/student/my-complaints"
                className="mt-5 inline-block rounded-xl bg-indigo-600 px-5 py-3 text-sm text-white transition hover:bg-indigo-700"
              >
                Back to My Complaints
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0b1930]"
            >
              <div>
                <label className="mb-2 block text-sm text-slate-700 dark:text-slate-300">
                  Complaint Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className={inputStyle}
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-700 dark:text-slate-300">
                    Category *
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className={inputStyle}
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
                  <label className="mb-2 block text-sm text-slate-700 dark:text-slate-300">
                    Priority *
                  </label>

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    required
                    className={inputStyle}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-700 dark:text-slate-300">
                    Building *
                  </label>

                  <input
                    type="text"
                    name="building"
                    value={formData.building}
                    onChange={handleChange}
                    required
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-700 dark:text-slate-300">
                    Room
                  </label>

                  <input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    className={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-700 dark:text-slate-300">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={`${inputStyle} resize-none`}
                />
              </div>

              <div>
                <label className="mb-3 block text-sm text-slate-700 dark:text-slate-300">
                  Complaint Image
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 transition hover:border-indigo-500 dark:border-slate-600 dark:bg-[#071226]">
                  <UploadCloud className="mb-2 text-indigo-500 dark:text-indigo-400" size={30} />

                  <span className="text-sm text-slate-700 dark:text-slate-300">
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
                    <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                      Current image / New image preview
                    </p>

                    <img
                      src={imagePreview}
                      alt="Complaint preview"
                      className="max-h-64 rounded-xl border border-slate-200 object-contain dark:border-slate-700"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={18} />
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>

                <Link
                  href={`/student/complaint-details/${id}`}
                  className="rounded-xl border border-slate-300 px-6 py-3 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
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
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500 transition-colors dark:bg-[#071226] dark:text-slate-400">
          Loading edit page...
        </div>
      }
    >
      <EditComplaintContent />
    </Suspense>
  );
}
