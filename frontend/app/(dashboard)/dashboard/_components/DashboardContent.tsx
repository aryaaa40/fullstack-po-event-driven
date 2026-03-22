"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { useDashboardPOs } from "@/lib/hooks/useDashboardPOs";
import { usePONotification } from "@/lib/hooks/usePONotification";
import { Role } from "@/types/auth";
import { useRecentActivity } from "@/lib/hooks/useRecentActivity";
import WelcomeCard from "./WelcomeCard";
import StatCards from "./StatCards";
import POTable from "./POTable";
import RecentActivity from "./RecentActivity";

const TABLE_TITLE: Record<Role, string> = {
  REQUESTER: "My Purchase Orders",
  MANAGER:   "Pending Approvals",
  FINANCE:   "Awaiting Final Approval",
};

export default function DashboardContent() {
  const { username, role } = useAuthStore();
  const { pos, loading, error, refetch } = useDashboardPOs();
  const { notifications } = usePONotification();
  const { activities, loading: actLoading, refetch: refetchActivity } = useRecentActivity();

  // Auto-refetch tabel dan recent activity saat ada event WebSocket masuk
  useEffect(() => {
    if (notifications.length > 0) {
      refetch();
      refetchActivity();
    }
  }, [notifications.length, refetch, refetchActivity]);

  if (!role) return null;

  return (
    <div className="flex flex-col gap-5">
      <WelcomeCard username={username ?? ""} role={role} pos={pos} />
      <StatCards pos={pos} role={role} />
      <POTable
        pos={pos}
        loading={loading}
        error={error}
        title={TABLE_TITLE[role]}
      />
      <RecentActivity activities={activities} loading={actLoading} />
    </div>
  );
}
