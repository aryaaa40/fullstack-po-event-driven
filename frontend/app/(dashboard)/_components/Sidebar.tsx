"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  FileText,
  Clock,
  CheckSquare,
  List,
  Settings,
  BarChart3,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { Role } from "@/types/auth";

type NavItem = {
  label: string;
  href: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
};

const NAV_ITEMS: Record<Role, NavItem[]> = {
  REQUESTER: [
    { label: "Dashboard", href: "/dashboard", Icon: LayoutDashboard },
    { label: "New PO", href: "/po/new", Icon: Plus },
    { label: "My POs", href: "/po", Icon: FileText },
  ],
  MANAGER: [
    { label: "Dashboard", href: "/dashboard", Icon: LayoutDashboard },
    { label: "Pending Approvals", href: "/po/pending", Icon: Clock },
    { label: "All POs", href: "/po", Icon: List },
  ],
  FINANCE: [
    { label: "Dashboard", href: "/dashboard", Icon: LayoutDashboard },
    { label: "Final Approvals", href: "/po/final", Icon: CheckSquare },
    { label: "All POs", href: "/po", Icon: List },
  ],
};

const ROLE_LABEL: Record<Role, string> = {
  REQUESTER: "Requester",
  MANAGER: "Manager",
  FINANCE: "Finance",
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, username, logout } = useAuthStore();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  const navItems = role ? NAV_ITEMS[role] : [];

  return (
    <aside
      className="flex h-screen w-[220px] shrink-0 flex-col"
      style={{ backgroundColor: "#f0f4f7" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: "#0053db" }}
        >
          <BarChart3 size={16} color="#ffffff" strokeWidth={2.5} />
        </div>
        <div>
          <p
            className="text-sm font-bold leading-none"
            style={{
              color: "#2a3439",
              fontFamily: "var(--font-manrope), Manrope, sans-serif",
            }}
          >
            Axon
          </p>
          <p
            className="text-[10px] font-semibold tracking-widest"
            style={{ color: "#566166" }}
          >
            PRECISION SYSTEM
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-3 pt-2">
        {navItems.map(({ label, href, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
              style={{
                backgroundColor: isActive ? "#ffffff" : "transparent",
                color: isActive ? "#0053db" : "#566166",
                boxShadow: isActive ? "0 2px 8px rgba(42,52,57,0.06)" : "none",
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              {label}
            </Link>
          );
        })}

        {/* Settings */}
        <Link
          href="/settings"
          className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
          style={{
            backgroundColor:
              pathname === "/settings" ? "#ffffff" : "transparent",
            color: pathname === "/settings" ? "#0053db" : "#566166",
          }}
        >
          <Settings size={18} strokeWidth={1.8} />
          Settings
        </Link>
      </nav>

      {/* User card */}
      <div className="p-3">
        <div
          className="flex items-center gap-3 rounded-xl px-3 py-3"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
            style={{ backgroundColor: "#0053db", color: "#ffffff" }}
          >
            {username?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-sm font-semibold"
              style={{ color: "#2a3439" }}
            >
              {username}
            </p>
            <p className="text-xs" style={{ color: "#566166" }}>
              {role ? ROLE_LABEL[role] : ""}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="shrink-0 transition-opacity hover:opacity-60"
            aria-label="Logout"
          >
            <LogOut size={15} style={{ color: "#566166" }} />
          </button>
        </div>
      </div>
    </aside>
  );
}
