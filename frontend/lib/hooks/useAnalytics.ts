import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/lib/store/authStore";

export interface AnalyticsData {
  summary: {
    totalOrders: number;
    approvedOrders: number;
    totalSpend: number;
  };
  categoryDistribution: {
    category: string;
    amount: number;
  }[];
  monthlyTrend: {
    month: string;
    amount: number;
  }[];
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((s) => s.token);

  const fetchAnalytics = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const res = await axios.get(`${backendUrl}/api/v1/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch analytics:", err);
      setError(err.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [token]);

  return { data, loading, error, refetch: fetchAnalytics };
}
