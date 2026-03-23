export interface Department {
  id: number;
  name: string;
  code: string;
  description: string | null;
  createdAt: string;
}

export type POCategory =
  | "IT"
  | "OFFICE_SUPPLIES"
  | "MARKETING"
  | "OPERATIONS"
  | "HR"
  | "FINANCE"
  | "LOGISTICS"
  | "OTHER";

export type POPriority = "NORMAL" | "URGENT" | "CRITICAL";

export type POStatus =
  | "PENDING"
  | "MANAGER_APPROVED"
  | "FINANCE_APPROVED"
  | "REJECTED";

export interface PurchaseOrderItem {
  id: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PurchaseOrder {
  id: number;
  title: string;
  description: string;
  amount: number;
  status: POStatus;
  createdByUsername: string;
  createdAt: string;
  updatedAt: string;
  // New fields
  category: POCategory | null;
  department: Department | null;
  priority: POPriority;
  justification: string | null;
  vendor: string | null;
  requiredDate: string | null;
  deliveryAddress: string | null;
  currency: string | null;
  budgetCode: string | null;
  paymentTerms: string | null;
  notes: string | null;
  items: PurchaseOrderItem[];
}

export interface ApprovalHistory {
  id: number;
  poId: number;
  poTitle: string;
  actorUsername: string;
  fromStatus: POStatus | null; // null = PO baru dibuat
  toStatus: POStatus;
  createdAt: string;
  notes: string | null;
}

export interface CreatePurchaseOrderItemRequest {
  itemName: string;
  quantity: number;
  unitPrice: number;
}

export interface BudgetUtilization {
  department: Department;
  fiscalYear: number;
  totalBudget: number;
  utilized: number;
  committed: number;
  available: number;
  utilizationPercent: number | null;
}

export interface CreatePORequest {
  title: string;
  description: string;
  amount?: number;
  category?: POCategory;
  departmentId: number;
  priority?: POPriority;
  justification?: string;
  vendor?: string;
  requiredDate?: string;
  deliveryAddress?: string;
  currency?: string;
  budgetCode?: string;
  paymentTerms?: string;
  notes?: string;
  items?: CreatePurchaseOrderItemRequest[];
}
