"use client";

import { useCallback, useEffect, useState } from "react";
import { activityRepository } from "@/lib/repositories/activityRepository";
import { ApprovalHistory } from "@/types/po";

export function useRecentActivity() {
  const [activities, setActivities] = useState<ApprovalHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    activityRepository
      .getRecentActivity()
      .then(setActivities)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch();
  }, []);

  return { activities, loading, error, refetch: fetch };
}
