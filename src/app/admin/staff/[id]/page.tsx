"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  UserRound,
  CalendarDays,
  ShieldCheck,
  LoaderCircle,
  ClipboardList,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import { toast } from "react-toastify";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminSidebar from "@/components/AdminSidebar";
import ThemeToggle from "@/components/ThemeToggle";

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

interface Duty {
  _id: string;
  title: string;
  category: string;
  studentName: string;
  studentId: string;
  building: string;
  room: string;
  priority: string;
  status: string;
  assignedAt?: string;
  createdAt?: string;
}

function StaffDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [staff, setStaff] = useState<Staff | null>(null);
  const [duties, setDuties] = useState<Duty[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [staffResponse, dutiesResponse] = await Promise.all([
          fetch(`${API_URL}/api/auth/admin/staff/${id}`, {
            credentials: "include",
          }),
          fetch(`${API_URL}/api/complaints/admin/staff/${id}/duties`, {
            credentials: "include",
          }),
        ]);

        const staffData = await staffResponse.json();
        const dutiesData = await dutiesResponse.json();

        if (!staffResponse.ok || !staffData.success) {
          throw new Error(
            staffData.message || "Failed to load staff details."
          );
        }

        if (!dutiesResponse.ok || !dutiesData.success) {
          throw new Error(
            dutiesData.message || "Failed to load assigned duties."
          );
        }

        setStaff(staffData.staff);
        setDuties(dutiesData.duties || []);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load staff details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  const pending = duties.filter(
    (duty) => duty.status === "Pending"
  ).length;

  const inProgress = duties.filter(
    (duty) => duty.status === "In Progress"
  ).length;

  const resolved = duties.filter(
    (duty) => duty.status === "Resolved"
  ).length;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
      case "In Progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
      default:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
      case "Medium":
        return "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400";
      default:
        return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    }
  };

  return (
    <ProtectedRoute allowedRole="admin">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <AdminSidebar
          mobileOpen={mobileOpen}
          closeMobile={() => setMobileOpen(false)}
        />

        <main className="min-h-screen lg:ml-72">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/90 px-5 py-4 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90 md:px-8">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-gray-200 p-2 text-gray-700 dark:border-gray-700 dark:text-gray-200 lg:hidden"
            >
              <span className="text-xl">☰</span>
            </button>

            <div className="hidden lg:block">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Staff Details
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Staff information and assigned duties
              </p>
            </div>

            <ThemeToggle />
          </header>

          <div className="p-5 md:p-8">
            <Link
              href="/admin/staff"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800 dark:text-green-400"
            >
              <ArrowLeft size={17} />
              Back to Staff
            </Link>

            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <LoaderCircle
                  className="animate-spin text-green-600"
                  size={35}
                />
              </div>
            ) : !staff ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
                <UserRound
                  size={45}
                  className="mx-auto mb-4 text-gray-400"
                />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Staff member not found
                </h2>
                <button
                  onClick={() => router.push("/admin/staff")}
                  className="mt-5 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                >
                  Back to Staff
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <div className="h-36 bg-gradient-to-r from-green-600 to-emerald-400" />

                  <div className="px-6 pb-8 md:px-8">
                    <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-green-100 text-green-700 shadow-sm dark:border-gray-900 dark:bg-green-950 dark:text-green-400">
                        <UserRound size={45} />
                      </div>

                      <span className="flex w-fit items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 dark:bg-green-950 dark:text-green-400">
                        <ShieldCheck size={16} />
                        Staff Account
                      </span>
                    </div>

                    <div className="mt-5">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {staff.name}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Campus Staff Member
                      </p>
                    </div>

                    <div className="mt-8 grid gap-5 sm:grid-cols-2">
                      <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                        <div className="mb-3 flex items-center gap-3">
                          <Mail className="text-blue-600" size={19} />
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Email Address
                          </h3>
                        </div>
                        <p className="break-all text-sm text-gray-600 dark:text-gray-400">
                          {staff.email}
                        </p>
                      </div>

                      <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                        <div className="mb-3 flex items-center gap-3">
                          <Phone className="text-purple-600" size={19} />
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Phone Number
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {staff.phone || "Not provided"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                        <div className="mb-3 flex items-center gap-3">
                          <ShieldCheck className="text-green-600" size={19} />
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Account Role
                          </h3>
                        </div>
                        <p className="text-sm capitalize text-gray-600 dark:text-gray-400">
                          {staff.role}
                        </p>
                      </div>

                      <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                        <div className="mb-3 flex items-center gap-3">
                          <CalendarDays className="text-orange-600" size={19} />
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Joined Date
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {staff.createdAt
                            ? new Date(staff.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )
                            : "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <section>
                  <div className="mb-5">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Assigned Duties
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Complaints assigned to this staff member
                    </p>
                  </div>

                  <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Total Duties
                        </p>
                        <ClipboardList className="text-green-600" />
                      </div>
                      <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
                        {duties.length}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Pending
                        </p>
                        <AlertCircle className="text-yellow-600" />
                      </div>
                      <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
                        {pending}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          In Progress
                        </p>
                        <Clock className="text-blue-600" />
                      </div>
                      <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
                        {inProgress}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Resolved
                        </p>
                        <CheckCircle className="text-green-600" />
                      </div>
                      <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
                        {resolved}
                      </p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    {duties.length === 0 ? (
                      <div className="p-12 text-center">
                        <ClipboardList
                          size={42}
                          className="mx-auto mb-4 text-gray-400"
                        />
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          No duties assigned yet
                        </h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Assigned complaints will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            <tr>
                              <th className="px-5 py-4">Complaint</th>
                              <th className="px-5 py-4">Student</th>
                              <th className="px-5 py-4">Location</th>
                              <th className="px-5 py-4">Priority</th>
                              <th className="px-5 py-4">Status</th>
                              <th className="px-5 py-4">Assigned Date</th>
                              <th className="px-5 py-4">Action</th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {duties.map((duty) => (
                              <tr
                                key={duty._id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                              >
                                <td className="px-5 py-4">
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {duty.title}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {duty.category}
                                  </p>
                                </td>

                                <td className="px-5 py-4">
                                  <p className="font-medium text-gray-800 dark:text-gray-200">
                                    {duty.studentName}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {duty.studentId}
                                  </p>
                                </td>

                                <td className="px-5 py-4 text-gray-600 dark:text-gray-400">
                                  {duty.building}, {duty.room}
                                </td>

                                <td className="px-5 py-4">
                                  <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                                      duty.priority
                                    )}`}
                                  >
                                    {duty.priority}
                                  </span>
                                </td>

                                <td className="px-5 py-4">
                                  <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                      duty.status
                                    )}`}
                                  >
                                    {duty.status}
                                  </span>
                                </td>

                                <td className="px-5 py-4 text-gray-600 dark:text-gray-400">
                                  {duty.assignedAt
                                    ? new Date(
                                        duty.assignedAt
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </td>

                                <td className="px-5 py-4">
                                  <Link
                                    href={`/admin/complaints/${duty._id}`}
                                    className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-400"
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
                  </div>
                </section>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function StaffDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <LoaderCircle className="animate-spin text-green-600" size={35} />
        </div>
      }
    >
      <StaffDetailsContent />
    </Suspense>
  );
}