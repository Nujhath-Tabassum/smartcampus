"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  UserRound,
  Mail,
  GraduationCap,
  Phone,
  Building2,
  Hash,
  ArrowLeft,
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
}

export default function StudentProfilePage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
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

  const profileItems = [
    {
      label: "Full Name",
      value: student?.name,
      icon: UserRound,
    },
    {
      label: "Student ID",
      value: student?.studentId,
      icon: Hash,
    },
    {
      label: "Email Address",
      value: student?.email,
      icon: Mail,
    },
    {
      label: "Department",
      value: student?.department,
      icon: Building2,
    },
    {
      label: "Batch",
      value: student?.batch,
      icon: GraduationCap,
    },
    {
      label: "Phone Number",
      value: student?.phone,
      icon: Phone,
    },
  ];

  return (
    <ProtectedRoute allowedRole="student">
      <main className="min-h-screen bg-[#071226] px-5 py-10 text-white md:px-8">
        <div className="mx-auto max-w-4xl">

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
              My Profile
            </h1>

            <p className="mt-3 text-slate-400">
              View your registered student information.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-800 bg-[#101e35] p-10 text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />

              <p className="mt-4 text-slate-400">
                Loading profile...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-red-400">
              {error}
            </div>
          ) : student ? (
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#101e35]">

              <div className="flex flex-col items-center gap-4 border-b border-slate-800 bg-[#142440] p-8 sm:flex-row">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600">
                  <UserRound size={38} />
                </div>

                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold">
                    {student.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {student.email}
                  </p>

                  <span className="mt-3 inline-block rounded-full bg-indigo-500/10 px-4 py-1 text-xs font-medium capitalize text-indigo-400">
                    {student.role}
                  </span>
                </div>
              </div>

              <div className="grid gap-6 p-6 sm:grid-cols-2 md:p-8">
                {profileItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-xl border border-slate-800 bg-[#0b1930] p-5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
                          <Icon size={19} />
                        </div>

                        <p className="text-sm text-slate-400">
                          {item.label}
                        </p>
                      </div>

                      <p className="mt-4 font-semibold">
                        {item.value || "Not provided"}
                      </p>
                    </div>
                  );
                })}
              </div>

            </div>
          ) : null}
        </div>
      </main>
    </ProtectedRoute>
  );
}