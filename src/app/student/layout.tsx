import { Suspense } from "react";
import StudentSidebar from "@/components/StudentSidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#071226]">
      <Suspense
        fallback={
          <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0b1930]" />
        }
      >
        <StudentSidebar />
      </Suspense>

      <main className="ml-64 min-h-screen">{children}</main>
    </div>
  );
}