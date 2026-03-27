"use client";

import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuthStore } from "@/lib/store/authStore";

export interface PONotification {
  id: string;
  poId: number;
  newStatus: string;
  actorUsername: string;
  requesterUsername: string;
  timestamp: string;
  read: boolean;
}

interface POEventPayload {
  poId: number;
  newStatus: string;
  actorUsername: string;
  requesterUsername: string;
  timestamp: string;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:8080/ws";

/**
 * Filter: apakah notifikasi ini relevan untuk user yang sedang login?
 *
 * MANAGER   → dapat notif hanya saat newStatus = PENDING (ada PO baru dari requester)
 * FINANCE   → dapat notif hanya saat newStatus = MANAGER_APPROVED (siap final approval)
 * REQUESTER → dapat notif hanya untuk PO miliknya, dan hanya saat status berubah
 *             (MANAGER_APPROVED / FINANCE_APPROVED / REJECTED)
 */
function isRelevantForUser(
  payload: POEventPayload,
  role: string,
  username: string,
): boolean {
  switch (role) {
    case "MANAGER":
      return payload.newStatus === "PENDING";

    case "FINANCE":
      return payload.newStatus === "MANAGER_APPROVED";

    case "REQUESTER":
      return (
        payload.requesterUsername === username &&
        payload.newStatus !== "PENDING"
      );

    default:
      return false;
  }
}

export function usePONotification() {
  const token = useAuthStore((s) => s.token);
  const username = useAuthStore((s) => s.username);
  const role = useAuthStore((s) => s.role);
  const [notifications, setNotifications] = useState<PONotification[]>([]);
  const [initialized, setInitialized] = useState(false);
  const clientRef = useRef<Client | null>(null);

  // Load from local storage on mount when username is available
  useEffect(() => {
    if (!username) return;
    const stored = localStorage.getItem(`po_notifs_${username}`);
    if (stored) {
      try {
        setNotifications(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored notifications", e);
      }
    }
    setInitialized(true);
  }, [username]);

  // Save to local storage whenever notifications change
  useEffect(() => {
    if (!username || !initialized) return;
    localStorage.setItem(`po_notifs_${username}`, JSON.stringify(notifications));
  }, [notifications, username, initialized]);

  useEffect(() => {
    if (!token || !username || !role) return;

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("[STOMP] ✅ Connected to", WS_URL);

        stompClient.subscribe("/topic/po-events", (message) => {
          console.log("[STOMP] 📨 Message received:", message.body);

          const payload = JSON.parse(message.body) as POEventPayload;

          if (!isRelevantForUser(payload, role, username)) return;

          setNotifications((prev) => [
            {
              id: `${payload.poId}-${payload.timestamp}`,
              ...payload,
              read: false,
            },
            ...prev,
          ]);
        });
      },

      onStompError: (frame) => {
        console.error("[STOMP] ❌ Error:", frame.headers["message"]);
      },
      onDisconnect: () => {
        console.log("[STOMP] 🔌 Disconnected");
      },
      onWebSocketError: (event) => {
        console.error("[STOMP] 🔴 WebSocket error:", event);
      },
    });

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [token, username, role]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, markAllRead };
}
