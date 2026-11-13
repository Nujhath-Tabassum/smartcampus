"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminSidebar from "@/components/AdminSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  LoaderCircle,
  X,
  Eye,
  Menu,
} from "lucide-react";
import { toast } from "react-toastify";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Staff {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt?: string;
}

function AdminStaffContent() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const fetchStaff = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/admin/staff`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load staff.");
      }

      setStaff(data.staff || []);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load staff."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const response = await fetch(
        `${API_URL}/api/auth/admin/staff`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to create staff account."
        );
      }

      toast.success("Staff account created successfully.");

      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
      });

      setShowForm(false);
      await fetchStaff();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create staff account."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStaff = staff.filter((member) => {
    const searchText = search.toLowerCase();

    return (
      member.name.toLowerCase().includes(searchText) ||
      member.email.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 transition-colors dark:bg-[#071226]">
      <AdminSidebar
        mobileOpen={mobileOpen}
        closeMobile={() => setMobileOpen(false)}
      />

      <main className="min-h-screen md:ml-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-[#0b1930]/90 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
            >
              <Menu size={22} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                Staff Management
              </h1>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage your campus staff members
              </p>
            </div>
          </div>

          <ThemeToggle />
        </header>

        <div className="mx-auto max-w-7xl space-y-6 p-5 md:p-8">
          <section>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0b1930]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Total Staff
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-800 dark:text-white">
                    {staff.length}
                  </h2>
                </div>

                <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                  <Users size={25} />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0b1930]">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-[#071226] dark:text-white"
                />
              </div>

              <button
                onClick={() => setShowForm(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <Plus size={19} />
                Add Staff
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0b1930]">
            <div className="border-b border-slate-200 p-5 dark:border-slate-800">
              <h2 className="font-bold text-slate-800 dark:text-white">
                Staff Members ({filteredStaff.length})
              </h2>
            </div>

            {loading ? (
              <div className="flex min-h-64 items-center justify-center">
                <LoaderCircle
                  size={35}
                  className="animate-spin text-indigo-500"
                />
              </div>
            ) : filteredStaff.length === 0 ? (
              <div className="p-12 text-center">
                <Users
                  size={42}
                  className="mx-auto text-slate-300 dark:text-slate-600"
                />

                <h3 className="mt-4 font-semibold text-slate-700 dark:text-white">
                  No staff members found
                </h3>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Add a staff member or try another search.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-[#071226] dark:text-slate-400">
                    <tr>
                      <th className="px-6 py-4">
                        Staff Member
                      </th>

                      <th className="px-6 py-4">
                        Phone
                      </th>

                      <th className="px-6 py-4">
                        Role
                      </th>

                      <th className="px-6 py-4">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredStaff.map((member) => (
                      <tr
                        key={member._id}
                        className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                              {member.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-800 dark:text-white">
                                {member.name}
                              </p>

                              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                <Mail size={12} />
                                {member.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          <span className="flex items-center gap-2">
                            <Phone size={14} />
                            {member.phone || "Not provided"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                            Staff
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/staff/${member._id}`}
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900"
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
          </section>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-[#0b1930]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  Add New Staff
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Create a staff account for your campus.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={21} />
              </button>
            </div>

            <form
              onSubmit={handleAddStaff}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Full Name"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-[#071226] dark:text-white"
              />

              <input
                type="email"
                placeholder="Email Address"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-[#071226] dark:text-white"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-[#071226] dark:text-white"
              />

              <input
                type="password"
                placeholder="Temporary Password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-[#071226] dark:text-white"
              />

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Create Staff Account
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminStaffPage() {
  return (
    <ProtectedRoute allowedRole="admin">
      <AdminStaffContent />
    </ProtectedRoute>
  );
}