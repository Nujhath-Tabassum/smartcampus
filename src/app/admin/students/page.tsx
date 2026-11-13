"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminSidebar from "@/components/AdminSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { toast } from "react-toastify";
import {
  Search,
  Users,
  UserRound,
  Mail,
  GraduationCap,
  Phone,
  LoaderCircle,
  Eye,
  RefreshCw,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Student {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  batch: string;
  phone: string;
  createdAt?: string;
}

function AdminStudentsContent() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchStudents = async () => {
    setLoading(true);

    try {
      const query = new URLSearchParams({
        search,
        department,
      });

      const response = await fetch(
        `${API_URL}/api/auth/admin/students?${query.toString()}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load students.");
      }

      setStudents(data.students || []);
      setTotal(data.total || 0);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchStudents();
    }, 400);

    return () => clearTimeout(delay);
  }, [search, department]);

  const departments = [
    "All",
    ...new Set(students.map((student) => student.department).filter(Boolean)),
  ];

  return (
    <ProtectedRoute allowedRole="admin">
      <div className="min-h-screen bg-slate-50 transition-colors dark:bg-[#071226]">
        <AdminSidebar />

        <main className="min-h-screen lg:ml-64">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-[#0b1930]/90 md:px-8">
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                Student Management
              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                View and manage registered students
              </p>
            </div>

            <ThemeToggle />
          </header>

          <div className="p-5 md:p-8">
            <div className="mb-6 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0b1930]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Total Students
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-slate-800 dark:text-white">
                      {total}
                    </h2>
                  </div>

                  <div className="rounded-xl bg-indigo-100 p-3 dark:bg-indigo-500/15">
                    <Users
                      size={25}
                      className="text-indigo-600 dark:text-indigo-400"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0b1930]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Departments
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-slate-800 dark:text-white">
                      {departments.length - 1}
                    </h2>
                  </div>

                  <div className="rounded-xl bg-purple-100 p-3 dark:bg-purple-500/15">
                    <GraduationCap
                      size={25}
                      className="text-purple-600 dark:text-purple-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0b1930] md:p-6">
              <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                    All Students
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Search and filter registered students
                  </p>
                </div>

                <button
                  onClick={fetchStudents}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <RefreshCw
                    size={16}
                    className={loading ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
              </div>

              <div className="mb-6 flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="Search by name, email or student ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-[#071226] dark:text-white"
                  />
                </div>

                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-[#071226] dark:text-white"
                >
                  {departments.map((item) => (
                    <option key={item} value={item}>
                      {item === "All" ? "All Departments" : item}
                    </option>
                  ))}
                </select>
              </div>

              {loading ? (
                <div className="flex min-h-[300px] items-center justify-center">
                  <div className="text-center">
                    <LoaderCircle
                      size={36}
                      className="mx-auto animate-spin text-indigo-600"
                    />

                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                      Loading students...
                    </p>
                  </div>
                </div>
              ) : students.length === 0 ? (
                <div className="py-16 text-center">
                  <UserRound
                    size={45}
                    className="mx-auto text-slate-300 dark:text-slate-600"
                  />

                  <h3 className="mt-4 font-semibold text-slate-700 dark:text-white">
                    No Students Found
                  </h3>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Try changing your search or department filter.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400">
                        <th className="px-4 py-4">Student</th>
                        <th className="px-4 py-4">Student ID</th>
                        <th className="px-4 py-4">Department</th>
                        <th className="px-4 py-4">Batch</th>
                        <th className="px-4 py-4">Phone</th>
                        <th className="px-4 py-4">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {students.map((student) => (
                        <tr
                          key={student._id}
                          className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800/70 dark:hover:bg-[#13233d]"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                                <UserRound size={19} />
                              </div>

                              <div>
                                <p className="font-semibold text-slate-800 dark:text-white">
                                  {student.name}
                                </p>

                                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                  <Mail size={12} />
                                  {student.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                            {student.studentId}
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                            {student.department}
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                            {student.batch}
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                            <span className="flex items-center gap-2">
                              <Phone size={14} />
                              {student.phone || "Not provided"}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <Link
                              href={`/admin/students/${student._id}`}
                              className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20"
                            >
                              <Eye size={15} />
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!loading && students.length > 0 && (
                <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
                  Showing {students.length} students
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function AdminStudentsPage() {
  return <AdminStudentsContent />;
}