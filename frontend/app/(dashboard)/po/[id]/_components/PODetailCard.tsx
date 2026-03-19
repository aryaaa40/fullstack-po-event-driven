import { PurchaseOrder, POStatus } from "@/types/po";
import { FileText, User, CalendarDays, RefreshCw } from "lucide-react";

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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAmount(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: "#f0f4f7" }}
      >
        <Icon size={14} style={{ color: "#566166" }} />
      </div>
      <div>
        <p
          className="text-xs font-semibold tracking-wider"
          style={{ color: "#566166" }}
        >
          {label}
        </p>
        <p className="mt-0.5 text-sm" style={{ color: "#2a3439" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function PODetailCard({ po }: { po: PurchaseOrder }) {
  const status = STATUS_STYLE[po.status];

  return (
    <div
      className="flex flex-col gap-6 rounded-2xl p-6"
      style={{
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 20px rgba(42,52,57,0.05)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="text-xs font-semibold tracking-widest"
            style={{ color: "#566166" }}
          >
            #PO-{String(po.id).padStart(3, "0")}
          </p>
          <h1
            className="mt-1 text-xl font-extrabold"
            style={{
              color: "#2a3439",
              fontFamily: "var(--font-manrope), Manrope, sans-serif",
            }}
          >
            {po.title}
          </h1>
        </div>
        <span
          className="whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold"
          style={{ backgroundColor: status.bg, color: status.color }}
        >
          {status.label}
        </span>
      </div>

      {/* Amount */}
      <div
        className="rounded-xl px-5 py-4"
        style={{ backgroundColor: "#f0f4f7" }}
      >
        <p
          className="text-xs font-semibold tracking-widest"
          style={{ color: "#566166" }}
        >
          TOTAL AMOUNT
        </p>
        <p
          className="mt-1 text-3xl font-extrabold"
          style={{
            color: "#2a3439",
            fontFamily: "var(--font-manrope), Manrope, sans-serif",
          }}
        >
          {formatAmount(po.amount)}
        </p>
      </div>

      {/* Description */}
      {po.description && (
        <div>
          <p
            className="text-xs font-semibold tracking-widest"
            style={{ color: "#566166" }}
          >
            DESCRIPTION
          </p>
          <p
            className="mt-1.5 text-sm leading-relaxed"
            style={{ color: "#2a3439" }}
          >
            {po.description}
          </p>
        </div>
      )}

      {/* Meta info */}
      <div className="flex flex-col gap-3">
        <InfoRow
          icon={User}
          label="SUBMITTED BY"
          value={po.createdByUsername}
        />
        <InfoRow
          icon={FileText}
          label="DOCUMENT ID"
          value={`#PO-${String(po.id).padStart(3, "0")}`}
        />
        <InfoRow
          icon={CalendarDays}
          label="CREATED AT"
          value={formatDate(po.createdAt)}
        />
        <InfoRow
          icon={RefreshCw}
          label="LAST UPDATED"
          value={formatDate(po.updatedAt)}
        />
      </div>
    </div>
  );
}
