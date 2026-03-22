"use client";

import { useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { POCategory, POPriority } from "@/types/po";

const FONT_MANROPE = "var(--font-manrope), Manrope, sans-serif";

const CATEGORIES: { value: POCategory; label: string }[] = [
  { value: "IT", label: "IT" },
  { value: "OFFICE_SUPPLIES", label: "Office Supplies" },
  { value: "MARKETING", label: "Marketing" },
  { value: "OPERATIONS", label: "Operations" },
  { value: "HR", label: "HR" },
  { value: "FINANCE", label: "Finance" },
  { value: "LOGISTICS", label: "Logistics" },
  { value: "OTHER", label: "Other" },
];

const PRIORITIES: { value: POPriority; label: string; color: string }[] = [
  { value: "NORMAL", label: "Normal", color: "#566166" },
  { value: "URGENT", label: "Urgent", color: "#b45309" },
  { value: "CRITICAL", label: "Critical", color: "#9f403d" },
];

export interface POFilters {
  search: string;
  category: POCategory | "";
  priority: POPriority | "";
}

interface Props {
  filters: POFilters;
  onChange: (filters: POFilters) => void;
}

export default function POFilterBar({ filters, onChange }: Props) {
  // Local search state untuk debounce
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync jika filters.search di-reset dari luar
  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  function handleSearchChange(value: string) {
    setLocalSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange({ ...filters, search: value });
    }, 300);
  }

  function handleCategoryChange(value: POCategory | "") {
    onChange({ ...filters, category: value });
  }

  function handlePriorityChange(value: POPriority | "") {
    onChange({ ...filters, priority: value });
  }

  function clearAll() {
    setLocalSearch("");
    onChange({ search: "", category: "", priority: "" });
  }

  const hasActiveFilter =
    filters.search || filters.category || filters.priority;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search input */}
      <div className="relative flex-1" style={{ minWidth: "220px" }}>
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "#8fa3ae" }}
        />
        <input
          type="text"
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by title or vendor..."
          className="w-full rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none transition-colors"
          style={{
            backgroundColor: "#f0f4f7",
            color: "#2a3439",
            fontFamily: FONT_MANROPE,
            border: "none",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.backgroundColor = "#e8eff3")
          }
          onBlur={(e) =>
            (e.currentTarget.style.backgroundColor = "#f0f4f7")
          }
        />
        {localSearch && (
          <button
            onClick={() => handleSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "#8fa3ae" }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category dropdown */}
      <div className="relative">
        <SlidersHorizontal
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: filters.category ? "#0053db" : "#8fa3ae" }}
        />
        <select
          value={filters.category}
          onChange={(e) =>
            handleCategoryChange(e.target.value as POCategory | "")
          }
          className="appearance-none rounded-xl py-2.5 pl-8 pr-8 text-sm outline-none transition-colors"
          style={{
            backgroundColor: filters.category ? "#eef4ff" : "#f0f4f7",
            color: filters.category ? "#0053db" : "#566166",
            fontFamily: FONT_MANROPE,
            border: "none",
            cursor: "pointer",
          }}
        >
          <option value="">Category</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Priority dropdown */}
      <div className="relative">
        <select
          value={filters.priority}
          onChange={(e) =>
            handlePriorityChange(e.target.value as POPriority | "")
          }
          className="appearance-none rounded-xl py-2.5 px-4 text-sm outline-none transition-colors"
          style={{
            backgroundColor: filters.priority ? "#fff3cd" : "#f0f4f7",
            color: filters.priority
              ? (PRIORITIES.find((p) => p.value === filters.priority)?.color ??
                "#566166")
              : "#566166",
            fontFamily: FONT_MANROPE,
            border: "none",
            cursor: "pointer",
          }}
        >
          <option value="">Priority</option>
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear all button — hanya muncul jika ada filter aktif */}
      {hasActiveFilter && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-75"
          style={{
            backgroundColor: "#fff7f6",
            color: "#9f403d",
            fontFamily: FONT_MANROPE,
          }}
        >
          <X size={13} />
          Clear
        </button>
      )}
    </div>
  );
}
