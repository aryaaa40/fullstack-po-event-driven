import { apiClient } from "@/lib/api-client";
import { PurchaseOrder, CreatePORequest, POStatus } from "@/types/po";
import { ApiResponse, PageResponse } from "@/types/common";

interface GetPOsParams {
  status?: POStatus;
  page?: number;
  size?: number;
}

export const poRepository = {
  getPOs: async (
    params: GetPOsParams = {},
  ): Promise<PageResponse<PurchaseOrder>> => {
    const { status, page = 0, size = 50 } = params;
    const query = new URLSearchParams({
      page: String(page),
      size: String(size),
    });
    if (status) query.set("status", status);
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
};
