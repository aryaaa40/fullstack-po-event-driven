export type Role = "REQUESTER" | "MANAGER" | "FINANCE";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: Role;
  departmentId: number | null;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: number;
    username: string;
    email: string;
    role: Role;
    departmentId: number | null;
    departmentName: string | null;
  };
}

// Alias untuk backward compatibility
export type LoginResponse = AuthResponse;
