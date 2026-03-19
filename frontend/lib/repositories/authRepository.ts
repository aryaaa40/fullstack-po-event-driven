import { apiClient } from "@/lib/api-client";
import { LoginRequest, LoginResponse } from "@/types/auth";

export const authRepository = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginResponse>("/api/v1/auth/login", data);
    return res.data;
  },
};
