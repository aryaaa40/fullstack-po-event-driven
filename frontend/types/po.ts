export type POStatus =
  | "PENDING"
  | "MANAGER_APPROVED"
  | "FINANCE_APPROVED"
  | "REJECTED";

export interface PurchaseOrder {
  id: number;
  title: string;
  description: string;
  amount: number;
  status: POStatus;
  createdByUsername: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePORequest {
  title: string;
  description: string;
  amount: number;
}
