export type Role = "REQUESTER" | "MANAGER" | "FINANCE";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: number;
    username: string;
    email: string;
    role: Role;
  };
}
