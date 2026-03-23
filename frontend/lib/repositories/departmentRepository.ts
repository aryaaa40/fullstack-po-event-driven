import { apiClient } from "@/lib/api-client";
import { Department } from "@/types/po";

export const departmentRepository = {
  getAll: async (): Promise<Department[]> => {
    const res = await apiClient.get<{ data: Department[] }>("/api/v1/departments");
    return res.data.data;
  },
};
