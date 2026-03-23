"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { budgetRepository } from "@/lib/repositories/budgetRepository";
import { BudgetUtilization } from "@/types/po";

export function useBudgetUtilization(fiscalYear?: number) {
  const token = useAuthStore((s) => s.token);
  const year = fiscalYear ?? new Date().getFullYear();
  const [utilization, setUtilization] = useState<BudgetUtilization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    if (!token) return;
    setLoading(true);
    budgetRepository
      .getUtilization(year)
      .then(setUtilization)
      .catch(() => setError("Failed to load budget utilization"))
      .finally(() => setLoading(false));
  }, [year, token]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { utilization, loading, error, refetch: fetch };
}
