"use client";

import { useState } from "react";
import { Bell, HelpCircle, Search } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { usePONotification } from "@/lib/hooks/usePONotification";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "#0053db", text: "#f8f7ff" },
  MANAGER_APPROVED: { bg: "#6750A4", text: "#f3eeff" },
  FINANCE_APPROVED: { bg: "#006d4a", text: "#e6ffee" },
  REJECTED: { bg: "#9f403d", text: "#fff7f6" },
};

function StatusChip({ status }: { status: string }) {
  const colors = STATUS_COLORS[status] ?? { bg: "#566166", text: "#ffffff" };
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export default function TopBar() {
  const username = useAuthStore((s) => s.username);
  const { notifications, unreadCount, markAllRead } = usePONotification();
  const [open, setOpen] = useState(false);

  const handleBellClick = () => {
    setOpen((prev) => !prev);
    if (!open) markAllRead();
  };

  return (
    <header
      className="relative flex h-14 shrink-0 items-center gap-4 px-6"
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
        {/* Bell Button */}
        <div className="relative">
          <button
            onClick={handleBellClick}
            className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors hover:bg-[#f0f4f7]"
            aria-label="Notifications"
          >
            <Bell size={18} style={{ color: "#566166" }} />

            {/* Badge counter — hanya muncul jika ada unread */}
            {unreadCount > 0 && (
              <span
                className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
                style={{ backgroundColor: "#0053db", color: "#ffffff" }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {open && (
            <>
              {/* Backdrop untuk close saat klik di luar */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setOpen(false)}
              />

              <div
                className="absolute right-0 top-10 z-20 w-80 rounded-2xl p-1"
                style={{
                  backgroundColor: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 20px 40px rgba(42,52,57,0.1)",
                }}
              >
                {/* Header dropdown */}
                {/* <div className="px-4 py-3">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#2a3439", fontFamily: "Manrope, sans-serif" }}
                  >
                    Notifications
                  </p>
                </div> */}

                {/* List notifikasi */}
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm" style={{ color: "#566166" }}>
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  <ul className="max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <li
                        key={n.id}
                        className="rounded-xl px-4 py-3 transition-colors hover:bg-[#f0f4f7]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p
                              className="text-sm font-medium"
                              style={{ color: "#2a3439" }}
                            >
                              PO #{n.poId}
                            </p>
                            <p
                              className="mt-0.5 text-xs"
                              style={{ color: "#566166" }}
                            >
                              Updated by{" "}
                              <span className="font-semibold">
                                {n.actorUsername}
                              </span>
                            </p>
                          </div>
                          <StatusChip status={n.newStatus} />
                        </div>
                        <p
                          className="mt-1.5 text-[11px]"
                          style={{ color: "#9ca3af" }}
                        >
                          {new Date(n.timestamp).toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>

        <button
          className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors hover:bg-[#f0f4f7]"
          aria-label="Help"
        >
          <HelpCircle size={18} style={{ color: "#566166" }} />
        </button>

        {/* Avatar */}
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
