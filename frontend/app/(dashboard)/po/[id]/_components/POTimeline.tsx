"use client";

import { CheckCircle, XCircle, BadgeCheck, Send } from "lucide-react";
import { usePOHistory } from "@/lib/hooks/usePOHistory";
import { POStatus } from "@/types/po";

// Status tonal colors sesuai DESIGN.md
const STATUS_COLOR: Record<POStatus, { bg: string; text: string; dot: string }> = {
  PENDING:          { bg: "#eef3ff", text: "#0053db", dot: "#0053db" },
  MANAGER_APPROVED: { bg: "#f3eeff", text: "#6750A4", dot: "#6750A4" },
  FINANCE_APPROVED: { bg: "#e6ffee", text: "#006d4a", dot: "#006d4a" },
  REJECTED:         { bg: "#fff7f6", text: "#9f403d", dot: "#9f403d" },
};

const STATUS_LABEL: Record<POStatus, string> = {
  PENDING:          "Pending",
  MANAGER_APPROVED: "Manager Approved",
  FINANCE_APPROVED: "Finance Approved",
  REJECTED:         "Rejected",
};

function StatusIcon({ status }: { status: POStatus }) {
  const size = 16;
  if (status === "FINANCE_APPROVED") return <BadgeCheck size={size} />;
  if (status === "REJECTED")         return <XCircle size={size} />;
  if (status === "MANAGER_APPROVED") return <CheckCircle size={size} />;
  return <Send size={size} />;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function POTimeline({ poId }: { poId: number }) {
  const { history, loading } = usePOHistory(poId);

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 20px rgba(42,52,57,0.05)",
      }}
    >
      <h2
        className="mb-5 text-base font-bold"
        style={{
          color: "#2a3439",
          fontFamily: "var(--font-manrope), Manrope, sans-serif",
        }}
      >
        Approval Timeline
        {history.length > 0 && (
          <span
            className="ml-2 text-xs font-normal"
            style={{ color: "#566166" }}
          >
            {history.length} event{history.length > 1 ? "s" : ""}
          </span>
        )}
      </h2>

      {loading && (
        <p className="text-sm" style={{ color: "#566166" }}>
          Loading history...
        </p>
      )}

      {!loading && history.length === 0 && (
        <p className="text-sm" style={{ color: "#566166" }}>
          No history yet.
        </p>
      )}

      {!loading && history.length > 0 && (
        <ol className="flex flex-col gap-0">
          {history.map((item, index) => {
            const colors = STATUS_COLOR[item.toStatus];
            const isLast = index === history.length - 1;

            return (
              <li key={item.id} className="flex gap-4">
                {/* Connector line + dot */}
                <div className="flex flex-col items-center">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: colors.bg, color: colors.dot }}
                  >
                    <StatusIcon status={item.toStatus} />
                  </div>
                  {!isLast && (
                    <div
                      className="w-px flex-1 my-1"
                      style={{ backgroundColor: "#d9e4ea", minHeight: "1.5rem" }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className={`flex flex-col gap-1 pb-5 ${isLast ? "pb-0" : ""}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#2a3439" }}
                    >
                      {item.actorUsername}
                    </span>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                      {STATUS_LABEL[item.toStatus]}
                    </span>
                  </div>

                  {item.notes && (
                    <p className="text-sm" style={{ color: "#566166" }}>
                      {item.notes}
                    </p>
                  )}

                  <p className="text-xs" style={{ color: "#8fa3ab" }}>
                    {formatDate(item.createdAt)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
