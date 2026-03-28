"use client";

import { Clock } from "lucide-react";
import { usePOList } from "@/lib/hooks/usePOList";
import POTable from "@/app/(dashboard)/dashboard/_components/POTable";

const FONT_MANROPE = "var(--font-manrope), Manrope, sans-serif";

export default function PendingApprovalsContent() {
  const { pos, loading, error } = usePOList({ status: "PENDING" });

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: "#eef4ff" }}
            >
              <Clock size={18} style={{ color: "#0053db" }} />
            </div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}
            >
              Pending Approvals
            </h1>
          </div>
          <p className="mt-1.5 text-sm" style={{ color: "#566166" }}>
            Review purchase orders awaiting your decision.
          </p>
        </div>

        {/* Count badge */}
        {!loading && !error && (
          <div
            className="flex items-center gap-2 rounded-xl px-4 py-2.5"
            style={{ backgroundColor: "#eef4ff" }}
          >
            <span
              className="text-2xl font-bold"
              style={{ color: "#0053db", fontFamily: FONT_MANROPE }}
            >
              {pos.length}
            </span>
            <span className="text-xs font-medium leading-tight" style={{ color: "#0053db" }}>
              Awaiting
              <br />
              Review
            </span>
          </div>
        )}
      </div>

      {/* Info banner */}
      {!loading && !error && pos.length > 0 && (
        <div
          className="flex items-center gap-3 rounded-xl px-5 py-3.5"
          style={{ backgroundColor: "#eef4ff" }}
        >
          <Clock size={15} style={{ color: "#0053db" }} />
          <p className="text-sm" style={{ color: "#0053db" }}>
            <span className="font-semibold">{pos.length}</span> purchase order
            {pos.length !== 1 ? "s" : ""} need your approval. Click{" "}
            <span className="font-semibold">View</span> to review and take action.
          </p>
        </div>
      )}

      {/* Table */}
      <POTable pos={pos} loading={loading} error={error} title="Pending Approvals" />
    </div>
  );
}
