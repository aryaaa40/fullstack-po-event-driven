import Link from "next/link";
import { Eye } from "lucide-react";
import { PurchaseOrder, POStatus } from "@/types/po";

const STATUS_STYLE: Record<
  POStatus,
  { bg: string; color: string; label: string }
> = {
  PENDING: { bg: "#0053db", color: "#f8f7ff", label: "Pending" },
  MANAGER_APPROVED: {
    bg: "#6750A4",
    color: "#f3eeff",
    label: "Manager Approved",
  },
  FINANCE_APPROVED: { bg: "#006d4a", color: "#e6ffee", label: "Approved" },
  REJECTED: { bg: "#9f403d", color: "#fff7f6", label: "Rejected" },
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
              {[
                "PO NUMBER",
                "TITLE",
                "AMOUNT",
                "CREATED AT",
                "STATUS",
                "ACTION",
              ].map((col) => (
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
                  colSpan={6}
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
                  colSpan={6}
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
                  colSpan={6}
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
