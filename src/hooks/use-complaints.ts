import { useMemo, useSyncExternalStore } from "react";

import {
  MOCK_COMPLAINTS,
  readStoredComplaints,
  subscribeToComplaints,
  type Complaint,
} from "@/lib/complaints";

const EMPTY: Complaint[] = [];

function getSnapshot(): Complaint[] {
  return readStoredComplaints();
}

function getServerSnapshot(): Complaint[] {
  return EMPTY;
}

/**
 * Merges complaints reported on this device (localStorage) with the seed
 * data, newest first. Once the backend is wired up, replace the body of
 * this hook with a fetch.
 */
export function useComplaints(): Complaint[] {
  const stored = useSyncExternalStore(
    subscribeToComplaints,
    getSnapshot,
    getServerSnapshot,
  );

  return useMemo(
    () =>
      [...stored, ...MOCK_COMPLAINTS].sort((a, b) =>
        b.date.localeCompare(a.date),
      ),
    [stored],
  );
}
