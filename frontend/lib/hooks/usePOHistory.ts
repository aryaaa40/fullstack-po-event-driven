"use client";

import { useEffect, useState } from "react";
import { poRepository } from "@/lib/repositories/poRepository";
import { ApprovalHistory } from "@/types/po";

export function usePOHistory(poId: number) {
  const [history, setHistory] = useState<ApprovalHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    poRepository
      .getHistory(poId)
      .then(setHistory)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [poId]);

  return { history, loading, error };
}
