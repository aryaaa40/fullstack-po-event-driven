"use client";

import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuthStore } from "@/lib/store/authStore";
import { notificationRepository } from "@/lib/repositories/notificationRepository";

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
  const [latestEvent, setLatestEvent] = useState<POEventPayload | null>(null);
  const clientRef = useRef<Client | null>(null);

  // Fetch actual historical notifications from Database on mount
  useEffect(() => {
    if (!token || !username || !role) return;
    notificationRepository
      .getMyNotifications()
      .then((data) => setNotifications(data as PONotification[]))
      .catch((e) => console.error("Failed to load historical notifications", e));
  }, [token, username, role]);

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

          // Update general notification list
          setNotifications((prev) => [
            {
              id: `${payload.poId}-${payload.timestamp}`,
              ...payload,
              read: false,
            },
            ...prev,
          ]);

          // Trigger real-time event update for dashboard refresh
          setLatestEvent(payload);
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

  const markAllRead = async () => {
    try {
      if (unreadCount === 0) return;
      await notificationRepository.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {
      console.error("Failed to mark notifications as read", e);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, latestEvent, markAllRead };
}
