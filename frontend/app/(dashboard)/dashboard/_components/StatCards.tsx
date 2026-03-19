import { DollarSign, CheckCircle2, XCircle } from "lucide-react";
import { PurchaseOrder } from "@/types/po";

interface Props {
  pos: PurchaseOrder[];
}

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  iconBg: string;
  iconColor: string;
}

function StatCard({
  label,
  value,
  sub,
  Icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <div
      className="flex flex-1 flex-col gap-4 rounded-2xl px-6 py-5"
      style={{
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 20px rgba(42,52,57,0.05)",
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        <span className="text-xs font-semibold" style={{ color: "#566166" }}>
          {sub}
        </span>
      </div>
      <div>
        <p
          className="text-xs font-semibold tracking-widest"
          style={{ color: "#566166" }}
        >
          {label}
        </p>
        <p
          className="mt-1 text-2xl font-bold"
          style={{
            color: "#2a3439",
            fontFamily: "var(--font-manrope), Manrope, sans-serif",
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default function StatCards({ pos }: Props) {
  const totalSpent = pos
    .filter((p) => p.status === "FINANCE_APPROVED")
    .reduce((sum, p) => sum + p.amount, 0);

  const approvedCount = pos.filter(
    (p) => p.status === "FINANCE_APPROVED",
  ).length;
  const rejectedCount = pos.filter((p) => p.status === "REJECTED").length;
  const pendingCount = pos.filter(
    (p) => p.status === "PENDING" || p.status === "MANAGER_APPROVED",
  ).length;

  return (
    <div className="flex gap-4">
      <StatCard
        label="TOTAL SPENT (MTD)"
        value={`$${totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
        sub={`${pendingCount} In Progress`}
        Icon={DollarSign}
        iconBg="#eef2ff"
        iconColor="#0053db"
      />
      <StatCard
        label="APPROVED ORDERS"
        value={String(approvedCount)}
        sub="Finance Approved"
        Icon={CheckCircle2}
        iconBg="#e6ffee"
        iconColor="#006d4a"
      />
      <StatCard
        label="REJECTED POs"
        value={String(rejectedCount)}
        sub="All Time"
        Icon={XCircle}
        iconBg="#fff7f6"
        iconColor="#9f403d"
      />
    </div>
  );
}
