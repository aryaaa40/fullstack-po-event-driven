"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const token = useAuthStore((s) => s.token);
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !token) router.replace("/login");
  }, [hasHydrated, token, router]);

  // Tunggu hydration selesai sebelum render apapun.
  if (!hasHydrated) return null;

  // Hydration selesai tapi tidak ada token.
  if (!token) return null;

  return <>{children}</>;
}
