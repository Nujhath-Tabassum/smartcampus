"use client";

import campus from "../../../public/campus.png";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const GoogleIcon = () => (
  <svg
    viewBox="0 0 48 48"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
      transform="translate(0 5)"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 38.03 46.98 31.88 46.98 24.55Z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z"
      transform="translate(0 5)"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.9 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
    />
  </svg>
);

const SignInPage = () => {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectUser = (role: string) => {
    if (role === "student") {
      router.push("/student/dashboard");
    } else if (role === "staff") {
      router.push("/staff/dashboard");
    } else if (role === "admin") {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid user role.");
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
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
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      redirectUser(data.user.role);
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

  const handleGoogleSuccess = async (code: string) => {
    setError("");
    setGoogleLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          code,
          rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Google sign-in failed."
        );
      }

      if (data.newUser) {
        sessionStorage.setItem(
          "googleSignupToken",
          data.googleSignupToken
        );

        sessionStorage.setItem(
          "googleUser",
          JSON.stringify(data.googleUser)
        );

        router.push("/signup?google=1");
        return;
      }

      redirectUser(data.user.role);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Google sign-in failed."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (response) => {
      handleGoogleSuccess(response.code);
    },
    onError: () => {
      setError("Google sign-in failed. Please try again.");
    },
  });

  const inputStyle =
    "w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-[#0b1a32] dark:text-white dark:placeholder:text-slate-500 sm:py-4 sm:pl-12 sm:text-base";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-[#071226] dark:text-white">
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

        <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 transition-colors dark:bg-[#071226] sm:px-6 sm:py-10 lg:px-16">
          <div className="w-full max-w-xl">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Sign In
              </h1>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400 sm:mt-3 sm:text-base sm:leading-7">
                Welcome back! Please sign in to your account
                to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4 sm:mb-5">
                <label
                  htmlFor="identifier"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
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
                    onChange={(e) =>
                      setIdentifier(e.target.value)
                    }
                    className={inputStyle}
                    required
                  />
                </div>
              </div>

              <div className="mb-4 sm:mb-5">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
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
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className={`${inputStyle} pr-12 sm:pr-14`}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-indigo-600 dark:hover:text-white sm:right-4"
                  >
                    {showPassword ? "◉" : "◌"}
                  </button>
                </div>
              </div>

              <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:mb-7">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600 dark:text-slate-300 sm:gap-3 sm:text-sm">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                    className="h-4 w-4 cursor-pointer accent-indigo-500 sm:h-5 sm:w-5"
                  />

                  Remember me
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 sm:text-sm"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <p className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || googleLoading}
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
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

              <span className="text-xs text-slate-500 sm:text-sm">
                OR
              </span>

              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <button
              type="button"
              onClick={() => {
                setError("");
                googleLogin();
              }}
              disabled={googleLoading || loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-800 shadow-lg transition duration-300 hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-indigo-500/10 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-[#0b1a32] dark:text-white dark:hover:bg-[#102344] sm:py-4 sm:text-base"
            >
              {googleLoading ? (
                "Signing in with Google..."
              ) : (
                <>
                  <GoogleIcon />
                  Continue with Google
                </>
              )}
            </button>

            <div className="my-6 flex items-center gap-3 sm:my-8 sm:gap-4">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

              <span className="text-xs text-slate-500 sm:text-sm">
                New here?
              </span>

              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <p className="text-center text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
              Don&apos;t have an account?

              <Link
                href="/signup"
                className="ml-2 font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
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