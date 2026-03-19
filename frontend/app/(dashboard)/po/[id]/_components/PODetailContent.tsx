"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { usePODetail } from "@/lib/hooks/usePODetail";
import PODetailCard from "./PODetailCard";
import POActionButtons from "./POActionButtons";

export default function PODetailContent({ id }: { id: number }) {
  const role = useAuthStore((s) => s.role);
  const { po, loading, error, refetch } = usePODetail(id);

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
          {/* Left — detail card (grows) */}
          <div className="flex-1">
            <PODetailCard po={po} />
          </div>

          {/* Right — action panel (fixed width) */}
          <div className="flex w-72 shrink-0 flex-col gap-4">
            {role && (
              <POActionButtons po={po} role={role} onSuccess={refetch} />
            )}

            {/* Status history placeholder */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: "#ffffff", boxShadow: "0 4px 20px rgba(42,52,57,0.05)" }}
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
              <p className="mt-2 text-xs leading-relaxed" style={{ color: "#566166" }}>
                This PO is currently{" "}
                <span className="font-semibold" style={{ color: "#2a3439" }}>
                  {po.status.replace(/_/g, " ")}
                </span>
                . Last updated on{" "}
                {new Date(po.updatedAt).toLocaleDateString("id-ID", {
                  day: "numeric", month: "long", year: "numeric",
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
