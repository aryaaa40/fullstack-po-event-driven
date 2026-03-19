"use client";

import { useEffect, useState, useCallback } from "react";
import { poRepository } from "@/lib/repositories/poRepository";
import { PurchaseOrder } from "@/types/po";

export function usePODetail(id: number) {
  const [po, setPO] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPO = useCallback(() => {
    setLoading(true);
    poRepository
      .getById(id)
      .then(setPO)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchPO();
  }, [fetchPO]);

  return { po, loading, error, refetch: fetchPO };
}
