"use client";

import Link from "next/link";
import { TrendingDown } from "lucide-react";
import { BudgetUtilization } from "@/types/po";
import { Role } from "@/types/auth";

const FONT_MANROPE = "var(--font-manrope), Manrope, sans-serif";

function formatIDR(v: number) {
  return `Rp ${v.toLocaleString("id-ID")}`;
}

function formatIDRShort(v: number) {
  if (v >= 1_000_000_000) return `Rp ${(v / 1_000_000_000).toFixed(1)}M`;
  if (v >= 1_000_000) return `Rp ${(v / 1_000_000).toFixed(1)}jt`;
  if (v >= 1_000) return `Rp ${(v / 1_000).toFixed(0)}rb`;
  return `Rp ${v}`;
}

function computeWeeklyBurnRate(utilized: number): number {
  const dayOfMonth = new Date().getDate();
  const weeksElapsed = dayOfMonth / 7;
  return weeksElapsed > 0 ? Math.round(utilized / weeksElapsed) : 0;
}

function computeDepletionDate(available: number, weeklyBurnRate: number): string {
  if (weeklyBurnRate <= 0 || available <= 0) return "—";
  const daysToDepletion = (available / weeklyBurnRate) * 7;
  const d = new Date();
  d.setDate(d.getDate() + Math.round(daysToDepletion));
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Single Dept View (REQUESTER / MANAGER) ───────────────────────────────────

function SingleDeptView({ item }: { item: BudgetUtilization }) {
  const total = item.totalBudget;
  const utilizedPct = total > 0 ? Math.round((item.utilized / total) * 100) : 0;
  const committedPct = total > 0 ? Math.round((item.committed / total) * 100) : 0;
  const availablePct = total > 0 ? Math.round((item.available / total) * 100) : 0;
  const totalUsagePct = item.utilizationPercent ?? 0;

  const barUtilized = Math.min(utilizedPct, 100);
  const barCommitted = Math.min(committedPct, 100 - barUtilized);
  const barAvailable = Math.max(0, 100 - barUtilized - barCommitted);

  const weeklyBurnRate = computeWeeklyBurnRate(item.utilized);
  const depletionDate = computeDepletionDate(item.available, weeklyBurnRate);

  return (
    <div className="flex gap-6">
      {/* ── Left: Total Budget + Breakdown ─────────────────────────────── */}
      <div
        className="flex flex-col gap-5 rounded-xl px-5 py-4"
        style={{ backgroundColor: "#f0f4f7", minWidth: 200 }}
      >
        {/* Total Budget */}
        <div>
          <p
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: "#566166" }}
          >
            Total Budget
          </p>
          <p
            className="mt-1 text-2xl font-bold"
            style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}
          >
            {formatIDR(total)}
          </p>
        </div>

        {/* Utilized */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p
              className="text-xs tracking-widest uppercase"
              style={{ color: "#566166" }}
            >
              Utilized
            </p>
            <p className="mt-0.5 text-sm font-semibold" style={{ color: "#2a3439" }}>
              {formatIDR(item.utilized)}
            </p>
          </div>
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-bold"
            style={{ backgroundColor: "#eef2ff", color: "#0053db" }}
          >
            {utilizedPct}%
          </span>
        </div>

        {/* Committed */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p
              className="text-xs tracking-widest uppercase"
              style={{ color: "#566166" }}
            >
              Committed
            </p>
            <p className="mt-0.5 text-sm font-semibold" style={{ color: "#2a3439" }}>
              {formatIDR(item.committed)}
            </p>
          </div>
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-bold"
            style={{ backgroundColor: "#f3eeff", color: "#6750A4" }}
          >
            {committedPct}%
          </span>
        </div>

        {/* Divider */}
        <div className="h-px" style={{ backgroundColor: "rgba(86,97,102,0.12)" }} />

        {/* Available */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p
              className="text-xs tracking-widest uppercase font-semibold"
              style={{ color: item.available <= 0 ? "#9f403d" : "#006d4a" }}
            >
              Available
            </p>
            <p
              className="mt-0.5 text-sm font-bold"
              style={{ color: item.available <= 0 ? "#9f403d" : "#006d4a" }}
            >
              {formatIDR(item.available)}
            </p>
          </div>
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-bold"
            style={{ backgroundColor: "#e6ffee", color: "#006d4a" }}
          >
            {availablePct}%
          </span>
        </div>
      </div>

      {/* ── Right: Budget Composition ───────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p
            className="text-base font-bold"
            style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}
          >
            Budget Composition
          </p>
          <span
            className="rounded-full px-3 py-1 text-xs font-bold"
            style={{ backgroundColor: "#eef2ff", color: "#0053db" }}
          >
            {totalUsagePct.toFixed(0)}% Total Usage
          </span>
        </div>

        {/* Segmented bar */}
        <div>
          <div className="flex h-3 w-full overflow-hidden rounded-full">
            <div
              style={{ width: `${barUtilized}%`, backgroundColor: "#0053db" }}
            />
            <div
              style={{ width: `${barCommitted}%`, backgroundColor: "#aec6ff" }}
            />
            <div
              style={{ width: `${barAvailable}%`, backgroundColor: "#d9e4ea" }}
            />
          </div>
          {/* Legend */}
          <div className="mt-2.5 flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{ backgroundColor: "#0053db" }}
              />
              <span className="text-xs" style={{ color: "#566166" }}>
                Current Spend
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{ backgroundColor: "#aec6ff" }}
              />
              <span className="text-xs" style={{ color: "#566166" }}>
                Pending Approval
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{ backgroundColor: "#d9e4ea" }}
              />
              <span className="text-xs" style={{ color: "#566166" }}>
                Available Liquid
              </span>
            </div>
          </div>
        </div>

        {/* Burn Rate + Forecast */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {/* Burn Rate */}
          <div
            className="rounded-xl px-4 py-3"
            style={{ backgroundColor: "#f0f4f7" }}
          >
            <p
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "#566166" }}
            >
              Burn Rate
            </p>
            <p
              className="mt-1 text-lg font-bold"
              style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}
            >
              {formatIDRShort(weeklyBurnRate)} / week
            </p>
            <div className="mt-1 flex items-center gap-1">
              <TrendingDown size={11} style={{ color: "#006d4a" }} />
              <span className="text-xs font-medium" style={{ color: "#006d4a" }}>
                Current Month
              </span>
            </div>
          </div>

          {/* Forecast */}
          <div
            className="rounded-xl px-4 py-3"
            style={{ backgroundColor: "#f0f4f7" }}
          >
            <p
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "#566166" }}
            >
              Forecast
            </p>
            <p
              className="mt-1 text-lg font-bold"
              style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}
            >
              {depletionDate}
            </p>
            <p className="mt-1 text-xs" style={{ color: "#566166" }}>
              Est. Depletion Date
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── All Depts View (FINANCE) ─────────────────────────────────────────────────

function AllDeptsView({ items }: { items: BudgetUtilization[] }) {
  if (items.length === 0) {
    return (
      <p className="text-xs" style={{ color: "#9ca3af" }}>
        No budget data for this fiscal year.
      </p>
    );
  }

  // Summary totals
  const totalBudget = items.reduce((s, i) => s + i.totalBudget, 0);
  const totalUtilized = items.reduce((s, i) => s + i.utilized, 0);
  const totalCommitted = items.reduce((s, i) => s + i.committed, 0);
  const totalAvailable = items.reduce((s, i) => s + i.available, 0);
  const overallUsagePct =
    totalBudget > 0 ? Math.round((totalUtilized / totalBudget) * 100) : 0;
  const utilizedPct = totalBudget > 0 ? Math.round((totalUtilized / totalBudget) * 100) : 0;
  const committedPct = totalBudget > 0 ? Math.round((totalCommitted / totalBudget) * 100) : 0;
  const availablePct = totalBudget > 0 ? Math.round((totalAvailable / totalBudget) * 100) : 0;

  const barUtilized = Math.min(utilizedPct, 100);
  const barCommitted = Math.min(committedPct, 100 - barUtilized);
  const barAvailable = Math.max(0, 100 - barUtilized - barCommitted);

  const weeklyBurnRate = computeWeeklyBurnRate(totalUtilized);
  const depletionDate = computeDepletionDate(totalAvailable, weeklyBurnRate);

  return (
    <div className="flex flex-col gap-5">
      {/* ── Top: Summary row ─────────────────────────────────────────────── */}
      <div className="flex gap-5">
        {/* Total budget summary card */}
        <div
          className="flex flex-col gap-4 rounded-xl px-5 py-4"
          style={{ backgroundColor: "#f0f4f7", minWidth: 200 }}
        >
          <div>
            <p
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "#566166" }}
            >
              Total Budget
            </p>
            <p
              className="mt-1 text-2xl font-bold"
              style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}
            >
              {formatIDR(totalBudget)}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest" style={{ color: "#566166" }}>
                Utilized
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-xs font-bold"
                style={{ backgroundColor: "#eef2ff", color: "#0053db" }}
              >
                {utilizedPct}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest" style={{ color: "#566166" }}>
                Committed
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-xs font-bold"
                style={{ backgroundColor: "#f3eeff", color: "#6750A4" }}
              >
                {committedPct}%
              </span>
            </div>
            <div className="h-px" style={{ backgroundColor: "rgba(86,97,102,0.12)" }} />
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#006d4a" }}
              >
                Available
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-xs font-bold"
                style={{ backgroundColor: "#e6ffee", color: "#006d4a" }}
              >
                {availablePct}%
              </span>
            </div>
          </div>
        </div>

        {/* Budget Composition + mini cards */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center justify-between">
            <p
              className="text-base font-bold"
              style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}
            >
              Budget Composition
            </p>
            <span
              className="rounded-full px-3 py-1 text-xs font-bold"
              style={{ backgroundColor: "#eef2ff", color: "#0053db" }}
            >
              {overallUsagePct}% Total Usage
            </span>
          </div>

          <div>
            <div className="flex h-3 w-full overflow-hidden rounded-full">
              <div style={{ width: `${barUtilized}%`, backgroundColor: "#0053db" }} />
              <div style={{ width: `${barCommitted}%`, backgroundColor: "#aec6ff" }} />
              <div style={{ width: `${barAvailable}%`, backgroundColor: "#d9e4ea" }} />
            </div>
            <div className="mt-2.5 flex items-center gap-5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#0053db" }} />
                <span className="text-xs" style={{ color: "#566166" }}>Current Spend</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#aec6ff" }} />
                <span className="text-xs" style={{ color: "#566166" }}>Pending Approval</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#d9e4ea" }} />
                <span className="text-xs" style={{ color: "#566166" }}>Available Liquid</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl px-4 py-3" style={{ backgroundColor: "#f0f4f7" }}>
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#566166" }}>
                Burn Rate
              </p>
              <p
                className="mt-1 text-lg font-bold"
                style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}
              >
                {formatIDRShort(weeklyBurnRate)} / week
              </p>
              <div className="mt-1 flex items-center gap-1">
                <TrendingDown size={11} style={{ color: "#006d4a" }} />
                <span className="text-xs font-medium" style={{ color: "#006d4a" }}>
                  All Departments
                </span>
              </div>
            </div>
            <div className="rounded-xl px-4 py-3" style={{ backgroundColor: "#f0f4f7" }}>
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#566166" }}>
                Forecast
              </p>
              <p
                className="mt-1 text-lg font-bold"
                style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}
              >
                {depletionDate}
              </p>
              <p className="mt-1 text-xs" style={{ color: "#566166" }}>Est. Depletion Date</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Department Table ──────────────────────────────────────────────── */}
      <div>
        {/* Table header */}
        <div
          className="grid text-xs font-semibold tracking-wider mb-2"
          style={{
            color: "#566166",
            gridTemplateColumns: "1fr 130px 130px 70px",
          }}
        >
          <span>Department</span>
          <span className="text-right">Utilized</span>
          <span className="text-right">Available</span>
          <span className="text-right">Used%</span>
        </div>

        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const pct = item.utilizationPercent;
            const pctColor =
              pct === null ? "#566166" : pct >= 90 ? "#9f403d" : pct >= 70 ? "#b45309" : "#006d4a";
            const barColor = pctColor;
            const clamped = Math.min(pct ?? 0, 100);

            return (
              <div key={item.department.id} className="flex flex-col gap-1">
                <div
                  className="grid items-center text-xs"
                  style={{ gridTemplateColumns: "1fr 130px 130px 70px" }}
                >
                  <span
                    className="truncate font-medium"
                    style={{ color: "#2a3439" }}
                  >
                    {item.department.name}
                  </span>
                  <span className="text-right font-medium" style={{ color: "#2a3439" }}>
                    {formatIDR(item.utilized)}
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
                <div
                  className="h-1 w-full overflow-hidden rounded-full"
                  style={{ backgroundColor: "#f0f4f7" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${clamped}%`, backgroundColor: barColor }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

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
    : (utilization.find((u) => u.department.id === departmentId) ?? null);

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
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2
            className="text-base font-bold"
            style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}
          >
            {title}
          </h2>
          <p className="mt-1 text-xs" style={{ color: "#566166" }}>
            {isFinance
              ? "Organization-wide fiscal budget utilization limits."
              : "Overview of your department's fiscal budget utilization limits."}
          </p>
        </div>
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
        <div className="flex items-center justify-center py-8">
          <div
            className="h-5 w-5 animate-spin rounded-full border-2"
            style={{ borderColor: "#0053db", borderTopColor: "transparent" }}
          />
        </div>
      ) : isFinance ? (
        <AllDeptsView items={utilization} />
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
