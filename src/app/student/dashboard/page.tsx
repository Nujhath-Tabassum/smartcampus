"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import {
  FileText,
  Clock,
  LoaderCircle,
  CheckCircle,
  Plus,
  ArrowRight,
  ClipboardList,
  Wrench,
} from "lucide-react";

const stats = [
  {
    title: "Total Complaints",
    value: "0",
    icon: FileText,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    title: "Pending",
    value: "0",
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    title: "In Progress",
    value: "0",
    icon: LoaderCircle,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    title: "Resolved",
    value: "0",
    icon: CheckCircle,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
];

export default function StudentDashboard() {
  return (
    <ProtectedRoute allowedRole="student">
      <main className="min-h-screen bg-[#071226] p-5 text-white md:p-8">
        <div className="mx-auto max-w-7xl">

          {/* Welcome Section */}
          <section className="mb-8">
            <p className="text-sm font-medium text-indigo-400">
              STUDENT DASHBOARD
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Welcome to Smart Campus!
            </h1>

            <p className="mt-3 text-slate-400">
              Manage your complaints and stay updated on campus
              maintenance activities.
            </p>
          </section>

          {/* Statistics */}
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-slate-800 bg-[#101e35] p-6"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">
                      {stat.title}
                    </p>

                    <div className={`rounded-xl p-3 ${stat.bg}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>

                  <h2 className="mt-5 text-3xl font-bold">
                    {stat.value}
                  </h2>
                </div>
              );
            })}
          </section>

          {/* Quick Actions */}
          <section className="mt-10">
            <h2 className="text-xl font-semibold">
              Quick Actions
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Link
                href="/student/report-problem"
                className="group flex items-center justify-between rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-6 transition hover:border-indigo-400/50 hover:bg-indigo-500/15"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-indigo-500 p-3">
                    <Plus className="h-6 w-6 text-white" />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Report a Problem
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Submit a new campus complaint.
                    </p>
                  </div>
                </div>

                <ArrowRight className="h-5 w-5 text-indigo-400 transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="/student/my-complaints"
                className="group flex items-center justify-between rounded-2xl border border-slate-800 bg-[#101e35] p-6 transition hover:border-slate-600"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-blue-500/10 p-3">
                    <ClipboardList className="h-6 w-6 text-blue-400" />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      My Complaints
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Track your submitted complaints.
                    </p>
                  </div>
                </div>

                <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </section>

          {/* Recent Complaints */}
          <section className="mt-10 rounded-2xl border border-slate-800 bg-[#101e35] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Recent Complaints
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Your latest submitted complaints.
                </p>
              </div>

              <Link
                href="/student/my-complaints"
                className="flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-slate-800 p-4">
                <Wrench className="h-8 w-8 text-slate-400" />
              </div>

              <h3 className="mt-4 font-medium">
                No complaints yet
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                You haven&apos;t submitted any complaints.
              </p>

              <Link
                href="/student/report-problem"
                className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium transition hover:bg-indigo-500"
              >
                Report a Problem
              </Link>
            </div>
          </section>

        </div>
      </main>
    </ProtectedRoute>
  );
}