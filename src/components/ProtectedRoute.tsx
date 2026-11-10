"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "staff" | "admin";
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: "student" | "staff" | "admin";
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const ProtectedRoute = ({
  children,
  allowedRole,
}: ProtectedRouteProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          router.replace("/signin");
          return;
        }

        const data = await response.json();

        if (data.user.role !== allowedRole) {
          if (data.user.role === "student") {
            router.replace("/student/dashboard");
          } else if (data.user.role === "staff") {
            router.replace("/staff/dashboard");
          } else if (data.user.role === "admin") {
            router.replace("/admin/dashboard");
          }

          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error("Authentication error:", error);
        router.replace("/signin");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [allowedRole, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#071226]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />

          <p className="mt-4 text-sm text-slate-400">
            Checking your account...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;