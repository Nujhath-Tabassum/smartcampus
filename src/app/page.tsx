"use client";

import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import {
  GraduationCap,
  ClipboardList,
  Clock,
  ShieldCheck,
  ArrowRight,
  Users,
  FileText,
  CheckCircle,
  MessageCircle,
  Wrench,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    title: "Easy Complaint Reporting",
    description:
      "Report campus problems quickly with detailed information and images.",
    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400",
  },
  {
    icon: Clock,
    title: "Real-Time Tracking",
    description:
      "Stay updated on the progress of your complaints from submission to resolution.",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  },
  {
    icon: MessageCircle,
    title: "Better Communication",
    description:
      "Stay connected with campus staff and receive updates about reported issues.",
    color: "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
  },
  {
    icon: ShieldCheck,
    title: "Reliable Management",
    description:
      "Help campus authorities organize, manage, and resolve maintenance issues.",
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
];

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Report a Problem",
    description:
      "Submit a complaint with a description and relevant information.",
  },
  {
    number: "02",
    icon: Wrench,
    title: "Track Progress",
    description:
      "Follow your complaint as campus staff review and work on it.",
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Get It Resolved",
    description:
      "Check the final status once the reported issue has been resolved.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen scroll-smooth bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#071226] dark:text-white">
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-[#0b1930]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2.5 text-white transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
              <GraduationCap size={25} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Smart Campus
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Campus Complaint & Maintenance System
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/signin"
              className="hidden rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 sm:block"
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              className="group flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-indigo-600/40"
            >
              Get Started
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative isolate overflow-hidden">
        <Image
          src="/dream.png"
          alt="Smart Campus"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />

        <div className="absolute inset-0 -z-10 bg-white/80 transition-colors dark:bg-[#071226]/85" />

        <div className="absolute -left-24 top-20 -z-10 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="absolute -right-20 bottom-10 -z-10 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-2 md:py-32">
          <div className="animate-[fadeUp_0.8s_ease-out]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              A Smarter Way to Improve Your Campus
            </div>

            <h2 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white">
              Making Your Campus{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                Better Together.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 md:text-lg dark:text-slate-300">
              A smarter campus starts with a better way to communicate.
              Report problems, track complaints, and work together to
              create a better learning environment.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="group flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-4 font-semibold text-white shadow-xl shadow-indigo-600/25 transition duration-300 hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-indigo-600/40"
              >
                Get Started
                <ArrowRight
                  size={19}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-7 py-4 font-semibold text-slate-800 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-600 dark:bg-slate-900/70 dark:text-white dark:hover:border-indigo-400 dark:hover:text-indigo-400"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle size={17} className="text-green-500" />
                Easy Reporting
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={17} className="text-green-500" />
                Simple Tracking
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md animate-[fadeUp_1s_ease-out]">
            <div className="absolute -inset-5 rounded-3xl bg-indigo-500/20 blur-2xl" />

            <div className="relative rounded-3xl border border-white/60 bg-white/90 p-6 shadow-2xl backdrop-blur-xl transition duration-500 hover:-translate-y-2 dark:border-slate-700 dark:bg-[#0b1930]/90">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Campus Support
                  </p>
                  <h3 className="mt-1 text-xl font-bold">
                    How can we help?
                  </h3>
                </div>

                <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                  <ClipboardList size={25} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition duration-300 hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/10">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold">Submit a Complaint</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Report campus problems easily
                      </p>
                    </div>
                    <ChevronRight className="ml-auto text-slate-400 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition duration-300 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/10">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold">Track Your Complaint</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Follow progress and updates
                      </p>
                    </div>
                    <ChevronRight className="ml-auto text-slate-400 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition duration-300 hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-emerald-500/50 dark:hover:bg-emerald-500/10">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                      <Users size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold">Connect with Staff</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Work together for a better campus
                      </p>
                    </div>
                    <ChevronRight className="ml-auto text-slate-400 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-xl bg-indigo-600 p-4 text-white">
                <ShieldCheck size={24} />
                <div>
                  <p className="text-sm font-bold">Your Campus, Your Voice</p>
                  <p className="text-xs text-indigo-100">
                    Every report helps make a difference.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="bg-white px-6 py-24 transition-colors dark:bg-[#0b1930]"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-bold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
              Our Features
            </span>

            <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Everything Your Campus Needs
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              A simple and organized platform designed to make campus
              maintenance and communication easier.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-7 transition-all duration-300 hover:-translate-y-3 hover:border-indigo-300 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-700 dark:bg-[#101f38] dark:hover:border-indigo-500/50 dark:hover:bg-[#142541]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`mb-6 inline-flex rounded-2xl p-4 transition duration-300 group-hover:rotate-6 group-hover:scale-110 ${feature.color}`}
                  >
                    <Icon size={27} />
                  </div>

                  <h3 className="mb-3 text-lg font-bold transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-indigo-600 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 dark:text-indigo-400">
                    Learn More
                    <ArrowRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-100 px-6 py-24 transition-colors dark:bg-[#071226]">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-bold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
              Simple Process
            </span>

            <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
              How It Works
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Getting campus problems addressed is simple. Just follow
              three easy steps.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.number} className="group relative">
                  {index !== 2 && (
                    <div className="absolute left-[65%] top-12 hidden h-px w-full border-t-2 border-dashed border-indigo-300 md:block dark:border-indigo-500/40" />
                  )}

                  <div className="relative rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-700 dark:bg-[#0b1930]">
                    <div className="absolute right-5 top-5 text-3xl font-extrabold text-slate-100 dark:text-slate-800">
                      {step.number}
                    </div>

                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 transition duration-300 group-hover:rotate-6 group-hover:scale-110 dark:bg-indigo-500/15 dark:text-indigo-400">
                      <Icon size={34} />
                    </div>

                    <h3 className="mb-3 text-xl font-bold">
                      {step.title}
                    </h3>

                    <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-indigo-600 px-8 py-16 text-center text-white shadow-2xl shadow-indigo-600/20 md:px-16">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-blue-300/20 blur-2xl" />

          <div className="relative">
            <GraduationCap className="mx-auto mb-6" size={45} />

            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Let's Build a Better Campus Together
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-indigo-100">
              Be part of a smarter campus community. Start reporting
              problems and help create a better environment for everyone.
            </p>

            <Link
              href="/signup"
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-indigo-700 transition duration-300 hover:-translate-y-1 hover:bg-indigo-50 hover:shadow-xl"
            >
              Join Smart Campus
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-6 py-8 transition-colors dark:border-slate-800 dark:bg-[#0b1930]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2">
            <GraduationCap size={23} className="text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold">Smart Campus</span>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            © 2026 Smart Campus. All rights reserved.
          </p>

          <div className="flex gap-5 text-sm font-medium text-slate-600 dark:text-slate-400">
            <Link
              href="/login"
              className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Register
            </Link>
          </div>
        </div>
      </footer>

     
    </main>
  );
}