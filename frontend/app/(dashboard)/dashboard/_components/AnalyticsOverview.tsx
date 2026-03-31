"use client";

import { useAnalytics } from "@/lib/hooks/useAnalytics";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { Loader2, PieChart as PieIcon, TrendingUp } from "lucide-react";

const FONT_MANROPE = "var(--font-manrope), Manrope, sans-serif";

const COLORS = [
  "#0053db", "#6750A4", "#006d4a", "#9f403d", 
  "#8fa3ab", "#566166", "#2a3439", "#f0f4f7"
];

function formatCurrency(value: number | string | any) {
  const numericValue = typeof value === "number" ? value : parseFloat(value);
  if (isNaN(numericValue)) return "Rp0";
  
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(numericValue);
}

export default function AnalyticsOverview() {
  const { data, loading, error } = useAnalytics();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-white shadow-sm border border-[#f0f4f7]">
        <Loader2 className="animate-spin text-[#0053db]" size={24} />
      </div>
    );
  }

  if (error || !data) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Monthly Trend Area Chart */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#f0f4f7]">
        <div className="mb-6 flex items-center gap-2">
          <div className="rounded-lg bg-[#eef3ff] p-2 text-[#0053db]">
            <TrendingUp size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}>Spending Trend</h3>
            <p className="text-[11px]" style={{ color: "#566166" }}>Monthly approved expenditure</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.monthlyTrend}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0053db" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#0053db" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f4f7" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: "#8fa3ab" }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: "#8fa3ab" }}
                tickFormatter={(val) => `Rp${val/1000000}M`}
              />
              <Tooltip 
                formatter={(val: any) => [formatCurrency(val), "Spend"]}
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: "12px" }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#0053db" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorSpend)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Pie Chart */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#f0f4f7]">
        <div className="mb-6 flex items-center gap-2">
          <div className="rounded-lg bg-[#f3eeff] p-2 text-[#6750A4]">
            <PieIcon size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: "#2a3439", fontFamily: FONT_MANROPE }}>Category Distribution</h3>
            <p className="text-[11px]" style={{ color: "#566166" }}>Approved spending per category</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.categoryDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="amount"
                nameKey="category"
              >
                {data.categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(val: any) => formatCurrency(val)}
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: "12px" }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                formatter={(val) => <span className="text-[11px] font-medium" style={{ color: "#566166" }}>{val}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
