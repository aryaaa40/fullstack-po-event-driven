"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { activityRepository } from "@/lib/repositories/activityRepository";
import { ApprovalHistory } from "@/types/po";

export function useRecentActivity() {
  const token = useAuthStore((s) => s.token);
  const [activities, setActivities] = useState<ApprovalHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    if (!token) return;
    activityRepository
      .getRecentActivity()
      .then(setActivities)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { activities, loading, error, refetch: fetch };
}
