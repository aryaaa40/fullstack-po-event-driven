"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { useBudgets } from "@/lib/hooks/useBudgets";
import { useDepartments } from "@/lib/hooks/useDepartments";
import { BudgetResponse, BudgetRequest } from "@/lib/repositories/budgetRepository";
import BudgetFormModal from "./BudgetFormModal";

const FONT_MANROPE = "var(--font-manrope), Manrope, sans-serif";
const CURRENT_YEAR = new Date().getFullYear();

function formatIDR(v: number) {
  return `Rp ${v.toLocaleString("id-ID")}`;
}

export default function BudgetsContent() {
  const { role } = useAuthStore();
  const router = useRouter();

  // Finance-only guard
  if (role && role !== "FINANCE") {
    router.replace("/dashboard");
    return null;
  }

  const [fiscalYear, setFiscalYear] = useState(CURRENT_YEAR);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<BudgetResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BudgetResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { budgets, loading, error, create, update, remove } = useBudgets(fiscalYear);
  const { departments } = useDepartments();

  async function handleSave(data: BudgetRequest) {
    if (editing) {
      await update(editing.id, data);
    } else {
      await create(data);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await remove(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1
            className="text-2xl font-bold leading-tight"
            style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}
          >
            Budget Management
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#566166" }}>
            Manage department budgets per fiscal year.
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#0053db", color: "#f8f7ff", fontFamily: FONT_MANROPE }}
        >
          <Plus size={15} />
          Add Budget
        </button>
      </div>

      {/* Fiscal year picker */}
      <div
        className="flex w-fit items-center gap-3 rounded-xl px-4 py-2.5"
        style={{ backgroundColor: "#ffffff", boxShadow: "0 4px 20px rgba(42,52,57,0.05)" }}
      >
        <button
          onClick={() => setFiscalYear((y) => y - 1)}
          className="transition-opacity hover:opacity-60"
          aria-label="Previous year"
        >
          <ChevronLeft size={16} style={{ color: "#566166" }} />
        </button>
        <span className="text-sm font-bold" style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}>
          FY {fiscalYear}
        </span>
        <button
          onClick={() => setFiscalYear((y) => y + 1)}
          className="transition-opacity hover:opacity-60"
          aria-label="Next year"
        >
          <ChevronRight size={16} style={{ color: "#566166" }} />
        </button>
      </div>

      {/* Table card */}
      <div
        className="rounded-2xl"
        style={{ backgroundColor: "#ffffff", boxShadow: "0 4px 20px rgba(42,52,57,0.05)" }}
      >
        {/* Table header */}
        <div
          className="grid items-center px-6 py-3 text-xs font-semibold tracking-wider"
          style={{
            color: "#566166",
            gridTemplateColumns: "1fr 80px 160px 160px 90px",
            borderBottom: "1px solid rgba(86,97,102,0.1)",
          }}
        >
          <span>DEPARTMENT</span>
          <span>YEAR</span>
          <span className="text-right">TOTAL BUDGET</span>
          <span className="text-right">CREATED BY</span>
          <span></span>
        </div>

        {/* Rows */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div
              className="h-6 w-6 animate-spin rounded-full border-2"
              style={{ borderColor: "#0053db", borderTopColor: "transparent" }}
            />
          </div>
        ) : error ? (
          <p className="px-6 py-8 text-sm" style={{ color: "#9f403d" }}>{error}</p>
        ) : budgets.length === 0 ? (
          <p className="px-6 py-8 text-sm" style={{ color: "#9ca3af" }}>
            No budgets found for FY {fiscalYear}. Click "Add Budget" to create one.
          </p>
        ) : (
          budgets.map((b) => (
            <div
              key={b.id}
              className="grid items-center px-6 py-4 text-sm transition-colors hover:bg-[#f8fafb]"
              style={{ gridTemplateColumns: "1fr 80px 160px 160px 90px", borderBottom: "1px solid rgba(86,97,102,0.06)" }}
            >
              <div>
                <p className="font-semibold" style={{ color: "#2a3439" }}>
                  {b.department.name}
                </p>
                <p className="text-xs" style={{ color: "#566166" }}>
                  {b.department.code}
                </p>
              </div>
              <span style={{ color: "#566166" }}>{b.fiscalYear}</span>
              <span className="text-right font-semibold" style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}>
                {formatIDR(b.totalAmount)}
              </span>
              <span className="text-right text-xs" style={{ color: "#566166" }}>
                {b.createdBy}
              </span>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => { setEditing(b); setShowModal(true); }}
                  className="rounded-lg p-1.5 transition-colors hover:bg-[#eef3ff]"
                  title="Edit"
                >
                  <Pencil size={14} style={{ color: "#0053db" }} />
                </button>
                <button
                  onClick={() => setDeleteTarget(b)}
                  className="rounded-lg p-1.5 transition-colors hover:bg-[#fff7f6]"
                  title="Delete"
                >
                  <Trash2 size={14} style={{ color: "#9f403d" }} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form modal */}
      {showModal && (
        <BudgetFormModal
          editing={editing}
          departments={departments}
          fiscalYear={fiscalYear}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(42,52,57,0.4)", backdropFilter: "blur(4px)" }}
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-8"
            style={{ backgroundColor: "#ffffff", boxShadow: "0 20px 40px rgba(42,52,57,0.12)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold" style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}>
              Delete Budget?
            </h2>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "#566166" }}>
              Budget for{" "}
              <span className="font-semibold" style={{ color: "#2a3439" }}>
                {deleteTarget.department.name}
              </span>{" "}
              (FY {deleteTarget.fiscalYear}) will be permanently deleted.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-opacity hover:opacity-70"
                style={{ backgroundColor: "#f0f4f7", color: "#566166", fontFamily: FONT_MANROPE }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: "#9f403d", color: "#ffffff", fontFamily: FONT_MANROPE }}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
