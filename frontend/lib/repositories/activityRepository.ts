import { apiClient } from "@/lib/api-client";
import { ApprovalHistory } from "@/types/po";
import { ApiResponse } from "@/types/common";

export const activityRepository = {
  getRecentActivity: async (): Promise<ApprovalHistory[]> => {
    const res = await apiClient.get<ApiResponse<ApprovalHistory[]>>(
      "/api/v1/activity/recent",
    );
    return res.data.data;
  },
};
