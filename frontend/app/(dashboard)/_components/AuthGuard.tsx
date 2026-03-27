"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const token = useAuthStore((s) => s.token);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && hasHydrated && !token) {
      router.replace("/login");
    }
  }, [isMounted, hasHydrated, token, router]);

  if (!isMounted) return null;

  if (!hasHydrated) return null;

  if (!token) return null;

  return <>{children}</>;
}
