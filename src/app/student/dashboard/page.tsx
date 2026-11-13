"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import ThemeToggle from "@/components/ThemeToggle";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  LoaderCircle,
  PlusCircle,
  UserRound,
  FileText,
  CalendarDays,
  RefreshCw,
  ArrowUpRight,
  Sparkles,
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
  const [currentDate, setCurrentDate] = useState("");

  const [stats, setStats] = useState<DashboardData>({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );

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

    fetchDashboard();
    fetchStudent();
  }, []);

  const statCards = [
    {
      title: "Total Complaints",
      value: stats.total,
      icon: ClipboardList,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "hover:border-indigo-500/50",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "hover:border-yellow-500/50",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: LoaderCircle,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "hover:border-blue-500/50",
    },
    {
      title: "Resolved",
      value: stats.resolved,
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "hover:border-green-500/50",
    },
  ];

  const resolutionRate =
    stats.total > 0
      ? Math.round((stats.resolved / stats.total) * 100)
      : 0;

  const quickActions = [
    {
      title: "Report a Problem",
      description: "Submit a new campus complaint.",
      icon: PlusCircle,
      href: "/student/report-problem",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      title: "My Complaints",
      description: "View and track your complaints.",
      icon: FileText,
      href: "/student/my-complaints",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "My Profile",
      description: "View your student information.",
      icon: UserRound,
      href: "/student/profile",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <ProtectedRoute allowedRole="student">
      <main className="min-h-screen bg-slate-50 p-5 text-slate-900 transition-colors duration-300 dark:bg-[#080f1e] dark:text-white md:p-8">
        <div className="mx-auto max-w-7xl">
          <section className="mb-8 overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-100 to-blue-50 p-6 dark:border-indigo-500/20 dark:from-[#142440] dark:to-[#101e35] md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <div className="mb-3 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <Sparkles size={18} />
                  <span className="text-sm font-medium">
                    STUDENT DASHBOARD
                  </span>
                </div>

                <h1 className="text-2xl font-bold md:text-3xl">
                  Welcome back, {student?.name || "Student"}!
                </h1>

                <p className="mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-400 md:text-base">
                  Stay updated on your campus complaints and help
                  make your campus a better place.
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <CalendarDays size={17} />
                  {currentDate}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ThemeToggle />

                <Link
                  href="/student/report-problem"
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:-translate-y-1 hover:bg-indigo-700"
                >
                  <PlusCircle size={19} />
                  Report a Problem
                </Link>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-5">
              <h2 className="text-xl font-semibold">
                Complaint Overview
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                A summary of your submitted complaints.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className={`group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-slate-800 dark:bg-[#0b1930] ${card.border}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {card.title}
                      </p>

                      <div className={`rounded-xl p-3 ${card.bg}`}>
                        <Icon className={card.color} size={23} />
                      </div>
                    </div>

                    <h2 className="mt-5 text-3xl font-bold transition group-hover:scale-105">
                      {loading ? "..." : card.value}
                    </h2>

                    <p className="mt-2 text-xs text-slate-500">
                      {card.title === "Resolved"
                        ? "Successfully completed"
                        : card.title === "Pending"
                          ? "Waiting for attention"
                          : card.title === "In Progress"
                            ? "Currently being handled"
                            : "Complaints submitted"}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0b1930]">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">
                  Resolution Progress
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Your complaints that have been resolved.
                </p>
              </div>

              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {loading ? "..." : `${resolutionRate}%`}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-green-400 transition-all duration-1000"
                style={{
                  width: `${loading ? 0 : resolutionRate}%`,
                }}
              />
            </div>

            <div className="mt-3 flex justify-between text-xs text-slate-500">
              <span>0% Resolved</span>
              <span>100% Resolved</span>
            </div>
          </section>

          <section className="mt-10">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">
                Quick Actions
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                What would you like to do today?
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-800 dark:bg-[#0b1930] dark:hover:border-indigo-500/50 dark:hover:bg-[#101e35]"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`rounded-xl p-3 ${action.bg}`}>
                        <Icon
                          size={24}
                          className={action.color}
                        />
                      </div>

                      <ArrowUpRight
                        size={20}
                        className="text-slate-500 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
                      />
                    </div>

                    <h3 className="mt-5 font-semibold">
                      {action.title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {action.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0b1930]">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">
                  Recent Complaints
                </h2>

                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Keep track of your latest submissions.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => fetchDashboard(true)}
                  disabled={refreshing}
                  className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 transition hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white"
                >
                  <RefreshCw
                    size={16}
                    className={refreshing ? "animate-spin" : ""}
                  />
                  Refresh
                </button>

                <Link
                  href="/student/my-complaints"
                  className="text-sm text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  View All
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-24 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800/60"
                  />
                ))}
              </div>
            ) : complaints.length === 0 ? (
              <div className="py-10 text-center">
                <ClipboardList
                  className="mx-auto mb-3 text-slate-500"
                  size={40}
                />

                <p className="font-medium text-slate-700 dark:text-slate-300">
                  No complaints yet
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Your submitted complaints will appear here.
                </p>

                <Link
                  href="/student/report-problem"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                  <PlusCircle size={17} />
                  Submit Your First Complaint
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <Link
                    key={complaint._id}
                    href={`/student/complaint-details/${complaint._id}`}
                    className="group flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 transition duration-300 hover:-translate-y-1 hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-800 dark:hover:border-indigo-500/50 dark:hover:bg-[#101e35]"
                  >
                    <div className="min-w-0">
                      <h3 className="font-medium transition group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {complaint.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
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

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          complaint.status === "Resolved"
                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                            : complaint.status === "In Progress"
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                              : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                        }`}
                      >
                        {complaint.status}
                      </span>

                      <ArrowUpRight
                        size={18}
                        className="text-slate-500 transition group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}