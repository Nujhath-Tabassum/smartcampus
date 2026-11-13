"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminSidebar from "@/components/AdminSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import {
  ArrowLeft,
  UserRound,
  Mail,
  GraduationCap,
  BookOpen,
  Phone,
  CalendarDays,
  LoaderCircle,
} from "lucide-react";
import { toast } from "react-toastify";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Student {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  batch: string;
  phone: string;
  createdAt?: string;
}

function StudentDetailsContent() {
  const params = useParams();
  const id = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/auth/admin/students/${id}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load student.");
        }

        setStudent(data.student);
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

    if (id) {
      fetchStudent();
    }
  }, [id]);

  const details = [
    {
      label: "Full Name",
      value: student?.name,
      icon: UserRound,
    },
    {
      label: "Email Address",
      value: student?.email,
      icon: Mail,
    },
    {
      label: "Student ID",
      value: student?.studentId,
      icon: GraduationCap,
    },
    {
      label: "Department",
      value: student?.department,
      icon: BookOpen,
    },
    {
      label: "Batch",
      value: student?.batch,
      icon: CalendarDays,
    },
    {
      label: "Phone Number",
      value: student?.phone,
      icon: Phone,
    },
  ];

  return (
    <ProtectedRoute allowedRole="admin">
      <div className="min-h-screen bg-slate-50 transition-colors dark:bg-[#071226]">
        <AdminSidebar
          mobileOpen={mobileOpen}
          closeMobile={() => setMobileOpen(false)}
        />

        <main className="min-h-screen lg:ml-72">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-[#0b1930] sm:px-8">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 dark:border-slate-700 dark:text-slate-300 lg:hidden"
            >
              <span className="text-xl">☰</span>
            </button>

            <h1 className="text-lg font-bold text-slate-800 dark:text-white">
              Student Details
            </h1>

            <ThemeToggle />
          </header>

          <div className="p-5 sm:p-8">
            <Link
              href="/admin/students"
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <ArrowLeft size={18} />
              Back to Students
            </Link>

            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <LoaderCircle
                  className="animate-spin text-indigo-500"
                  size={36}
                />
              </div>
            ) : !student ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-[#0b1930]">
                <UserRound
                  className="mx-auto mb-4 text-slate-400"
                  size={45}
                />

                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  Student Not Found
                </h2>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  The requested student information could not be found.
                </p>
              </div>
            ) : (
              <div className="mx-auto max-w-4xl">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0b1930] sm:p-8">
                  <div className="mb-8 flex flex-col items-center border-b border-slate-100 pb-8 text-center dark:border-slate-800">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                      <UserRound size={38} />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                      {student.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {student.email}
                    </p>

                    <span className="mt-4 rounded-full bg-green-100 px-4 py-1.5 text-xs font-bold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                      Student Account
                    </span>
                  </div>

                  <h3 className="mb-5 text-lg font-bold text-slate-800 dark:text-white">
                    Personal Information
                  </h3>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {details.map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.label}
                          className="rounded-xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-[#101f38]"
                        >
                          <div className="mb-3 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                            <Icon size={18} />

                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                              {item.label}
                            </span>
                          </div>

                          <p className="break-words font-semibold text-slate-800 dark:text-white">
                            {item.value || "Not provided"}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-[#101f38]">
                    <div className="mb-3 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      <CalendarDays size={18} />

                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Account Created
                      </span>
                    </div>

                    <p className="font-semibold text-slate-800 dark:text-white">
                      {student.createdAt
                        ? new Date(student.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function StudentDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#071226]">
          <LoaderCircle
            className="animate-spin text-indigo-500"
            size={36}
          />
        </div>
      }
    >
      <StudentDetailsContent />
    </Suspense>
  );
}