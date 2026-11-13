"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import StaffSidebar from "@/components/StaffSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  LoaderCircle,
  Menu,
  RefreshCw,
  Wrench,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Complaint {
  _id: string;
  title: string;
  description: string;
  building: string;
  room: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  assignedAt?: string;
}

function StaffComplaintsContent() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/complaints/staff/my-duties`,
        { credentials: "include" }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load complaints.");
      }

      setComplaints(data.duties || []);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id);
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/complaints/staff/${id}/status`,
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

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update status.");
      }

      setComplaints((previous) =>
        previous.map((complaint) =>
          complaint._id === id
            ? { ...complaint, status }
            : complaint
        )
      );

      setMessage("Complaint status updated successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredComplaints =
    filter === "All"
      ? complaints
      : complaints.filter(
          (complaint) => complaint.status === filter
        );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "In Progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-600 dark:text-red-400";
      case "medium":
        return "text-orange-600 dark:text-orange-400";
      default:
        return "text-green-600 dark:text-green-400";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-950 dark:text-gray-100">
      <StaffSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="lg:ml-72">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/90 px-5 py-4 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div>
              <h1 className="text-xl font-bold md:text-2xl">
                My Complaints
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your assigned maintenance duties.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchComplaints}
              className="rounded-lg border border-gray-200 p-2 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
              title="Refresh complaints"
            >
              <RefreshCw size={19} />
            </button>
            <ThemeToggle />
          </div>
        </header>

        <div className="p-5 md:p-8">
          {message && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">
              {message}
            </div>
          )}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                label: "Total Assigned",
                value: complaints.length,
                icon: <Wrench size={22} />,
              },
              {
                label: "Pending",
                value: complaints.filter(
                  (item) => item.status === "Pending"
                ).length,
                icon: <Clock size={22} />,
              },
              {
                label: "Resolved",
                value: complaints.filter(
                  (item) => item.status === "Resolved"
                ).length,
                icon: <CheckCircle size={22} />,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.label}
                  </p>
                  <span className="text-green-600 dark:text-green-400">
                    {item.icon}
                  </span>
                </div>
                <h2 className="text-3xl font-bold">{item.value}</h2>
              </div>
            ))}
          </div>

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">
                Assigned Complaints
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Review and update your assigned duties.
              </p>
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none dark:border-gray-700 dark:bg-gray-900"
            >
              <option value="All">All Complaints</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            {loading ? (
              <div className="flex min-h-64 items-center justify-center">
                <LoaderCircle
                  className="animate-spin text-green-600"
                  size={32}
                />
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
                <AlertCircle
                  size={42}
                  className="mb-3 text-gray-400"
                />
                <h3 className="font-semibold">
                  No complaints found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  There are no complaints under this filter.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 dark:bg-gray-800/70 dark:text-gray-400">
                    <tr>
                      <th className="px-5 py-4 font-semibold">
                        Complaint
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Location
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Priority
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Status
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Date
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredComplaints.map((complaint) => (
                      <tr
                        key={complaint._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/40"
                      >
                        <td className="min-w-52 px-5 py-4">
                          <p className="font-semibold">
                            {complaint.title}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {complaint.category}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-gray-600 dark:text-gray-400">
                          {complaint.building || "N/A"}
                          <br />
                          <span className="text-xs">
                            Room: {complaint.room || "N/A"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <span
                            className={`font-semibold ${getPriorityStyle(
                              complaint.priority
                            )}`}
                          >
                            {complaint.priority || "Normal"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                              complaint.status
                            )}`}
                          >
                            {complaint.status}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                          {new Date(
                            complaint.createdAt
                          ).toLocaleDateString()}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          {complaint.status === "Pending" && (
                            <button
                              disabled={updatingId === complaint._id}
                              onClick={() =>
                                updateStatus(
                                  complaint._id,
                                  "In Progress"
                                )
                              }
                              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                              {updatingId === complaint._id
                                ? "Updating..."
                                : "Start Work"}
                            </button>
                          )}

                          {complaint.status === "In Progress" && (
                            <button
                              disabled={updatingId === complaint._id}
                              onClick={() =>
                                updateStatus(
                                  complaint._id,
                                  "Resolved"
                                )
                              }
                              className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                            >
                              {updatingId === complaint._id
                                ? "Updating..."
                                : "Mark Resolved"}
                            </button>
                          )}

                          {complaint.status === "Resolved" && (
                            <span className="text-xs font-semibold text-green-600">
                              Completed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function StaffComplaintsPage() {
  return (
    <ProtectedRoute allowedRole="staff">
      <StaffComplaintsContent />
    </ProtectedRoute>
  );
}