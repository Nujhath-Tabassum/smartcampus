"use client";

import campus from "../../../public/campus.png";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            identifier,
            password,
            rememberMe,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const role = data.user.role;

      if (role === "student") {
        router.push("/student/dashboard");
      } else if (role === "staff") {
        router.push("/staff/dashboard");
      } else if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        setError("Invalid user role");
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#071226] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        <section className="relative h-55 overflow-hidden sm:h-70 md:h-87.5 lg:h-screen">
          <Image
            src={campus}
            alt="University campus"
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-[#071b45]/20" />
        </section>

        <section className="flex min-h-screen items-center justify-center bg-[#071226] px-4 py-8 sm:px-6 sm:py-10 lg:px-16">

          <div className="w-full max-w-xl">

            <div className="mb-6 sm:mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Sign In
              </h1>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-400 sm:mt-3 sm:text-base sm:leading-7">
                Welcome back! Please sign in to your account
                to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="mb-4 sm:mb-5">
                <label
                  htmlFor="identifier"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email or Student ID
                </label>

                <div className="relative">

                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400 sm:left-4 sm:text-xl">
                    ✉
                  </span>

                  <input
                    id="identifier"
                    type="text"
                    placeholder="Enter your email or student ID"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-[#0b1a32] py-3.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:py-4 sm:pl-12 sm:text-base"
                    required
                  />

                </div>
              </div>

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
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              {error && (
                <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-blue-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:py-4 sm:text-base"
              >
                {loading ? "Signing In..." : "Sign In"}

                {!loading && (
                  <span className="text-lg sm:text-xl">
                    →
                  </span>
                )}

              </button>

            </form>

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
                href="/signup"
                className="ml-2 font-semibold text-indigo-400 transition hover:text-indigo-300"
              >
                Sign Up
              </Link>

            </p>

          </div>

        </section>

      </div>
    </main>
  );
};

export default SignInPage;