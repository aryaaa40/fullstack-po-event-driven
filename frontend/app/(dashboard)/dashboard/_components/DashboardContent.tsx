"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { useDashboardPOs } from "@/lib/hooks/useDashboardPOs";
import { Role } from "@/types/auth";
import WelcomeCard from "./WelcomeCard";
import StatCards from "./StatCards";
import POTable from "./POTable";

const TABLE_TITLE: Record<Role, string> = {
  REQUESTER: "My Purchase Orders",
  MANAGER:   "Pending Approvals",
  FINANCE:   "Awaiting Final Approval",
};

export default function DashboardContent() {
  const { username, role } = useAuthStore();
  const { pos, loading, error } = useDashboardPOs();

  if (!role) return null;

  return (
    <div className="flex flex-col gap-5">
      <WelcomeCard username={username ?? ""} role={role} pos={pos} />
      <StatCards pos={pos} />
      <POTable
        pos={pos}
        loading={loading}
        error={error}
        title={TABLE_TITLE[role]}
      />
    </div>
  );
}
