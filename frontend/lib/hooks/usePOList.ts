"use client";

import { useEffect, useState, useCallback } from "react";
import { poRepository, GetPOsParams } from "@/lib/repositories/poRepository";
import { PurchaseOrder } from "@/types/po";

export function usePOList(filters: GetPOsParams = {}) {
  const [pos, setPOs] = useState<PurchaseOrder[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Serialize filters ke string agar useCallback mendeteksi perubahan
  const filtersKey = JSON.stringify(filters);

  const fetchPOs = useCallback(() => {
    setLoading(true);
    setError(null);
    poRepository
      .getPOs(JSON.parse(filtersKey) as GetPOsParams)
      .then((page) => {
        setPOs(page.content);
        setTotalElements(page.totalElements);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  useEffect(() => {
    fetchPOs();
  }, [fetchPOs]);

  return { pos, totalElements, loading, error, refetch: fetchPOs };
}
