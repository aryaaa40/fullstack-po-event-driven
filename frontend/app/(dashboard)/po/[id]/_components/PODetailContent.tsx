"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Download } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { usePODetail } from "@/lib/hooks/usePODetail";
import { poRepository } from "@/lib/repositories/poRepository";
import PODetailCard from "./PODetailCard";
import PODetailItemsTable from "./PODetailItemsTable";
import PODetailExtras from "./PODetailExtras";
import POActionButtons from "./POActionButtons";
import POTimeline from "./POTimeline";

const FONT_MANROPE = "var(--font-manrope), Manrope, sans-serif";

export default function PODetailContent({ id }: { id: number }) {
  const role = useAuthStore((s) => s.role);
  const { po, loading, error, refetch } = usePODetail(id);
  const [exporting, setExporting] = useState(false);

  async function handleExportPdf() {
    setExporting(true);
    try {
      const blob = await poRepository.exportPdf(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `PO-${String(id).padStart(5, "0")}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Back */}
      <Link
        href="/dashboard"
        className="flex w-fit items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
        style={{ color: "#566166" }}
      >
        <ChevronLeft size={16} />
        Back to Dashboard
      </Link>

      {/* Loading */}
      {loading && (
        <div
          className="flex h-48 items-center justify-center rounded-2xl text-sm"
          style={{ backgroundColor: "#ffffff", color: "#566166" }}
        >
          Loading purchase order...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          className="rounded-2xl px-6 py-5 text-sm"
          style={{
            backgroundColor: "#fff7f6",
            color: "#9f403d",
            border: "1px solid rgba(159,64,61,0.2)",
          }}
        >
          {error}
        </div>
      )}

      {/* Content */}
      {!loading && !error && po && (
        <div className="flex gap-5">
          {/* Left — stacked cards */}
          <div className="flex flex-1 flex-col gap-5">
            <PODetailCard po={po} />
            {po.items.length > 0 && (
              <PODetailItemsTable items={po.items} totalAmount={po.amount} />
            )}
            <PODetailExtras po={po} />
            <POTimeline poId={po.id} />
          </div>

          {/* Right — action panel */}
          <div className="flex w-72 shrink-0 flex-col gap-4">
            {role && (
              <POActionButtons po={po} role={role} onSuccess={refetch} />
            )}

            {/* Export PDF */}
            <button
              onClick={handleExportPdf}
              disabled={exporting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50 cursor-pointer"
              style={{
                backgroundColor: "#ffffff",
                color: "#2a3439",
                border: "1px solid #d9e4ea",
                boxShadow: "0 1px 2px rgba(42,52,57,0.04)",
                fontFamily: FONT_MANROPE,
              }}
            >
              <Download size={15} style={{ color: "#0053db" }} />
              {exporting ? "Generating..." : "Export PDF"}
            </button>

            {/* Status widget */}
            <div
              className="rounded-2xl p-6"
              style={{
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 20px rgba(42,52,57,0.05)",
              }}
            >
              <h2
                className="text-base font-bold"
                style={{
                  color: "#2a3439",
                  fontFamily: "var(--font-manrope), Manrope, sans-serif",
                }}
              >
                Status
              </h2>
              <p
                className="mt-2 text-xs leading-relaxed"
                style={{ color: "#566166" }}
              >
                This PO is currently{" "}
                <span className="font-semibold" style={{ color: "#2a3439" }}>
                  {po.status.replace(/_/g, " ")}
                </span>
                . Last updated on{" "}
                {new Date(po.updatedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                .
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
