"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { poRepository } from "@/lib/repositories/poRepository";
import { PurchaseOrder, POStatus } from "@/types/po";
import { Role } from "@/types/auth";

interface Props {
  po: PurchaseOrder;
  role: Role;
  onSuccess: () => void;
}

function canAct(role: Role, status: POStatus): boolean {
  if (role === "MANAGER" && status === "PENDING") return true;
  if (role === "FINANCE" && status === "MANAGER_APPROVED") return true;
  return false;
}

async function runAction(role: Role, id: number, action: "approve" | "reject") {
  if (role === "MANAGER") {
    return action === "approve"
      ? poRepository.approve(id)
      : poRepository.reject(id);
  }
  return action === "approve"
    ? poRepository.financeApprove(id)
    : poRepository.financeReject(id);
}

export default function POActionButtons({ po, role, onSuccess }: Props) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!canAct(role, po.status)) return null;

  async function handleAction(action: "approve" | "reject") {
    setError(null);
    setLoading(action);
    try {
      const result = await runAction(role, po.id, action);
      const now = new Date();
      const label = action === "approve"
        ? (role === "MANAGER" ? "Approved" : "Final Approved")
        : (role === "MANAGER" ? "Rejected" : "Final Rejected");
      toast.success(`PO #${String(result.id).padStart(3, "0")} — ${label}`, {
        description: now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        duration: 4000,
      });
      onSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setLoading(null);
    }
  }

  const approveLabel = role === "MANAGER" ? "Approve" : "Final Approve";
  const rejectLabel  = role === "MANAGER" ? "Reject"  : "Final Reject";

  return (
    <div
      className="flex flex-col gap-4 rounded-2xl p-6"
      style={{ backgroundColor: "#ffffff", boxShadow: "0 4px 20px rgba(42,52,57,0.05)" }}
    >
      <div>
        <h2
          className="text-base font-bold"
          style={{
            color: "#2a3439",
            fontFamily: "var(--font-manrope), Manrope, sans-serif",
          }}
        >
          Action Required
        </h2>
        <p className="mt-0.5 text-xs" style={{ color: "#566166" }}>
          {role === "MANAGER"
            ? "Review this purchase order and approve or reject it."
            : "Perform the final approval decision on this purchase order."}
        </p>
      </div>

      {error && (
        <p
          className="rounded-lg px-3 py-2 text-xs"
          style={{
            backgroundColor: "#fff7f6",
            color: "#9f403d",
            border: "1px solid rgba(159,64,61,0.2)",
          }}
        >
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <button
          onClick={() => handleAction("approve")}
          disabled={loading !== null}
          className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-opacity disabled:opacity-60"
          style={{ backgroundColor: "#006d4a", color: "#e6ffee" }}
        >
          {loading === "approve" ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <CheckCircle2 size={15} />
          )}
          {approveLabel}
        </button>

        <button
          onClick={() => handleAction("reject")}
          disabled={loading !== null}
          className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-opacity disabled:opacity-60"
          style={{ backgroundColor: "#fff7f6", color: "#9f403d" }}
        >
          {loading === "reject" ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <XCircle size={15} />
          )}
          {rejectLabel}
        </button>
      </div>
    </div>
  );
}
