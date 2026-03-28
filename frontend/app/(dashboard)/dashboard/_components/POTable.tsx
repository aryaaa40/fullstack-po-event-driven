import Link from "next/link";
import { Eye } from "lucide-react";
import { PurchaseOrder, POStatus, POPriority } from "@/types/po";

const STATUS_STYLE: Record<
  POStatus,
  { bg: string; color: string; label: string }
> = {
  PENDING: { bg: "#eef3ff", color: "#0053db", label: "PENDING" },
  MANAGER_APPROVED: {
    bg: "#f3eeff",
    color: "#6750A4",
    label: "MANAGER APPROVED",
  },
  FINANCE_APPROVED: { bg: "#e6ffee", color: "#006d4a", label: "APPROVED" },
  REJECTED: { bg: "#fff7f6", color: "#9f403d", label: "REJECTED" },
};

const PRIORITY_STYLE: Record<POPriority, { bg: string; color: string }> = {
  NORMAL: { bg: "#f0f4f7", color: "#566166" },
  URGENT: { bg: "#fef3c7", color: "#b45309" },
  CRITICAL: { bg: "#fff7f6", color: "#9f403d" },
};

function StatusBadge({ status }: { status: POStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span
      className="whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: POPriority }) {
  const s = PRIORITY_STYLE[priority];
  return (
    <span
      className="whitespace-nowrap rounded-xl px-2.5 py-1.5 text-xs font-semibold"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {priority}
    </span>
  );
}

function CategoryBadge({ category }: { category: string | null }) {
  if (!category)
    return (
      <span className="text-xs" style={{ color: "#566166" }}>
        —
      </span>
    );
  return (
    <span
      className="whitespace-nowrap rounded-xl px-2.5 py-1.5 text-xs font-semibold"
      style={{ backgroundColor: "#f0f4f7", color: "#566166" }}
    >
      {category.replace(/_/g, " ")}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAmount(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

const COLUMNS = [
  "PO NUMBER",
  "TITLE",
  "CATEGORY",
  "PRIORITY",
  "AMOUNT",
  "CREATED AT",
  "STATUS",
  "ACTION",
];

interface Props {
  pos: PurchaseOrder[];
  loading: boolean;
  error: string | null;
  title?: string;
}

export default function POTable({
  pos,
  loading,
  error,
  title = "My Purchase Orders",
}: Props) {
  return (
    <div
      className="rounded-2xl"
      style={{
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 20px rgba(42,52,57,0.05)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <div>
          <h2
            className="text-base font-bold"
            style={{
              color: "#2a3439",
              fontFamily: "var(--font-manrope), Manrope, sans-serif",
            }}
          >
            {title}
          </h2>
          {!loading && !error && (
            <p className="mt-0.5 text-xs" style={{ color: "#566166" }}>
              You have {pos.length} purchase order{pos.length !== 1 ? "s" : ""}{" "}
              recorded in the system.
            </p>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderTop: "1px solid rgba(42,52,57,0.06)" }}>
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  className="px-6 py-3 text-left text-xs font-semibold tracking-wider"
                  style={{ color: "#566166" }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-6 py-8 text-center text-sm"
                  style={{ color: "#566166" }}
                >
                  Loading...
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-6 py-8 text-center text-sm"
                  style={{ color: "#9f403d" }}
                >
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && pos.length === 0 && (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-6 py-8 text-center text-sm"
                  style={{ color: "#566166" }}
                >
                  No purchase orders found.
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              pos.map((po) => (
                <tr
                  key={po.id}
                  style={{ borderTop: "1px solid rgba(42,52,57,0.04)" }}
                  className="transition-colors hover:bg-[#f7f9fb]"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/po/${po.id}`}
                      className="text-sm font-semibold hover:opacity-80"
                      style={{ color: "#0053db" }}
                    >
                      #PO-{String(po.id).padStart(3, "0")}
                    </Link>
                  </td>
                  <td
                    className="px-6 py-4 text-sm"
                    style={{ color: "#2a3439" }}
                  >
                    {po.title}
                  </td>
                  <td className="px-6 py-4">
                    <CategoryBadge category={po.category} />
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={po.priority} />
                  </td>
                  <td
                    className="px-6 py-4 text-sm font-medium"
                    style={{ color: "#2a3439" }}
                  >
                    {formatAmount(po.amount)}
                  </td>
                  <td
                    className="px-6 py-4 text-sm"
                    style={{ color: "#566166" }}
                  >
                    {formatDate(po.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={po.status} />
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/po/${po.id}`}
                      className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-[#eef2ff]"
                      style={{ color: "#0053db" }}
                      aria-label="View Details"
                    >
                      <Eye size={15} strokeWidth={2.5} />
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {!loading && !error && pos.length > 0 && (
        <div
          className="px-6 py-4"
          style={{ borderTop: "1px solid rgba(42,52,57,0.06)" }}
        >
          <p className="text-xs" style={{ color: "#566166" }}>
            Showing {pos.length} order{pos.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
