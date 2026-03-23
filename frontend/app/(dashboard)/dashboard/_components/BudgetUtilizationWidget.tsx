"use client";

import Link from "next/link";
import { BudgetUtilization } from "@/types/po";
import { Role } from "@/types/auth";

const FONT_MANROPE = "var(--font-manrope), Manrope, sans-serif";

function formatIDR(v: number) {
  return `Rp ${v.toLocaleString("id-ID")}`;
}

function UtilizationBar({ percent }: { percent: number | null }) {
  if (percent === null) return null;
  const clamped = Math.min(percent, 100);
  const barColor = percent >= 90 ? "#9f403d" : percent >= 70 ? "#b45309" : "#0053db";
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs" style={{ color: "#566166" }}>
        <span>Utilized</span>
        <span>{percent.toFixed(1)}%</span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: "#f0f4f7" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${clamped}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}

// Layout untuk Manager/Requester — card single dept
function SingleDeptView({ item }: { item: BudgetUtilization }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs">
          <span style={{ color: "#566166" }}>Total Budget</span>
          <span className="font-medium" style={{ color: "#2a3439" }}>
            {formatIDR(item.totalBudget)}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span style={{ color: "#566166" }}>Utilized</span>
          <span className="font-medium" style={{ color: "#2a3439" }}>
            {formatIDR(item.utilized)}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span style={{ color: "#566166" }}>Committed</span>
          <span className="font-medium" style={{ color: "#566166" }}>
            {formatIDR(item.committed)}
          </span>
        </div>
        <div className="my-0.5 h-px" style={{ backgroundColor: "rgba(86,97,102,0.12)" }} />
        <div className="flex justify-between text-xs">
          <span className="font-semibold" style={{ color: "#2a3439" }}>Available</span>
          <span
            className="font-bold"
            style={{ color: item.available <= 0 ? "#9f403d" : "#006d4a" }}
          >
            {formatIDR(item.available)}
          </span>
        </div>
      </div>
      <UtilizationBar percent={item.utilizationPercent} />
    </div>
  );
}

// Layout untuk Finance — tabel semua dept
function AllDeptsTable({ items }: { items: BudgetUtilization[] }) {
  if (items.length === 0) {
    return (
      <p className="text-xs" style={{ color: "#9ca3af" }}>
        No budget data for this fiscal year.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div
        className="grid text-xs font-semibold tracking-wider"
        style={{
          color: "#566166",
          gridTemplateColumns: "1fr 110px 70px",
        }}
      >
        <span>Department</span>
        <span className="text-right">Available</span>
        <span className="text-right">Used%</span>
      </div>
      <div className="h-px" style={{ backgroundColor: "rgba(86,97,102,0.12)" }} />

      {/* Rows */}
      {items.map((item) => {
        const pct = item.utilizationPercent;
        const pctColor =
          pct === null ? "#566166" : pct >= 90 ? "#9f403d" : pct >= 70 ? "#b45309" : "#006d4a";
        return (
          <div key={item.department.id} className="flex flex-col gap-1.5">
            <div
              className="grid items-center text-xs"
              style={{ gridTemplateColumns: "1fr 110px 70px" }}
            >
              <span className="font-medium truncate" style={{ color: "#2a3439" }}>
                {item.department.name}
              </span>
              <span
                className="text-right font-medium"
                style={{ color: item.available <= 0 ? "#9f403d" : "#006d4a" }}
              >
                {formatIDR(item.available)}
              </span>
              <span className="text-right font-semibold" style={{ color: pctColor }}>
                {pct !== null ? `${pct.toFixed(1)}%` : "—"}
              </span>
            </div>
            {/* Mini progress bar per row */}
            <div
              className="h-1 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: "#f0f4f7" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(pct ?? 0, 100)}%`,
                  backgroundColor: pctColor,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface Props {
  utilization: BudgetUtilization[];
  loading: boolean;
  role: Role;
  departmentId: number | null;
  fiscalYear: number;
}

export default function BudgetUtilizationWidget({
  utilization,
  loading,
  role,
  departmentId,
  fiscalYear,
}: Props) {
  const isFinance = role === "FINANCE";

  const myItem = isFinance
    ? null
    : utilization.find((u) => u.department.id === departmentId) ?? null;

  const title = isFinance
    ? `Budget Utilization — ${fiscalYear}`
    : `My Budget — ${fiscalYear}`;

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 20px rgba(42,52,57,0.05)",
      }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2
          className="text-base font-bold"
          style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}
        >
          {title}
        </h2>
        {isFinance && (
          <Link
            href="/budgets"
            className="text-xs font-semibold transition-opacity hover:opacity-70"
            style={{ color: "#0053db" }}
          >
            Manage →
          </Link>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <div
            className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: "#0053db", borderTopColor: "transparent" }}
          />
        </div>
      ) : isFinance ? (
        <AllDeptsTable items={utilization} />
      ) : myItem ? (
        <SingleDeptView item={myItem} />
      ) : (
        <p className="text-xs" style={{ color: "#9ca3af" }}>
          No budget set for your department in {fiscalYear}.
        </p>
      )}
    </div>
  );
}
