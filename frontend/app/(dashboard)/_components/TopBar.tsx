"use client";

import { Bell, HelpCircle, Search } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";

export default function TopBar() {
  const username = useAuthStore((s) => s.username);

  return (
    <header
      className="flex h-14 shrink-0 items-center gap-4 px-6"
      style={{
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 0 rgba(42,52,57,0.06)",
      }}
    >
      {/* Search */}
      <div
        className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2"
        style={{ backgroundColor: "#f0f4f7", maxWidth: "400px" }}
      >
        <Search size={15} style={{ color: "#9ca3af" }} />
        <input
          type="text"
          placeholder="Search POs..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#9ca3af]"
          style={{ color: "#2a3439" }}
        />
      </div>

      {/* Actions */}
      <div className="ml-auto flex items-center gap-3">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors hover:bg-[#f0f4f7]"
          aria-label="Notifications"
        >
          <Bell size={18} style={{ color: "#566166" }} />
        </button>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors hover:bg-[#f0f4f7]"
          aria-label="Help"
        >
          <HelpCircle size={18} style={{ color: "#566166" }} />
        </button>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
          style={{ backgroundColor: "#0053db", color: "#ffffff" }}
        >
          {username?.[0]?.toUpperCase() ?? "?"}
        </div>
      </div>
    </header>
  );
}
