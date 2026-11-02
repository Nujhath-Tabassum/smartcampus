
"use client";

import campus from "../../../public/campus.png";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const SignInPage = () => {
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({
      role,
      rememberMe,
    });

    // Later we will connect this to Better Auth
  };

  return (
    <main className="min-h-screen bg-[#071226] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* ================= LEFT SIDE ================= */}

        <section className="relative h-55 overflow-hidden sm:h-70 md:h-87.5 lg:h-screen">
          <Image
            src={campus}
            alt="University campus"
            fill
            className="object-cover"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-[#071b45]/20" />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-[#071b45]/20" />
        </section>

        {/* ================= RIGHT SIDE ================= */}

        <section className="flex min-h-screen items-center justify-center bg-[#071226] px-4 py-8 sm:px-6 sm:py-10 lg:px-16">

          <div className="w-full max-w-xl">

            {/* Heading */}

            <div className="mb-6 sm:mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Sign In
              </h1>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-400 sm:mt-3 sm:text-base sm:leading-7">
                Welcome back! Please sign in to your account
                to continue.
              </p>
            </div>

            {/* ================= ROLE SELECTOR ================= */}

            <div className="mb-6 grid grid-cols-3 gap-2 sm:mb-7 sm:gap-3">

              {/* Student */}

              <button
                type="button"
                onClick={() => setRole("student")}
                className={`rounded-xl border px-2 py-3 transition-all duration-200 sm:px-3 sm:py-4 ${
                  role === "student"
                    ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                    : "border-slate-700 bg-[#0b1a32] hover:border-slate-500"
                }`}
              >
                <div className="mb-1 text-xl sm:mb-2 sm:text-2xl">
                  🎓
                </div>

                <p
                  className={`text-xs font-semibold sm:text-sm ${
                    role === "student"
                      ? "text-indigo-400"
                      : "text-slate-300"
                  }`}
                >
                  Student
                </p>
              </button>

              {/* Admin */}

              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`rounded-xl border px-2 py-3 transition-all duration-200 sm:px-3 sm:py-4 ${
                  role === "admin"
                    ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                    : "border-slate-700 bg-[#0b1a32] hover:border-slate-500"
                }`}
              >
                <div className="mb-1 text-xl sm:mb-2 sm:text-2xl">
                  🛡️
                </div>

                <p
                  className={`text-xs font-semibold sm:text-sm ${
                    role === "admin"
                      ? "text-indigo-400"
                      : "text-slate-300"
                  }`}
                >
                  Admin
                </p>
              </button>

              {/* Staff */}

              <button
                type="button"
                onClick={() => setRole("staff")}
                className={`rounded-xl border px-2 py-3 transition-all duration-200 sm:px-3 sm:py-4 ${
                  role === "staff"
                    ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                    : "border-slate-700 bg-[#0b1a32] hover:border-slate-500"
                }`}
              >
                <div className="mb-1 text-xl sm:mb-2 sm:text-2xl">
                  👨‍🔧
                </div>

                <p
                  className={`text-xs font-semibold sm:text-sm ${
                    role === "staff"
                      ? "text-indigo-400"
                      : "text-slate-300"
                  }`}
                >
                  Staff
                </p>
              </button>

            </div>

            {/* ================= FORM ================= */}

            <form onSubmit={handleSubmit}>

              {/* Email */}

              <div className="mb-4 sm:mb-5">

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email or Student ID
                </label>

                <div className="relative">

                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400 sm:left-4 sm:text-xl">
                    ✉
                  </span>

                  <input
                    id="email"
                    type="text"
                    placeholder={
                      role === "student"
                        ? "Enter your email or student ID"
                        : "Enter your email"
                    }
                    className="w-full rounded-xl border border-slate-700 bg-[#0b1a32] py-3.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:py-4 sm:pl-12 sm:text-base"
                    required
                  />

                </div>

              </div>

              {/* Password */}

              <div className="mb-4 sm:mb-5">

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <div className="relative">

                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400 sm:left-4 sm:text-xl">
                    🔒
                  </span>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="off"
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-700 bg-[#0b1a32] py-3.5 pl-10 pr-12 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:py-4 sm:pl-12 sm:pr-14 sm:text-base"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white sm:right-4"
                  >
                    {showPassword ? "◉" : "◌"}
                  </button>

                </div>

              </div>

              {/* Remember + Forgot */}

              <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:mb-7">

                <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-300 sm:gap-3 sm:text-sm">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 cursor-pointer accent-indigo-500 sm:h-5 sm:w-5"
                  />

                  Remember me

                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-indigo-400 transition hover:text-indigo-300 sm:text-sm"
                >
                  Forgot password?
                </Link>

              </div>

              {/* Sign In Button */}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-blue-400 active:scale-[0.99] sm:py-4 sm:text-base"
              >
                Sign In

                <span className="text-lg sm:text-xl">
                  →
                </span>

              </button>

            </form>

            {/* ================= SIGN UP ================= */}

            <div className="my-6 flex items-center gap-3 sm:my-8 sm:gap-4">

              <div className="h-px flex-1 bg-slate-800" />

              <span className="text-xs text-slate-500 sm:text-sm">
                New here?
              </span>

              <div className="h-px flex-1 bg-slate-800" />

            </div>

            <p className="text-center text-xs text-slate-400 sm:text-sm">

              Don&apos;t have an account?

              <Link
                href="/sign-up"
                className="ml-2 font-semibold text-indigo-400 transition hover:text-indigo-300"
              >
                Sign Up
              </Link>

            </p>

            {/* Selected Role - temporary for testing */}

            <p className="mt-5 text-center text-[10px] text-slate-600 sm:mt-6 sm:text-xs">
              Selected role: {role}
            </p>

          </div>

        </section>

      </div>
    </main>
  );
};

export default SignInPage;