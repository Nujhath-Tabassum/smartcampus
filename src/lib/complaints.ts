import { format } from "date-fns";

export type ComplaintStatus =
  | "pending"
  | "in-progress"
  | "resolved"
  | "rejected";

export interface Complaint {
  id: string;
  title: string;
  location: string;
  date: string; // ISO date (YYYY-MM-DD) or full ISO timestamp
  status: ComplaintStatus;
  description?: string;
  category?: string;
  building?: string;
  room?: string;
  priority?: string;
}

// Placeholder identity until auth (Better Auth) is wired up.
export const STUDENT = {
  name: "Ayesha Rahman",
  studentId: "2021CS045",
};

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  pending: "Pending",
  "in-progress": "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

// Static seed data matching the design mockups. New complaints reported
// through the form are persisted to localStorage and merged on top.
export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: "CMP-5021",
    title: "AC not working",
    location: "Room 502",
    date: "2025-09-30",
    status: "pending",
    category: "AC / Heating",
    building: "Block A",
    room: "502",
    priority: "High",
    description:
      "The AC in room 502 is not working since morning. It is very hot and uncomfortable.",
  },
  {
    id: "CMP-4987",
    title: "Light not working",
    location: "Block B",
    date: "2025-09-25",
    status: "in-progress",
    category: "Electrical",
    building: "Block B",
    room: "210",
    priority: "Medium",
    description: "Corridor light on the 2nd floor of Block B flickers constantly.",
  },
  {
    id: "CMP-4972",
    title: "WiFi Issue",
    location: "Library",
    date: "2025-09-22",
    status: "resolved",
    category: "Network / Wi-Fi",
    building: "Library",
    room: "Reading Hall",
    priority: "Medium",
    description: "WiFi drops intermittently in the reading hall.",
  },
  {
    id: "CMP-4960",
    title: "Broken chair",
    location: "Room 310",
    date: "2025-09-18",
    status: "resolved",
    category: "Furniture",
    building: "Block C",
    room: "310",
    priority: "Low",
    description: "One chair has a broken leg and is unsafe to sit on.",
  },
  {
    id: "CMP-4883",
    title: "Water leakage",
    location: "Block C",
    date: "2025-09-15",
    status: "pending",
    category: "Plumbing",
    building: "Block C",
    room: "Ground Floor",
    priority: "High",
    description: "Water is leaking near the wash area on the ground floor.",
  },
];

const STORAGE_KEY = "smartcampus:complaints";
export const COMPLAINTS_EVENT = "smartcampus:complaints-change";

export function generateComplaintId(): string {
  return `CMP-${Math.floor(1000 + Math.random() * 9000)}`;
}

// Date-only strings are parsed at local noon so the calendar day never
// shifts across timezones.
function parseDate(iso: string): Date {
  return iso.length <= 10 ? new Date(`${iso}T12:00:00`) : new Date(iso);
}

export function formatDate(iso: string): string {
  return format(parseDate(iso), "MMM d, yyyy");
}

export function formatDateTime(iso: string): string {
  return format(parseDate(iso), "MMM d, yyyy 'at' h:mm a");
}

// --- localStorage-backed store (client only) ---
// Swap these out for API calls once smartcampus-server exposes endpoints.

interface Snapshot {
  raw: string | null;
  value: Complaint[];
}

let cache: Snapshot | null = null;

export function readStoredComplaints(): Complaint[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!cache || cache.raw !== raw) {
      let value: Complaint[] = [];
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) value = parsed;
      }
      cache = { raw, value };
    }
    return cache.value;
  } catch {
    return [];
  }
}

export function subscribeToComplaints(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(COMPLAINTS_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(COMPLAINTS_EVENT, onStoreChange);
  };
}

export function addComplaint(complaint: Complaint): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const current = raw ? JSON.parse(raw) : [];
    const list = Array.isArray(current) ? current : [];
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([complaint, ...list]),
    );
    window.dispatchEvent(new Event(COMPLAINTS_EVENT));
  } catch {
    // localStorage unavailable (private mode / quota) — form still shows success.
  }
}
