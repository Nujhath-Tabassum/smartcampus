"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  LoaderCircle,
  PlusCircle,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Complaint {
  _id: string;
  title: string;
  category: string;
  building: string;
  room: string;
  priority: string;
  status: string;
  createdAt: string;
}

interface DashboardData {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

interface Student {
  name: string;
  email: string;
  studentId: string;
}

export default function StudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null);

  const [stats, setStats] = useState<DashboardData>({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/complaints/dashboard`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setStats(data.stats);
          setComplaints(data.recentComplaints);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setStudent(data.user);
        }
      } catch (error) {
        console.error("Student fetch error:", error);
      }
    };

    fetchStudent();
  }, []);

  const statCards = [
    {
      title: "Total Complaints",
      value: stats.total,
      icon: ClipboardList,
      color: "text-indigo-400",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-400",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: LoaderCircle,
      color: "text-blue-400",
    },
    {
      title: "Resolved",
      value: stats.resolved,
      icon: CheckCircle,
      color: "text-green-400",
    },
  ];

  return (
    <ProtectedRoute allowedRole="student">
      <main className="p-8 text-white">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {student?.name || "Student"}!
            </h1>

            <p className="mt-2 text-slate-400">
              Track your complaints and campus maintenance requests.
            </p>
          </div>

          <Link
            href="/student/report-problem"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium transition hover:bg-indigo-700"
          >
            <PlusCircle size={19} />
            Report a Problem
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-800 bg-[#0b1930] p-6"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">
                    {card.title}
                  </p>

                  <Icon className={card.color} size={24} />
                </div>

                <h2 className="mt-4 text-3xl font-bold">
                  {loading ? "..." : card.value}
                </h2>
              </div>
            );
          })}
        </div>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-[#0b1930] p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Recent Complaints
            </h2>

            <Link
              href="/student/my-complaints"
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <p className="py-8 text-center text-slate-400">
              Loading complaints...
            </p>
          ) : complaints.length === 0 ? (
            <div className="py-10 text-center">
              <ClipboardList
                className="mx-auto mb-3 text-slate-500"
                size={40}
              />

              <p className="text-slate-400">
                You haven&and;t submitted any complaints yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 p-4"
                >
                  <div>
                    <h3 className="font-medium">
                      {complaint.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      {complaint.category} · {complaint.building}
                      {complaint.room
                        ? ` · Room ${complaint.room}`
                        : ""}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      {new Date(
                        complaint.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      complaint.status === "Resolved"
                        ? "bg-green-500/10 text-green-400"
                        : complaint.status === "In Progress"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {complaint.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}