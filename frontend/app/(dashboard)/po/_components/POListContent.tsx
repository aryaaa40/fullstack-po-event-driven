"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { usePOList } from "@/lib/hooks/usePOList";
import { usePONotification } from "@/lib/hooks/usePONotification";
import { POStatus } from "@/types/po";
import POTable from "@/app/(dashboard)/dashboard/_components/POTable";

const FONT_MANROPE = "var(--font-manrope), Manrope, sans-serif";

const PAGE_CONFIG = {
  REQUESTER: {
    title: "My Purchase Orders",
    description: "Track all your submitted purchase requests.",
  },
  MANAGER: {
    title: "All Purchase Orders",
    description: "View all purchase orders across the organization.",
  },
  FINANCE: {
    title: "All Purchase Orders",
    description: "View all purchase orders across the organization.",
  },
} as const;

const STATUS_STYLE: Record<
  POStatus,
  { bg: string; activeBg: string; color: string; label: string }
> = {
  PENDING: {
    bg: "#eef4ff",
    activeBg: "#0053db",
    color: "#0053db",
    label: "Pending",
  },
  MANAGER_APPROVED: {
    bg: "#f3eeff",
    activeBg: "#6750A4",
    color: "#6750A4",
    label: "Manager Approved",
  },
  FINANCE_APPROVED: {
    bg: "#e6ffee",
    activeBg: "#006d4a",
    color: "#006d4a",
    label: "Approved",
  },
  REJECTED: {
    bg: "#fff7f6",
    activeBg: "#9f403d",
    color: "#9f403d",
    label: "Rejected",
  },
};

const STATUSES = [
  "PENDING",
  "MANAGER_APPROVED",
  "FINANCE_APPROVED",
  "REJECTED",
] as const;

export default function POListContent() {
  const role = useAuthStore((s) => s.role);
  const { pos, loading, error, refetch } = usePOList();
  const { notifications } = usePONotification();
  const [activeFilter, setActiveFilter] = useState<POStatus | null>(null);

  // Auto-refetch tabel saat ada event WebSocket masuk
  useEffect(() => {
    if (notifications.length > 0) {
      refetch();
    }
  }, [notifications.length, refetch]);

  const config = role ? PAGE_CONFIG[role] : PAGE_CONFIG.REQUESTER;

  const filteredPos = activeFilter
    ? pos.filter((p) => p.status === activeFilter)
    : pos;

  function toggleFilter(status: POStatus) {
    setActiveFilter((prev) => (prev === status ? null : status));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: "#f0f4f7" }}
            >
              <FileText size={18} style={{ color: "#0053db" }} />
            </div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}
            >
              {config.title}
            </h1>
          </div>
          <p className="mt-1.5 text-sm" style={{ color: "#566166" }}>
            {config.description}
          </p>
        </div>

        {role === "REQUESTER" && (
          <Link
            href="/po/new"
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "#0053db",
              color: "#f8f7ff",
              fontFamily: FONT_MANROPE,
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            New PO
          </Link>
        )}
      </div>

      {/* Filter chips */}
      {!loading && !error && (
        <div className="flex flex-wrap gap-2.5">
          {/* All chip */}
          <button
            onClick={() => setActiveFilter(null)}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
            style={{
              backgroundColor: activeFilter === null ? "#2a3439" : "#f0f4f7",
              color: activeFilter === null ? "#ffffff" : "#566166",
              fontFamily: FONT_MANROPE,
            }}
          >
            <span
              className="flex h-5 w-5 items-center justify-center rounded-md text-xs font-bold"
              style={{
                backgroundColor:
                  activeFilter === null ? "rgba(255,255,255,0.2)" : "#d9e4ea",
                color: activeFilter === null ? "#ffffff" : "#2a3439",
              }}
            >
              {pos.length}
            </span>
            All
          </button>

          {/* Status chips */}
          {STATUSES.map((status) => {
            const count = pos.filter((p) => p.status === status).length;
            const s = STATUS_STYLE[status];
            const isActive = activeFilter === status;
            return (
              <button
                key={status}
                onClick={() => toggleFilter(status)}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
                style={{
                  backgroundColor: isActive ? s.activeBg : s.bg,
                  color: isActive ? "#ffffff" : s.color,
                  fontFamily: FONT_MANROPE,
                  opacity: count === 0 ? 0.45 : 1,
                  cursor: count === 0 ? "default" : "pointer",
                }}
                disabled={count === 0}
              >
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-md text-xs font-bold"
                  style={{
                    backgroundColor: isActive
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(0,0,0,0.08)",
                    color: isActive ? "#ffffff" : s.color,
                  }}
                >
                  {count}
                </span>
                {s.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Table */}
      <POTable
        pos={filteredPos}
        loading={loading}
        error={error}
        title={
          activeFilter
            ? `${STATUS_STYLE[activeFilter].label} — ${filteredPos.length} order${filteredPos.length !== 1 ? "s" : ""}`
            : config.title
        }
      />
    </div>
  );
}
