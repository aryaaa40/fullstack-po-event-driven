import {
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { PurchaseOrder } from "@/types/po";
import { Role } from "@/types/auth";

interface Props {
  pos: PurchaseOrder[];
  role: Role;
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

function formatRp(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function RequesterStats({ pos }: { pos: PurchaseOrder[] }) {
  const totalSpent = pos
    .filter((p) => p.status === "FINANCE_APPROVED")
    .reduce((sum, p) => sum + p.amount, 0);
  const approvedCount = pos.filter(
    (p) => p.status === "FINANCE_APPROVED",
  ).length;
  const rejectedCount = pos.filter((p) => p.status === "REJECTED").length;
  const inProgressCount = pos.filter(
    (p) => p.status === "PENDING" || p.status === "MANAGER_APPROVED",
  ).length;

  return (
    <>
      <StatCard
        label="TOTAL SPENT (MTD)"
        value={formatRp(totalSpent)}
        sub={`${inProgressCount} In Progress`}
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
    </>
  );
}

function ManagerStats({ pos }: { pos: PurchaseOrder[] }) {
  const awaitingCount = pos.length;
  const totalValue = pos.reduce((sum, p) => sum + p.amount, 0);
  const avgValue =
    awaitingCount > 0 ? Math.round(totalValue / awaitingCount) : 0;

  return (
    <>
      <StatCard
        label="AWAITING YOUR REVIEW"
        value={String(awaitingCount)}
        sub="Needs Action"
        Icon={Clock}
        iconBg="#eef2ff"
        iconColor="#0053db"
      />
      <StatCard
        label="TOTAL VALUE AT STAKE"
        value={formatRp(totalValue)}
        sub="Combined Pending"
        Icon={TrendingUp}
        iconBg="#f3eeff"
        iconColor="#6750A4"
      />
      <StatCard
        label="AVERAGE PO VALUE"
        value={formatRp(avgValue)}
        sub="Per Request"
        Icon={BarChart3}
        iconBg="#e6ffee"
        iconColor="#006d4a"
      />
    </>
  );
}

function FinanceStats({ pos }: { pos: PurchaseOrder[] }) {
  const readyCount = pos.length;
  const totalCommitment = pos.reduce((sum, p) => sum + p.amount, 0);
  const avgValue =
    readyCount > 0 ? Math.round(totalCommitment / readyCount) : 0;

  return (
    <>
      <StatCard
        label="READY FOR APPROVAL"
        value={String(readyCount)}
        sub="Manager Approved"
        Icon={CheckCircle2}
        iconBg="#e6ffee"
        iconColor="#006d4a"
      />
      <StatCard
        label="TOTAL COMMITMENT"
        value={formatRp(totalCommitment)}
        sub="Awaiting Final Sign Off"
        Icon={DollarSign}
        iconBg="#eef2ff"
        iconColor="#0053db"
      />
      <StatCard
        label="AVERAGE VALUE"
        value={formatRp(avgValue)}
        sub="Per Order"
        Icon={BarChart3}
        iconBg="#f3eeff"
        iconColor="#6750A4"
      />
    </>
  );
}

export default function StatCards({ pos, role }: Props) {
  return (
    <div className="flex gap-4">
      {role === "REQUESTER" && <RequesterStats pos={pos} />}
      {role === "MANAGER" && <ManagerStats pos={pos} />}
      {role === "FINANCE" && <FinanceStats pos={pos} />}
    </div>
  );
}
