import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/common";

export interface NotificationResponse {
  id: string;
  poId: number;
  newStatus: string;
  actorUsername: string;
  requesterUsername: string;
  timestamp: string;
  read: boolean;
}

export const notificationRepository = {
  getMyNotifications: async (): Promise<NotificationResponse[]> => {
    const res = await apiClient.get<ApiResponse<NotificationResponse[]>>(
      "/api/v1/notifications",
    );
    return res.data.data;
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch("/api/v1/notifications/read-all");
  },
};
