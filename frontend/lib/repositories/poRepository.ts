import { apiClient } from "@/lib/api-client";
import { PurchaseOrder, CreatePORequest, POStatus, POCategory, POPriority, ApprovalHistory } from "@/types/po";
import { ApiResponse, PageResponse } from "@/types/common";

export interface GetPOsParams {
  status?: POStatus;
  search?: string;
  category?: POCategory;
  priority?: POPriority;
  dateFrom?: string; // format: YYYY-MM-DD
  dateTo?: string;   // format: YYYY-MM-DD
  page?: number;
  size?: number;
  sortBy?: string;
}

export const poRepository = {
  getPOs: async (
    params: GetPOsParams = {},
  ): Promise<PageResponse<PurchaseOrder>> => {
    const { status, search, category, priority, dateFrom, dateTo, page = 0, size = 50, sortBy } = params;
    const query = new URLSearchParams({
      page: String(page),
      size: String(size),
    });
    if (status) query.set("status", status);
    if (typeof search === "string" && search.trim()) query.set("search", search.trim());
    if (category) query.set("category", category);
    if (priority) query.set("priority", priority);
    if (dateFrom) query.set("dateFrom", dateFrom);
    if (dateTo) query.set("dateTo", dateTo);
    if (sortBy) query.set("sortBy", sortBy);
    const res = await apiClient.get<ApiResponse<PageResponse<PurchaseOrder>>>(
      `/api/v1/purchase-orders?${query}`,
    );
    return res.data.data;
  },

  getById: async (id: number): Promise<PurchaseOrder> => {
    const res = await apiClient.get<ApiResponse<PurchaseOrder>>(
      `/api/v1/purchase-orders/${id}`,
    );
    return res.data.data;
  },

  create: async (data: CreatePORequest): Promise<PurchaseOrder> => {
    const res = await apiClient.post<ApiResponse<PurchaseOrder>>(
      "/api/v1/purchase-orders",
      data,
    );
    return res.data.data;
  },

  approve: async (id: number): Promise<PurchaseOrder> => {
    const res = await apiClient.patch<ApiResponse<PurchaseOrder>>(
      `/api/v1/purchase-orders/${id}/approve`,
    );
    return res.data.data;
  },

  reject: async (id: number): Promise<PurchaseOrder> => {
    const res = await apiClient.patch<ApiResponse<PurchaseOrder>>(
      `/api/v1/purchase-orders/${id}/reject`,
    );
    return res.data.data;
  },

  // FINANCE actions
  financeApprove: async (id: number): Promise<PurchaseOrder> => {
    const res = await apiClient.patch<ApiResponse<PurchaseOrder>>(
      `/api/v1/purchase-orders/${id}/finance-approve`,
    );
    return res.data.data;
  },

  financeReject: async (id: number): Promise<PurchaseOrder> => {
    const res = await apiClient.patch<ApiResponse<PurchaseOrder>>(
      `/api/v1/purchase-orders/${id}/finance-reject`,
    );
    return res.data.data;
  },

  getHistory: async (id: number): Promise<ApprovalHistory[]> => {
    const res = await apiClient.get<ApiResponse<ApprovalHistory[]>>(
      `/api/v1/purchase-orders/${id}/history`,
    );
    return res.data.data;
  },

  exportPdf: async (id: number): Promise<Blob> => {
    const res = await apiClient.get(`/api/v1/purchase-orders/${id}/export`, {
      responseType: "blob",
    });
    return res.data as Blob;
  },
};
