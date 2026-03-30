"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { useDashboardPOs } from "@/lib/hooks/useDashboardPOs";
import { usePONotification } from "@/lib/hooks/usePONotification";
import { useBudgetUtilization } from "@/lib/hooks/useBudgetUtilization";
import { Role } from "@/types/auth";
import { useRecentActivity } from "@/lib/hooks/useRecentActivity";
import WelcomeCard from "./WelcomeCard";
import StatCards from "./StatCards";
import POTable from "./POTable";
import RecentActivity from "./RecentActivity";
import BudgetUtilizationWidget from "./BudgetUtilizationWidget";

const TABLE_TITLE: Record<Role, string> = {
  REQUESTER: "My Purchase Orders",
  MANAGER:   "Pending Approvals",
  FINANCE:   "Awaiting Final Approval",
};

const CURRENT_YEAR = new Date().getFullYear();

export default function DashboardContent() {
  const { username, role, departmentId, departmentName } = useAuthStore();
  const { pos, loading, error, refetch } = useDashboardPOs();
  const { latestEvent } = usePONotification();
  const { activities, loading: actLoading, refetch: refetchActivity } = useRecentActivity();
  const { utilization, loading: budgetLoading } = useBudgetUtilization(CURRENT_YEAR);

  // Auto-refetch tabel dan recent activity hanya saat ada event WebSocket REAL-TIME masuk
  useEffect(() => {
    if (latestEvent) {
      refetch();
      refetchActivity();
    }
  }, [latestEvent, refetch, refetchActivity]);

  if (!role) return null;

  return (
    <div className="flex flex-col gap-5">
      <WelcomeCard
        username={username ?? ""}
        role={role}
        departmentName={departmentName}
        pos={pos}
      />
      <StatCards pos={pos} role={role} />
      <POTable
        pos={pos}
        loading={loading}
        error={error}
        title={TABLE_TITLE[role]}
      />
      <BudgetUtilizationWidget
        utilization={utilization}
        loading={budgetLoading}
        role={role}
        departmentId={departmentId}
        fiscalYear={CURRENT_YEAR}
      />
      <RecentActivity activities={activities} loading={actLoading} />
    </div>
  );
}
