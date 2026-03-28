"use client";

import Link from "next/link";
import { ApprovalHistory, POStatus } from "@/types/po";

interface Props {
  activities: ApprovalHistory[];
  loading: boolean;
}

const STATUS_DOT: Record<POStatus, string> = {
  PENDING:          "#0053db",
  MANAGER_APPROVED: "#6750A4",
  FINANCE_APPROVED: "#006d4a",
  REJECTED:         "#9f403d",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RecentActivity({ activities, loading }: Props) {
  const DISPLAY_LIMIT = 5;
  const displayedActivities = activities.slice(0, DISPLAY_LIMIT);
  const hasMore = activities.length > DISPLAY_LIMIT;

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 20px rgba(42,52,57,0.05)",
      }}
    >
      <div className="mb-5">
        <h2
          className="text-base font-bold"
          style={{
            color: "#2a3439",
            fontFamily: "var(--font-manrope), Manrope, sans-serif",
          }}
        >
          Recent Activity
        </h2>
        <p className="mt-1 text-xs" style={{ color: "#566166" }}>
          Track the latest status updates and approvals for your purchase orders.
        </p>
      </div>

      {loading && (
        <p className="text-sm" style={{ color: "#566166" }}>
          Loading...
        </p>
      )}

      {!loading && activities.length === 0 && (
        <p className="text-sm" style={{ color: "#566166" }}>
          No recent activity.
        </p>
      )}

      {!loading && displayedActivities.length > 0 && (
        <div className="flex flex-col">
          <ul className="flex flex-col">
            {displayedActivities.map((item, index) => {
              const dotColor = STATUS_DOT[item.toStatus];
              const isLast = index === displayedActivities.length - 1;

            return (
              <li
                key={item.id}
                className="flex items-start gap-3 py-3"
                style={
                  !isLast
                    ? { borderBottom: "1px solid rgba(217,228,234,0.5)" }
                    : undefined
                }
              >
                {/* Status dot */}
                <div
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: dotColor }}
                />

                {/* Content */}
                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                  <Link
                    href={`/po/${item.poId}`}
                    className="truncate text-sm font-medium transition-opacity hover:opacity-70"
                    style={{ color: "#2a3439" }}
                  >
                    {item.poTitle}
                  </Link>
                  <p className="text-xs" style={{ color: "#566166" }}>
                    {item.notes ?? item.toStatus.replace(/_/g, " ")}
                  </p>
                </div>

                {/* Right meta */}
                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <p className="text-xs font-medium" style={{ color: "#566166" }}>
                    {item.actorUsername}
                  </p>
                  <p className="text-xs" style={{ color: "#8fa3ab" }}>
                    {formatDate(item.createdAt)}
                  </p>
                </div>
              </li>
            );
            })}
          </ul>
          {hasMore && (
            <p
              className="mt-3 text-center text-xs font-semibold"
              style={{ color: "#8fa3ab" }}
            >
              Showing latest {DISPLAY_LIMIT} activities
            </p>
          )}
        </div>
      )}
    </div>
  );
}
