
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  UserRound,
  LogOut,
  GraduationCap,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const menuItems = [
  {
    name: "Dashboard",
    path: "/student/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Report Problem",
    path: "/student/report-problem",
    icon: PlusCircle,
  },
  {
    name: "My Complaints",
    path: "/student/my-complaints",
    icon: ClipboardList,
  },
  {
    name: "Profile",
    path: "/student/profile",
    icon: UserRound,
  },
];

export default function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      router.replace("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-200 bg-white px-5 py-7 text-slate-900 transition-colors dark:border-slate-800 dark:bg-[#0b1930] dark:text-white">
      <Link
        href="/student/dashboard"
        className="mb-10 flex items-center gap-3"
      >
        <div className="rounded-xl bg-indigo-600 p-2 text-white">
          <GraduationCap size={25} />
        </div>

        <div>
          <h1 className="text-lg font-bold">
            Smart Campus
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Student Portal
          </p>
        </div>
      </Link>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              }`}
            >
              <Icon size={19} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 pt-5 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </aside>
  );
}
