"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { poRepository } from "@/lib/repositories/poRepository";
import { PurchaseOrder, POStatus } from "@/types/po";
import { Role } from "@/types/auth";

// Status filter per role for the dashboard table
const DASHBOARD_STATUS: Partial<Record<Role, POStatus>> = {
  MANAGER: "PENDING",
  FINANCE: "MANAGER_APPROVED",
};

export function useDashboardPOs() {
  const role = useAuthStore((s) => s.role);
  const [pos, setPOs] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPOs = useCallback(() => {
    if (!role) return;
    const status = DASHBOARD_STATUS[role];
    setLoading(true);
    poRepository
      .getPOs({ status })
      .then((page) => setPOs(page.content))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [role]);

  useEffect(() => {
    fetchPOs();
  }, [fetchPOs]);

  return { pos, loading, error, refetch: fetchPOs };
}
