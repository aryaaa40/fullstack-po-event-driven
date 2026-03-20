"use client";

import { useEffect, useState, useCallback } from "react";
import { poRepository } from "@/lib/repositories/poRepository";
import { PurchaseOrder, POStatus } from "@/types/po";

export function usePOList(status?: POStatus) {
  const [pos, setPOs] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPOs = useCallback(() => {
    setLoading(true);
    poRepository
      .getPOs({ status })
      .then((page) => setPOs(page.content))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [status]);

  useEffect(() => {
    fetchPOs();
  }, [fetchPOs]);

  return { pos, loading, error, refetch: fetchPOs };
}
