"use client";

import { useEffect, useState } from "react";
import { poRepository } from "@/lib/repositories/poRepository";
import { PurchaseOrder } from "@/types/po";

// Fetches POs for current user (backend auto-filters by role)
export function useMyPOs() {
  const [pos, setPOs] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    poRepository
      .getPOs()
      .then((page) => setPOs(page.content))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { pos, loading, error };
}
