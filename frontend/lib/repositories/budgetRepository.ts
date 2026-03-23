import { apiClient } from "@/lib/api-client";
import { BudgetUtilization } from "@/types/po";
import { ApiResponse } from "@/types/common";

export interface BudgetResponse {
  id: number;
  department: { id: number; name: string; code: string };
  fiscalYear: number;
  fiscalMonth: number | null;
  totalAmount: number;
  createdBy: string;
  createdAt: string;
}

export interface BudgetRequest {
  departmentId: number;
  fiscalYear: number;
  fiscalMonth?: number | null;
  totalAmount: number;
}

export const budgetRepository = {
  getAll: async (fiscalYear: number): Promise<BudgetResponse[]> => {
    const res = await apiClient.get<ApiResponse<BudgetResponse[]>>(
      `/api/v1/budgets?fiscalYear=${fiscalYear}`
    );
    return res.data.data;
  },

  getUtilization: async (fiscalYear: number): Promise<BudgetUtilization[]> => {
    const res = await apiClient.get<ApiResponse<BudgetUtilization[]>>(
      `/api/v1/budgets/utilization?fiscalYear=${fiscalYear}`
    );
    return res.data.data;
  },

  create: async (data: BudgetRequest): Promise<BudgetResponse> => {
    const res = await apiClient.post<ApiResponse<BudgetResponse>>("/api/v1/budgets", data);
    return res.data.data;
  },

  update: async (id: number, data: BudgetRequest): Promise<BudgetResponse> => {
    const res = await apiClient.put<ApiResponse<BudgetResponse>>(`/api/v1/budgets/${id}`, data);
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/budgets/${id}`);
  },
};
