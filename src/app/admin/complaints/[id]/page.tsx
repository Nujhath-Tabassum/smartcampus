"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminSidebar from "@/components/AdminSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  CalendarDays,
  UserRound,
  Mail,
  MapPin,
  Building2,
  Hash,
  ClipboardList,
  AlertCircle,
  LoaderCircle,
  Save,
  UserCheck,
  UserPlus,
  Phone,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface AssignedStaff {
  _id: string;
  name: string;
  email: string;
}

interface Staff {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

interface Complaint {
  _id: string;
  title: string;
  category: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  building: string;
  room: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Resolved";
  createdAt: string;
  updatedAt?: string;
  assignedStaff?: AssignedStaff | null;
  assignedAt?: string;
}

const statusOptions = ["Pending", "In Progress", "Resolved"];

function AdminComplaintDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [status, setStatus] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [complaintResponse, staffResponse] = await Promise.all([
          fetch(`${API_URL}/api/complaints/admin/${id}`, {
            credentials: "include",
          }),
          fetch(`${API_URL}/api/auth/admin/staff`, {
            credentials: "include",
          }),
        ]);

        const complaintData = await complaintResponse.json();
        const staffData = await staffResponse.json();

        if (!complaintResponse.ok || !complaintData.success) {
          throw new Error(
            complaintData.message || "Failed to load complaint."
          );
        }

        if (!staffResponse.ok || !staffData.success) {
          throw new Error(staffData.message || "Failed to load staff.");
        }

        setComplaint(complaintData.complaint);
        setStatus(complaintData.complaint.status);
        setStaffList(staffData.staff || []);

        setSelectedStaff(
          complaintData.complaint.assignedStaff?._id || ""
        );
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

    if (id) {
      fetchDetails();
    }
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!complaint || status === complaint.status) {
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch(
        `${API_URL}/api/complaints/admin/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status.");
      }

      setComplaint({
        ...complaint,
        status: status as Complaint["status"],
        updatedAt: new Date().toISOString(),
      });

      toast.success("Complaint status updated successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignStaff = async () => {
    if (!selectedStaff) {
      toast.error("Please select a staff member.");
      return;
    }

    if (complaint?.assignedStaff?._id === selectedStaff) {
      toast.info("This staff member is already assigned.");
      return;
    }

    setAssigning(true);

    try {
      const response = await fetch(
        `${API_URL}/api/complaints/admin/${id}/assign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            staffId: selectedStaff,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to assign staff.");
      }

      const assignedMember = staffList.find(
        (member) => member._id === selectedStaff
      );

      if (assignedMember && complaint) {
        setComplaint({
          ...complaint,
          assignedStaff: {
            _id: assignedMember._id,
            name: assignedMember.name,
            email: assignedMember.email,
          },
          assignedAt: new Date().toISOString(),
        });
      }

      toast.success("Duty assigned successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setAssigning(false);
    }
  };

  const getStatusStyle = (value: string) => {
    if (value === "Resolved") {
      return "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400";
    }

    if (value === "In Progress") {
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400";
    }

    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400";
  };

  const getPriorityStyle = (value: string) => {
    if (value === "High") {
      return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400";
    }

    if (value === "Medium") {
      return "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400";
    }

    return "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <ProtectedRoute allowedRole="admin">
      <div className="min-h-screen bg-slate-50 transition-colors dark:bg-[#071226]">
        <AdminSidebar />

        <main className="min-h-screen lg:ml-64">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-[#0b1930]/90 md:px-8">
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                Complaint Details
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Review and manage student complaints
              </p>
            </div>

            <ThemeToggle />
          </header>

          <div className="p-5 md:p-8">
            <Link
              href="/admin/complaints"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400"
            >
              <ArrowLeft size={18} />
              Back to Complaints
            </Link>

            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                  <LoaderCircle
                    size={36}
                    className="mx-auto animate-spin text-indigo-600"
                  />
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    Loading complaint details...
                  </p>
                </div>
              </div>
            ) : !complaint ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-[#0b1930]">
                <AlertCircle
                  size={40}
                  className="mx-auto text-red-500"
                />

                <h2 className="mt-4 text-lg font-bold text-slate-800 dark:text-white">
                  Complaint Not Found
                </h2>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  The complaint could not be loaded.
                </p>

                <button
                  onClick={() => router.push("/admin/complaints")}
                  className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Back to Complaints
                </button>
              </div>
            ) : (
              <div className="mx-auto max-w-5xl space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0b1930] md:p-8">
                  <div className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-start">
                    <div>
                      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        Complaint #{complaint._id.slice(-6)}
                      </p>

                      <h2 className="mt-2 text-2xl font-bold text-slate-800 dark:text-white">
                        {complaint.title}
                      </h2>

                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {complaint.category}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                          complaint.status
                        )}`}
                      >
                        {complaint.status}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getPriorityStyle(
                          complaint.priority
                        )}`}
                      >
                        {complaint.priority} Priority
                      </span>
                    </div>
                  </div>

                  <div className="mt-7">
                    <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                      <ClipboardList
                        size={19}
                        className="text-indigo-500"
                      />
                      Complaint Description
                    </h3>

                    <p className="rounded-xl bg-slate-50 p-5 text-sm leading-7 text-slate-600 dark:bg-[#071226] dark:text-slate-300">
                      {complaint.description}
                    </p>
                  </div>

                  <div className="mt-8">
                    <h3 className="mb-4 font-semibold text-slate-800 dark:text-white">
                      Location Information
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-[#071226]">
                        <Building2
                          size={20}
                          className="text-indigo-500"
                        />

                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Building
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-white">
                            {complaint.building}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-[#071226]">
                        <MapPin
                          size={20}
                          className="text-indigo-500"
                        />

                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Room
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-white">
                            {complaint.room}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="mb-4 font-semibold text-slate-800 dark:text-white">
                      Student Information
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-[#071226]">
                        <UserRound
                          size={20}
                          className="text-indigo-500"
                        />

                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Student Name
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-white">
                            {complaint.studentName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-[#071226]">
                        <Hash
                          size={20}
                          className="text-indigo-500"
                        />

                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Student ID
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-white">
                            {complaint.studentId}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-[#071226] sm:col-span-2">
                        <Mail
                          size={20}
                          className="text-indigo-500"
                        />

                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Email Address
                          </p>

                          <p className="mt-1 break-all text-sm font-semibold text-slate-800 dark:text-white">
                            {complaint.studentEmail}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="mb-4 font-semibold text-slate-800 dark:text-white">
                      Submission Information
                    </h3>

                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-[#071226]">
                      <CalendarDays
                        size={20}
                        className="text-indigo-500"
                      />

                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Submitted On
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-white">
                          {formatDate(complaint.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0b1930] md:p-8">
                  <div className="mb-5">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
                      <UserCheck size={21} className="text-indigo-500" />
                      Staff Assignment
                    </h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Assign this complaint to a campus staff member.
                    </p>
                  </div>

                  {complaint.assignedStaff ? (
                    <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/30">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-green-100 p-2 text-green-700 dark:bg-green-900 dark:text-green-400">
                          <UserCheck size={20} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-400">
                            Currently Assigned To
                          </p>

                          <p className="mt-1 font-bold text-slate-800 dark:text-white">
                            {complaint.assignedStaff.name}
                          </p>

                          <p className="mt-1 break-all text-sm text-slate-600 dark:text-slate-400">
                            {complaint.assignedStaff.email}
                          </p>

                          {complaint.assignedAt && (
                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                              Assigned on: {formatDate(complaint.assignedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center dark:border-slate-700 dark:bg-[#071226]">
                      <UserPlus
                        size={28}
                        className="mx-auto text-slate-400"
                      />

                      <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                        No staff member assigned yet.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Select Staff Member
                      </label>

                      <select
                        value={selectedStaff}
                        onChange={(e) => setSelectedStaff(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-[#071226] dark:text-white"
                      >
                        <option value="">Choose a staff member</option>

                        {staffList.map((member) => (
                          <option key={member._id} value={member._id}>
                            {member.name} — {member.email}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleAssignStaff}
                      disabled={
                        assigning ||
                        !selectedStaff ||
                        complaint.assignedStaff?._id === selectedStaff
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {assigning ? (
                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                        />
                      ) : (
                        <UserCheck size={18} />
                      )}

                      {assigning
                        ? "Assigning..."
                        : complaint.assignedStaff
                          ? "Reassign Duty"
                          : "Assign Duty"}
                    </button>
                  </div>

                  {staffList.length === 0 && (
                    <p className="mt-3 text-sm text-orange-600 dark:text-orange-400">
                      No staff accounts found. Please create a staff account first.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0b1930] md:p-8">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                    Manage Complaint
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Update the complaint status after reviewing it.
                  </p>

                  <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Complaint Status
                      </label>

                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-[#071226] dark:text-white"
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleStatusUpdate}
                      disabled={updating || status === complaint.status}
                      className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updating ? (
                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                        />
                      ) : (
                        <Save size={18} />
                      )}

                      {updating ? "Updating..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function AdminComplaintDetails() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#071226]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      }
    >
      <AdminComplaintDetailsContent />
    </Suspense>
  );
}