import Link from "next/link";
import { Sparkles } from "lucide-react";
import { PurchaseOrder, POStatus } from "@/types/po";
import { Role } from "@/types/auth";

const ACTION_STATUS: Record<Role, POStatus> = {
  REQUESTER: "PENDING",
  MANAGER:   "PENDING",
  FINANCE:   "MANAGER_APPROVED",
};

const ACTION_LABEL: Record<Role, string> = {
  REQUESTER: "purchase orders awaiting approval",
  MANAGER:   "purchase orders pending your review",
  FINANCE:   "purchase orders pending final approval",
};

interface Props {
  username: string;
  role: Role;
  pos: PurchaseOrder[];
}

export default function WelcomeCard({ username, role, pos }: Props) {
  const actionCount = pos.filter((p) => p.status === ACTION_STATUS[role]).length;

  return (
    <div
      className="flex items-center justify-between rounded-2xl px-8 py-6"
      style={{
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 20px rgba(42,52,57,0.05)",
      }}
    >
      <div className="flex flex-col gap-2">
        {/* Chip */}
        <div
          className="flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wider"
          style={{ backgroundColor: "#eef2ff", color: "#0053db" }}
        >
          <Sparkles size={11} />
          SYSTEM OVERVIEW
        </div>

        {/* Headline */}
        <h1
          className="text-3xl font-extrabold"
          style={{
            color: "#2a3439",
            fontFamily: "var(--font-manrope), Manrope, sans-serif",
          }}
        >
          Welcome back, {username}.
        </h1>

        {/* Subtext */}
        <p className="text-sm" style={{ color: "#566166" }}>
          You have{" "}
          <span className="font-semibold" style={{ color: "#0053db" }}>
            {actionCount} purchase order{actionCount !== 1 ? "s" : ""}
          </span>{" "}
          {ACTION_LABEL[role]} today.
        </p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-3">
        {role === "REQUESTER" && (
          <Link
            href="/po/new"
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#0053db", color: "#f8f7ff" }}
          >
            + Create New PO
          </Link>
        )}
        <button
          className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[#e8ecf0]"
          style={{ backgroundColor: "#f0f4f7", color: "#2a3439" }}
        >
          View Analytics
        </button>
      </div>
    </div>
  );
}
