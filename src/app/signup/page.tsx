"use client";

import campus from "../../../public/campus.png";
import { useEffect, useState } from "react";
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

  const [otp, setOtp] = useState("");
  const [verificationStep, setVerificationStep] = useState(false);

  const [googleSignup, setGoogleSignup] = useState(false);
  const [googleSignupToken, setGoogleSignupToken] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("google") === "1") {
      const token = sessionStorage.getItem("googleSignupToken");
      const googleUser = sessionStorage.getItem("googleUser");

      if (token && googleUser) {
        try {
          const user = JSON.parse(googleUser);

          setGoogleSignupToken(token);
          setName(user.name || "");
          setEmail(user.email || "");
          setGoogleSignup(true);

          sessionStorage.removeItem("googleSignupToken");
          sessionStorage.removeItem("googleUser");
        } catch {
          setError("Google registration session expired. Please try again.");
        }
      } else {
        setError("Google registration session expired. Please try again.");
      }
    }
  }, []);

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

  const handleGoogleSuccess = async (code: string) => {
    setError("");
    setSuccess("");
    setGoogleLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Google authentication failed.");
      }

      if (data.newUser) {
        setGoogleSignupToken(data.googleSignupToken);
        setName(data.googleUser.name || "");
        setEmail(data.googleUser.email || "");
        setGoogleSignup(true);
        return;
      }

      redirectUser(data.user.role);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Google sign-in failed."
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
      setError("Google sign-up failed. Please try again.");
    },
  });

  const handleGoogleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/google-register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            googleSignupToken,
            studentId,
            department,
            batch,
            phone,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Google registration failed.");
      }

      setSuccess("Your Google account has been created successfully.");

      setTimeout(() => {
        redirectUser(data.user.role);
      }, 1000);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Google registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/register`, {
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
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      if (data.verificationRequired) {
        setVerificationStep(true);
        setSuccess("Verification code sent to your email.");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed.");
      }

      setSuccess("Email verified! Your account has been created.");

      setTimeout(() => {
        router.push("/signin");
      }, 1500);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-[#0b1a32] dark:text-white dark:placeholder:text-slate-500 sm:py-4 sm:text-base";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300";

  const errorClass =
    "mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400";

  const successClass =
    "mb-4 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400";

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
            {!verificationStep && !googleSignup && (
              <>
                <div className="mb-6 sm:mb-8">
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Create Account
                  </h1>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400 sm:mt-3 sm:text-base sm:leading-7">
                    Create your student account to get started with the university portal.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4 sm:mb-5">
                    <label htmlFor="name" className={labelClass}>
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
                    <label htmlFor="studentId" className={labelClass}>
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
                    <label htmlFor="email" className={labelClass}>
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your Gmail address"
                      className={inputClass}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4 sm:mb-5">
                    <label htmlFor="department" className={labelClass}>
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
                    <label htmlFor="batch" className={labelClass}>
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
                    <label htmlFor="phone" className={labelClass}>
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
                    <label htmlFor="password" className={labelClass}>
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-indigo-600 dark:hover:text-white"
                      >
                        {showPassword ? "◉" : "◌"}
                      </button>
                    </div>
                  </div>

                  <div className="mb-6 sm:mb-7">
                    <label htmlFor="confirmPassword" className={labelClass}>
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-indigo-600 dark:hover:text-white"
                      >
                        {showConfirmPassword ? "◉" : "◌"}
                      </button>
                    </div>
                  </div>

                  {error && <p className={errorClass}>{error}</p>}

                  <button
                    type="submit"
                    disabled={loading || googleLoading}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-blue-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:py-4 sm:text-base"
                  >
                    {loading ? "Sending Verification Code..." : "Create Account"}
                    {!loading && <span className="text-lg sm:text-xl">→</span>}
                  </button>
                </form>

                <div className="my-6 flex items-center gap-3 sm:my-8 sm:gap-4">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                  <span className="text-xs text-slate-500 sm:text-sm">OR</span>
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
                    "Connecting to Google..."
                  ) : (
                    <>
                      <GoogleIcon />
                      Sign up with Google
                    </>
                  )}
                </button>

                {error && <p className={`mt-4 ${errorClass}`}>{error}</p>}

                <div className="my-6 flex items-center gap-3 sm:my-8 sm:gap-4">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                  <span className="text-xs text-slate-500 sm:text-sm">
                    Already registered?
                  </span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                </div>

                <p className="text-center text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                  Already have an account?
                  <Link
                    href="/signin"
                    className="ml-2 font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Sign In
                  </Link>
                </p>
              </>
            )}

            {googleSignup && !verificationStep && (
              <>
                <div className="mb-6 sm:mb-8">
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Complete Your Account
                  </h1>

                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
                    Your Google account is verified. Complete your student information to continue.
                  </p>

                  <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-500/30 dark:bg-indigo-500/10">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Google Account
                    </p>
                    <p className="mt-1 font-semibold text-indigo-600 dark:text-indigo-400">
                      {email}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleGoogleRegister}>
                  <div className="mb-4 sm:mb-5">
                    <label htmlFor="googleName" className={labelClass}>
                      Full Name
                    </label>
                    <input
                      id="googleName"
                      type="text"
                      className={`${inputClass} opacity-70`}
                      value={name}
                      readOnly
                    />
                  </div>

                  <div className="mb-4 sm:mb-5">
                    <label htmlFor="googleStudentId" className={labelClass}>
                      Student ID
                    </label>
                    <input
                      id="googleStudentId"
                      type="text"
                      placeholder="Enter your student ID"
                      className={inputClass}
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4 sm:mb-5">
                    <label htmlFor="googleDepartment" className={labelClass}>
                      Department
                    </label>
                    <select
                      id="googleDepartment"
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
                    <label htmlFor="googleBatch" className={labelClass}>
                      Batch
                    </label>
                    <input
                      id="googleBatch"
                      type="text"
                      placeholder="Enter your batch"
                      className={inputClass}
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-6 sm:mb-7">
                    <label htmlFor="googlePhone" className={labelClass}>
                      Phone Number
                    </label>
                    <input
                      id="googlePhone"
                      type="tel"
                      placeholder="Enter your phone number"
                      className={inputClass}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  {error && <p className={errorClass}>{error}</p>}
                  {success && <p className={successClass}>{success}</p>}

                  <button
                    type="submit"
                    disabled={loading || !googleSignupToken}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-60 sm:py-4 sm:text-base"
                  >
                    {loading ? "Creating Account..." : "Complete Registration"}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => {
                    setGoogleSignup(false);
                    setGoogleSignupToken("");
                    setStudentId("");
                    setDepartment("");
                    setBatch("");
                    setPhone("");
                    setError("");
                    window.history.replaceState({}, "", "/signup");
                  }}
                  className="mt-5 w-full text-center text-sm font-medium text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Back to Sign Up
                </button>
              </>
            )}

            {verificationStep && (
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Verify Your Email
                  </h1>

                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
                    We sent a 6-digit verification code to:
                  </p>

                  <p className="mt-2 font-semibold text-indigo-600 dark:text-indigo-400">
                    {email}
                  </p>
                </div>

                <form onSubmit={handleVerifyOTP}>
                  <div className="mb-6">
                    <label htmlFor="otp" className={labelClass}>
                      Verification Code
                    </label>

                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter 6-digit code"
                      className={`${inputClass} text-center text-2xl tracking-[0.5em]`}
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                      required
                    />
                  </div>

                  {error && <p className={errorClass}>{error}</p>}
                  {success && <p className={successClass}>{success}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-60 sm:py-4 sm:text-base"
                  >
                    {loading ? "Verifying..." : "Verify Email"}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => {
                    setVerificationStep(false);
                    setOtp("");
                    setError("");
                    setSuccess("");
                  }}
                  className="mt-5 w-full text-center text-sm font-medium text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Back to Sign Up
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default SignUpPage;