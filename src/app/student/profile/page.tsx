
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "react-toastify";
import {
  UserRound,
  Mail,
  GraduationCap,
  Phone,
  Building2,
  Hash,
  ArrowLeft,
  Pencil,
  Save,
  X,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Student {
  name: string;
  studentId: string;
  email: string;
  department: string;
  batch: string;
  phone: string;
  role: string;
  picture?: string;
}

export default function StudentProfilePage() {
  const [student, setStudent] = useState<Student | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    batch: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile.");
        }

        setStudent(data.user);

        setFormData({
          name: data.user.name || "",
          department: data.user.department || "",
          batch: data.user.batch || "",
          phone: data.user.phone || "",
        });
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

    fetchProfile();
  }, []);

  const getInitials = (name: string) => {
    return name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    if (!student) return;

    setFormData({
      name: student.name,
      department: student.department,
      batch: student.batch,
      phone: student.phone,
    });

    setEditing(false);
    setError("");
  };

  const handleSave = async () => {
    setError("");

    if (
      !formData.name.trim() ||
      !formData.department.trim() ||
      !formData.batch.trim() ||
      !formData.phone.trim()
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }

      setStudent(data.user);
      setEditing(false);

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  const profileItems = [
    {
      label: "Full Name",
      value: student?.name,
      field: "name",
      icon: UserRound,
      editable: true,
    },
    {
      label: "Student ID",
      value: student?.studentId,
      icon: Hash,
      editable: false,
    },
    {
      label: "Email Address",
      value: student?.email,
      icon: Mail,
      editable: false,
    },
    {
      label: "Department",
      value: student?.department,
      field: "department",
      icon: Building2,
      editable: true,
    },
    {
      label: "Batch",
      value: student?.batch,
      field: "batch",
      icon: GraduationCap,
      editable: true,
    },
    {
      label: "Phone Number",
      value: student?.phone,
      field: "phone",
      icon: Phone,
      editable: true,
    },
  ];

  return (
    <ProtectedRoute allowedRole="student">
      <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 dark:bg-[#071226] dark:text-white md:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/student/dashboard"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <div className="mb-8">
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              STUDENT DASHBOARD
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              My Profile
            </h1>

            <p className="mt-3 text-slate-600 dark:text-slate-400">
              View and manage your student information.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-[#101e35]">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />

              <p className="mt-4 text-slate-500 dark:text-slate-400">
                Loading profile...
              </p>
            </div>
          ) : error && !student ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          ) : student ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#101e35]">
              <div className="flex flex-col items-center gap-4 border-b border-slate-200 bg-indigo-50 p-8 dark:border-slate-800 dark:bg-[#142440] sm:flex-row">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-indigo-400 bg-indigo-600 text-2xl font-bold text-white">
                  {student.picture ? (
                    <img
                      src={student.picture}
                      alt={student.name}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    getInitials(student.name) || (
                      <UserRound size={38} />
                    )
                  )}
                </div>

                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold">
                    {student.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {student.email}
                  </p>

                  <span className="mt-3 inline-block rounded-full bg-indigo-100 px-4 py-1 text-xs font-medium capitalize text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                    {student.role}
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-6 dark:border-slate-800 sm:flex-row sm:items-center md:px-8">
                <div>
                  <h3 className="font-semibold">
                    Personal Information
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Manage your registered information.
                  </p>
                </div>

                {!editing && (
                  <button
                    onClick={() => {
                      setEditing(true);
                      setError("");
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
                  >
                    <Pencil size={17} />
                    Edit Profile
                  </button>
                )}
              </div>

              {error && student && (
                <div className="mx-6 mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 md:mx-8">
                  {error}
                </div>
              )}

              <div className="grid gap-6 p-6 sm:grid-cols-2 md:p-8">
                {profileItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-[#0b1930]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                          <Icon size={19} />
                        </div>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {item.label}
                        </p>
                      </div>

                      {editing && item.editable ? (
                        <input
                          type="text"
                          name={item.field}
                          value={
                            formData[
                              item.field as keyof typeof formData
                            ]
                          }
                          onChange={handleChange}
                          className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 dark:border-slate-700 dark:bg-[#142440] dark:text-white dark:placeholder:text-slate-500"
                        />
                      ) : (
                        <p className="mt-4 font-semibold text-slate-800 dark:text-white">
                          {item.value || "Not provided"}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {editing && (
                <div className="flex flex-col justify-end gap-3 border-t border-slate-200 p-6 dark:border-slate-800 sm:flex-row md:px-8">
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <X size={17} />
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                  >
                    <Save size={17} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </main>
    </ProtectedRoute>
  );
}
