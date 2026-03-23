"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Department } from "@/types/po";
import { BudgetResponse, BudgetRequest } from "@/lib/repositories/budgetRepository";

const FONT_MANROPE = "var(--font-manrope), Manrope, sans-serif";

interface Props {
  editing: BudgetResponse | null;
  departments: Department[];
  fiscalYear: number;
  onSave: (data: BudgetRequest) => Promise<void>;
  onClose: () => void;
}

export default function BudgetFormModal({
  editing,
  departments,
  fiscalYear,
  onSave,
  onClose,
}: Props) {
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [year, setYear] = useState(fiscalYear);
  const [totalAmount, setTotalAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editing) {
      setDepartmentId(editing.department.id);
      setYear(editing.fiscalYear);
      setTotalAmount(String(editing.totalAmount));
    } else {
      setDepartmentId("");
      setYear(fiscalYear);
      setTotalAmount("");
    }
    setError(null);
  }, [editing, fiscalYear]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (departmentId === "" || !totalAmount) {
      setError("All fields are required.");
      return;
    }
    const amount = Number(totalAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Total amount must be a positive number.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({ departmentId: Number(departmentId), fiscalYear: year, totalAmount: amount });
      onClose();
    } catch {
      setError("Failed to save budget. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    borderRadius: 12,
    padding: "10px 14px",
    fontSize: 14,
    color: "#2a3439",
    backgroundColor: "#f0f4f7",
    border: "none",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: "#566166",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    display: "block",
    marginBottom: 6,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(42,52,57,0.4)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-8"
        style={{ backgroundColor: "#ffffff", boxShadow: "0 20px 40px rgba(42,52,57,0.12)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 transition-opacity hover:opacity-60"
        >
          <X size={18} style={{ color: "#566166" }} />
        </button>

        <h2
          className="mb-6 text-xl font-bold"
          style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}
        >
          {editing ? "Edit Budget" : "Add Budget"}
        </h2>

        {error && (
          <div
            className="mb-4 rounded-xl px-4 py-3 text-sm"
            style={{ backgroundColor: "#fff7f6", color: "#9f403d", border: "1px solid rgba(159,64,61,0.2)" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Department */}
          <div>
            <label style={labelStyle}>Department</label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value === "" ? "" : Number(e.target.value))}
              style={inputStyle}
              disabled={!!editing}
            >
              <option value="">Select department...</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          {/* Fiscal Year */}
          <div>
            <label style={labelStyle}>Fiscal Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              min={2020}
              max={2099}
              style={inputStyle}
              disabled={!!editing}
            />
          </div>

          {/* Total Amount */}
          <div>
            <label style={labelStyle}>Total Amount (IDR)</label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="e.g. 50000000"
              min={1}
              style={inputStyle}
            />
          </div>

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ backgroundColor: "#f0f4f7", color: "#566166", fontFamily: FONT_MANROPE }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: "#0053db", color: "#f8f7ff", fontFamily: FONT_MANROPE }}
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {editing ? "Save Changes" : "Add Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
