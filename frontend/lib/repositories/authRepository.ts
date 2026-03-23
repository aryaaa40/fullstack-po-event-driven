import { apiClient } from "@/lib/api-client";
import { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";

export const authRepository = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>("/api/v1/auth/login", data);
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>("/api/v1/auth/register", data);
    return res.data;
  },
};
