"use client";

import { useEffect, useState, ChangeEvent } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import StaffSidebar from "@/components/StaffSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { toast } from "react-toastify";
import {
  UserRound,
  Mail,
  ShieldCheck,
  CalendarDays,
  LoaderCircle,
  Menu,
  Pencil,
  Phone,
  Save,
  X,
} from "lucide-react";

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

function StaffProfileContent() {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load profile.");
        }

        setStaff(data.user);

        setFormData({
          name: data.user.name || "",
          phone: data.user.phone || "",
        });
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = () => {
    if (!staff) return;

    setFormData({
      name: staff.name || "",
      phone: staff.phone || "",
    });

    setEditing(true);
  };

  const handleCancel = () => {
    if (!staff) return;

    setFormData({
      name: staff.name || "",
      phone: staff.phone || "",
    });

    setEditing(false);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/auth/staff/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile.");
      }

      setStaff(data.user);

      setFormData({
        name: data.user.name || "",
        phone: data.user.phone || "",
      });

      setEditing(false);

      toast.success(data.message || "Profile updated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 transition-colors dark:bg-[#071226]">
      <StaffSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="min-h-screen lg:ml-72">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-[#0b1930]/90 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                Staff Profile
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                View and manage your account information
              </p>
            </div>
          </div>

          <ThemeToggle />
        </header>

        <div className="mx-auto max-w-5xl p-5 md:p-8">
          {loading ? (
            <div className="flex min-h-[60vh] items-center justify-center">
              <LoaderCircle
                size={36}
                className="animate-spin text-indigo-500"
              />
            </div>
          ) : !staff ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-[#0b1930]">
              <UserRound
                size={40}
                className="mx-auto text-slate-400"
              />
              <h2 className="mt-4 text-lg font-semibold text-slate-800 dark:text-white">
                Unable to load profile
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Please refresh the page and try again.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0b1930]">
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600" />

                <div className="px-6 pb-7">
                  <div className="-mt-12 flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-indigo-100 text-3xl font-bold text-indigo-600 shadow-md dark:border-[#0b1930] dark:bg-indigo-950 dark:text-indigo-300">
                    {staff.name?.charAt(0).toUpperCase()}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                        {staff.name}
                      </h2>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          Staff Member
                        </span>

                        <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                          Active
                        </span>
                      </div>
                    </div>

                    {!editing && (
                      <button
                        onClick={handleEdit}
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                      >
                        <Pencil size={16} />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0b1930]">
                <h3 className="mb-6 text-lg font-bold text-slate-800 dark:text-white">
                  Account Information
                </h3>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                      <UserRound size={21} />
                    </div>

                    <div className="w-full">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Full Name
                      </p>

                      {editing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                      ) : (
                        <p className="mt-1 font-semibold text-slate-800 dark:text-white">
                          {staff.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                      <Mail size={21} />
                    </div>

                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Email Address
                      </p>
                      <p className="mt-1 break-all font-semibold text-slate-800 dark:text-white">
                        {staff.email}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Email cannot be changed.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-950 dark:text-purple-300">
                      <ShieldCheck size={21} />
                    </div>

                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Account Role
                      </p>
                      <p className="mt-1 font-semibold capitalize text-slate-800 dark:text-white">
                        {staff.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-green-100 p-3 text-green-600 dark:bg-green-950 dark:text-green-300">
                      <CalendarDays size={21} />
                    </div>

                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Account Created
                      </p>
                      <p className="mt-1 font-semibold text-slate-800 dark:text-white">
                        {staff.createdAt
                          ? new Date(staff.createdAt).toLocaleDateString()
                          : "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-orange-100 p-3 text-orange-600 dark:bg-orange-950 dark:text-orange-300">
                      <Phone size={21} />
                    </div>

                    <div className="w-full">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Phone Number
                      </p>

                      {editing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                      ) : (
                        <p className="mt-1 font-semibold text-slate-800 dark:text-white">
                          {staff.phone || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {editing && (
                  <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <X size={17} />
                      Cancel
                    </button>

                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {saving ? (
                        <LoaderCircle
                          size={17}
                          className="animate-spin"
                        />
                      ) : (
                        <Save size={17} />
                      )}
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function StaffProfilePage() {
  return (
    <ProtectedRoute allowedRole="staff">
      <StaffProfileContent />
    </ProtectedRoute>
  );
}