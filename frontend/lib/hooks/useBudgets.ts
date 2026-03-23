"use client";

import { useState, useEffect, useCallback } from "react";
import { budgetRepository, BudgetResponse, BudgetRequest } from "@/lib/repositories/budgetRepository";

export function useBudgets(fiscalYear: number) {
  const [budgets, setBudgets] = useState<BudgetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(() => {
    setLoading(true);
    budgetRepository
      .getAll(fiscalYear)
      .then(setBudgets)
      .catch(() => setError("Failed to load budgets"))
      .finally(() => setLoading(false));
  }, [fiscalYear]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const create = useCallback(
    async (data: BudgetRequest) => {
      await budgetRepository.create(data);
      fetchBudgets();
    },
    [fetchBudgets]
  );

  const update = useCallback(
    async (id: number, data: BudgetRequest) => {
      await budgetRepository.update(id, data);
      fetchBudgets();
    },
    [fetchBudgets]
  );

  const remove = useCallback(
    async (id: number) => {
      await budgetRepository.delete(id);
      fetchBudgets();
    },
    [fetchBudgets]
  );

  return { budgets, loading, error, create, update, remove, refetch: fetchBudgets };
}
