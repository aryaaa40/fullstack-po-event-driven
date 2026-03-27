"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, ChevronDown, Check } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
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
    priority: string;
  };
  setField: (field: string, value: string) => void;
}

const inputBase: React.CSSProperties = {
  backgroundColor: "#f0f4f7",
  color: "#2a3439",
  border: "1px solid transparent",
};

function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.backgroundColor = "#ffffff";
  e.currentTarget.style.border = "1px solid rgba(0,83,219,0.2)";
}

function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.backgroundColor = "#f0f4f7";
  e.currentTarget.style.border = "1px solid transparent";
}

function FormDropdown({
  value,
  options,
  onChange,
  placeholder,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition-all duration-200"
        style={{
          backgroundColor: open ? "#ffffff" : "#f0f4f7",
          border: open ? "1px solid rgba(0,83,219,0.2)" : "1px solid transparent",
          color: selectedOption ? "#2a3439" : "#566166",
        }}
      >
        <span className="font-medium">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={2.5}
          style={{ color: "#566166", opacity: 0.7 }}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+8px)] z-20 w-full rounded-2xl py-2 shadow-[0_12px_40px_rgba(42,52,57,0.12)]"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid rgba(42,52,57,0.06)",
            transformOrigin: "top center",
          }}
        >
          <div className="flex max-h-60 flex-col overflow-y-auto px-2">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-[#f7f9fb]"
                style={{
                  color: value === opt.value ? "#0053db" : "#2a3439",
                  backgroundColor: value === opt.value ? "#eef4ff" : "transparent",
                }}
              >
                {opt.label}
                {value === opt.value && <Check size={16} strokeWidth={3} style={{ color: "#0053db" }} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function POFormSectionBasic({ form, setField }: Props) {
  const { departmentName } = useAuthStore();

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
            Category <span style={{ color: "#9f403d" }}>*</span>
          </label>
          <FormDropdown
            value={form.category}
            options={CATEGORIES}
            onChange={(val) => setField("category", val)}
            placeholder="Select category..."
          />
        </div>

        {/* Department — read-only, auto dari user yang login */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#566166" }}>
            Department
          </label>
          <div
            className="flex items-center gap-2 rounded-xl px-4 py-3"
            style={{ backgroundColor: "#f0f4f7" }}
          >
            <Building2 size={14} style={{ color: "#566166", flexShrink: 0 }} />
            <span className="text-sm" style={{ color: departmentName ? "#2a3439" : "#9ca3af" }}>
              {departmentName ?? "No department assigned"}
            </span>
          </div>
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
