
"use client";

import Link from "next/link";
import {
  GraduationCap,
  ClipboardList,
  Clock,
  ShieldCheck,
  ArrowRight,
  Wrench,
  Users,
} from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    title: "Easy Complaint Reporting",
    description:
      "Report campus problems quickly with detailed information and images.",
  },
  {
    icon: Clock,
    title: "Real-Time Tracking",
    description:
      "Track your complaints and stay updated on their progress.",
  },
  {
    icon: Users,
    title: "Better Communication",
    description:
      "Connect students, staff, and administrators through one platform.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable Management",
    description:
      "Keep campus maintenance organized and transparent.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#071226] text-white">
      <nav className="border-b border-slate-800 bg-[#0b1930]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2">
              <GraduationCap size={25} />
            </div>

            <div>
              <h1 className="text-xl font-bold">Smart Campus</h1>
              <p className="text-xs text-slate-400">
                Campus Complaint & Maintenance System
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-indigo-500"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 md:grid-cols-2 md:py-32">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              A Smarter Way to Manage Campus
            </span>

            <h2 className="mt-7 text-4xl font-bold leading-tight md:text-6xl">
              Making Your Campus
              <span className="block text-indigo-400">
                Better Together.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-400">
              Report campus problems, track maintenance requests,
              and stay connected with your university community.
              Let's make campus life better, one solution at a time.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold transition hover:bg-indigo-500"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/signin"
                className="rounded-xl border border-slate-700 px-6 py-3.5 font-semibold text-slate-300 transition hover:border-indigo-500 hover:text-white"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-slate-700 bg-[#101e35] p-7 shadow-2xl shadow-indigo-950/30">
              <div className="flex items-center gap-4 border-b border-slate-700 pb-6">
                <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                  <Wrench size={28} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Campus Maintenance
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    One platform, better solutions.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  {
                    title: "Electrical Issue",
                    location: "Academic Building · Room 302",
                    status: "Pending",
                    color: "text-yellow-400 bg-yellow-400/10",
                  },
                  {
                    title: "Water Leakage",
                    location: "Library Building · Floor 2",
                    status: "In Progress",
                    color: "text-blue-400 bg-blue-400/10",
                  },
                  {
                    title: "Classroom Cleaning",
                    location: "Main Building · Room 105",
                    status: "Resolved",
                    color: "text-green-400 bg-green-400/10",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-slate-700 bg-[#0b1930] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="font-medium">{item.title}</h4>

                      <span
                        className={`rounded-full px-3 py-1 text-xs ${item.color}`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                      {item.location}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-xl bg-indigo-500/10 p-4">
                <ShieldCheck className="text-indigo-400" size={23} />
                <p className="text-sm text-slate-300">
                  Working together for a better campus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800 bg-[#0b1930] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
              Our Features
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Everything Your Campus Needs
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              A simple and organized way to report problems
              and improve the campus environment.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-800 bg-[#101e35] p-6 transition hover:-translate-y-1 hover:border-indigo-500/50"
                >
                  <div className="mb-5 inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                    <Icon size={25} />
                  </div>

                  <h3 className="text-lg font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-slate-400">
            © 2026 Smart Campus. All rights reserved.
          </p>

          <p className="text-sm text-slate-500">
            Making campus life better, together.
          </p>
        </div>
      </footer>
    </main>
  );
}