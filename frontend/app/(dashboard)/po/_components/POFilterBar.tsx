"use client";

import { useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal, X, ChevronDown, Check } from "lucide-react";
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

const PRIORITIES: { value: POPriority; label: string; color: string; activeBg: string }[] = [
  { value: "NORMAL", label: "Normal", color: "#566166", activeBg: "#e8eff3" },
  { value: "URGENT", label: "Urgent", color: "#b45309", activeBg: "#fff3cd" },
  { value: "CRITICAL", label: "Critical", color: "#9f403d", activeBg: "#fff7f6" },
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

function FilterDropdown({
  label,
  value,
  options,
  onChange,
  icon: Icon,
  isActive,
  activeColor = "#0053db",
  activeBg = "#eef4ff",
  defaultColor = "#566166",
  defaultBg = "#f0f4f7",
}: {
  label: string;
  value: string;
  options: { value: string; label: string; color?: string; activeBg?: string }[];
  onChange: (val: string) => void;
  icon?: React.ComponentType<any>;
  isActive: boolean;
  activeColor?: string;
  activeBg?: string;
  defaultColor?: string;
  defaultBg?: string;
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

  // Dynamic colors for priority styles
  const currentActiveColor = selectedOption?.color || activeColor;
  const currentActiveBg = selectedOption?.activeBg || activeBg;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-all duration-200"
        style={{
          backgroundColor: isActive ? currentActiveBg : defaultBg,
          color: isActive ? currentActiveColor : defaultColor,
          fontFamily: FONT_MANROPE,
        }}
      >
        {Icon && (
          <Icon
            size={14}
            strokeWidth={2.5}
            style={{ color: isActive ? currentActiveColor : "#8fa3ae" }}
          />
        )}
        <span className="font-semibold whitespace-nowrap">
          {selectedOption ? selectedOption.label : label}
        </span>
        <ChevronDown
          size={14}
          strokeWidth={2.5}
          style={{ opacity: 0.6 }}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 top-12 z-20 w-52 rounded-2xl py-2 shadow-[0_12px_40px_rgba(42,52,57,0.12)]"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid rgba(42,52,57,0.06)",
            transformOrigin: "top center",
          }}
        >
          <button
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[#f7f9fb]"
            style={{ color: value === "" ? "#0053db" : "#566166" }}
          >
            All {label}s
            {value === "" && <Check size={16} strokeWidth={3} style={{ color: "#0053db" }} />}
          </button>
          
          <div className="mx-4 my-1.5 h-px rounded-full" style={{ backgroundColor: "rgba(42,52,57,0.06)" }} />
          
          <div className="flex max-h-64 flex-col overflow-y-auto px-2">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-[#f7f9fb]"
                style={{
                  color: value === opt.value ? (opt.color || "#0053db") : "#2a3439",
                  backgroundColor: value === opt.value ? (opt.activeBg || "#eef4ff") : "transparent",
                }}
              >
                {opt.label}
                {value === opt.value && (
                  <Check
                    size={16}
                    strokeWidth={3}
                    style={{ color: opt.color || "#0053db" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
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
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: "#8fa3ae" }}
          strokeWidth={2.5}
        />
        <input
          type="text"
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by title or vendor..."
          className="w-full rounded-xl py-2.5 pl-10 pr-10 text-sm font-medium outline-none transition-colors placeholder:font-medium placeholder:text-[#9ca3af]"
          style={{
            backgroundColor: "#f0f4f7",
            color: "#2a3439",
            fontFamily: FONT_MANROPE,
            border: "none",
          }}
          onFocus={(e) => (e.currentTarget.style.backgroundColor = "#e8eff3")}
          onBlur={(e) => (e.currentTarget.style.backgroundColor = "#f0f4f7")}
        />
        {localSearch && (
          <button
            onClick={() => handleSearchChange("")}
            className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full transition-colors hover:bg-black/5"
            style={{ color: "#8fa3ae" }}
          >
            <X size={13} strokeWidth={3} />
          </button>
        )}
      </div>

      {/* Category Custom Dropdown */}
      <FilterDropdown
        label="Category"
        value={filters.category}
        options={CATEGORIES}
        onChange={(val) => handleCategoryChange(val as POCategory | "")}
        icon={SlidersHorizontal}
        isActive={!!filters.category}
        activeColor="#0053db"
        activeBg="#eef4ff"
      />

      {/* Priority Custom Dropdown */}
      <FilterDropdown
        label="Priority"
        value={filters.priority}
        options={PRIORITIES}
        onChange={(val) => handlePriorityChange(val as POPriority | "")}
        isActive={!!filters.priority}
      />

      {/* Clear all button — hanya muncul jika ada filter aktif */}
      {hasActiveFilter && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-all hover:bg-[#fff0ef] active:scale-95"
          style={{
            backgroundColor: "#fff7f6",
            color: "#9f403d",
            fontFamily: FONT_MANROPE,
          }}
        >
          <X size={14} strokeWidth={3} />
          Clear Filter
        </button>
      )}
    </div>
  );
}
