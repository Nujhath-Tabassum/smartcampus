"use client";

import campus from "../../../public/campus.png";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const SignUpPage = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            studentId,
            email,
            department,
            batch,
            phone,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      router.push("/signin");
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

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-[#0b1a32] py-3.5 px-4 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:py-4 sm:text-base";

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
                Create Account
              </h1>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-400 sm:mt-3 sm:text-base sm:leading-7">
                Create your student account to get started with the university portal.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4 sm:mb-5">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4 sm:mb-5">
                <label
                  htmlFor="studentId"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Student ID
                </label>

                <input
                  id="studentId"
                  type="text"
                  placeholder="Enter your student ID"
                  className={inputClass}
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4 sm:mb-5">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your university email"
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4 sm:mb-5">
                <label
                  htmlFor="department"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Department
                </label>

                <select
                  id="department"
                  className={`${inputClass} appearance-none`}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select your department
                  </option>
                  <option value="CSE">Computer Science & Engineering</option>
                  <option value="EEE">Electrical & Electronic Engineering</option>
                  <option value="BBA">Business Administration</option>
                  <option value="English">English</option>
                  <option value="Law">Law</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-4 sm:mb-5">
                <label
                  htmlFor="batch"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Batch
                </label>

                <input
                  id="batch"
                  type="text"
                  placeholder="Enter your batch"
                  className={inputClass}
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4 sm:mb-5">
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className={inputClass}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4 sm:mb-5">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    className={`${inputClass} pr-14`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                  >
                    {showPassword ? "◉" : "◌"}
                  </button>
                </div>
              </div>

              <div className="mb-6 sm:mb-7">
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    className={`${inputClass} pr-14`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                  >
                    {showConfirmPassword ? "◉" : "◌"}
                  </button>
                </div>
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
                {loading ? "Creating Account..." : "Create Account"}

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
                Already registered?
              </span>

              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <p className="text-center text-xs text-slate-400 sm:text-sm">
              Already have an account?

              <Link
                href="/signin"
                className="ml-2 font-semibold text-indigo-400 transition hover:text-indigo-300"
              >
                Sign In
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SignUpPage;