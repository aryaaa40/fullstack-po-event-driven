"use client";

import { POCategory } from "@/types/po";

const CATEGORIES: { value: POCategory; label: string }[] = [
  { value: "IT", label: "IT" },
  { value: "OFFICE_SUPPLIES", label: "Office Supplies" },
  { value: "MARKETING", label: "Marketing" },
  { value: "OPERATIONS", label: "Operations" },
  { value: "HR", label: "Human Resources" },
  { value: "FINANCE", label: "Finance" },
  { value: "LOGISTICS", label: "Logistics" },
  { value: "OTHER", label: "Other" },
];

const PRIORITIES = [
  { value: "NORMAL", label: "Normal", activeColor: "#0053db" },
  { value: "URGENT", label: "Urgent", activeColor: "#b45309" },
  { value: "CRITICAL", label: "Critical", activeColor: "#9f403d" },
];

interface Props {
  form: {
    title: string;
    description: string;
    category: string;
    department: string;
    priority: string;
  };
  setField: (field: string, value: string) => void;
}

const inputBase: React.CSSProperties = {
  backgroundColor: "#f0f4f7",
  color: "#2a3439",
  border: "1px solid transparent",
};

function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.currentTarget.style.backgroundColor = "#ffffff";
  e.currentTarget.style.border = "1px solid rgba(0,83,219,0.2)";
}

function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.currentTarget.style.backgroundColor = "#f0f4f7";
  e.currentTarget.style.border = "1px solid transparent";
}

export default function POFormSectionBasic({ form, setField }: Props) {
  return (
    <div
      className="flex flex-col gap-5 rounded-2xl p-6"
      style={{ backgroundColor: "#ffffff", boxShadow: "0 4px 20px rgba(42,52,57,0.05)" }}
    >
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#0053db" }}>
        Basic Information
      </p>

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#566166" }}>
          PO Title <span style={{ color: "#9f403d" }}>*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setField("title", e.target.value)}
          placeholder="e.g. Office Equipment Q1 2025"
          className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
          style={inputBase}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#566166" }}>
          Description <span style={{ color: "#9f403d" }}>*</span>
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
          placeholder="Briefly explain the purpose of this purchase..."
          rows={3}
          className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all"
          style={inputBase}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>

      {/* Category + Department */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#566166" }}>
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => setField("category", e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
            style={inputBase}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            <option value="">Select category...</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#566166" }}>
            Department
          </label>
          <input
            type="text"
            value={form.department}
            onChange={(e) => setField("department", e.target.value)}
            placeholder="e.g. Engineering"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
            style={inputBase}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
      </div>

      {/* Priority */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#566166" }}>
          Priority
        </label>
        <div className="flex gap-3">
          {PRIORITIES.map((p) => {
            const isActive = form.priority === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => setField("priority", p.value)}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all"
                style={{
                  backgroundColor: isActive ? p.activeColor : "#f0f4f7",
                  color: isActive ? "#ffffff" : "#566166",
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
