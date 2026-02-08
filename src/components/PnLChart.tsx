"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { PnLPoint } from "@/lib/types";

interface PnLChartProps {
  data: PnLPoint[];
}

export default function PnLChart({ data }: PnLChartProps) {
  return (
    <div className="h-64 min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1d9bf0" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#1d9bf0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2f3336" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#71767b", fontSize: 11 }}
            stroke="#2f3336"
            tickFormatter={(v) => v.slice(5)}
          />
          <YAxis
            tick={{ fill: "#71767b", fontSize: 11 }}
            stroke="#2f3336"
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              background: "#16181c",
              border: "1px solid #2f3336",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#e7e9ea" }}
            formatter={(value: number | undefined) => [`₹${(value ?? 0).toLocaleString()}`, "Cumulative P&L"]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke="#1d9bf0"
            strokeWidth={2}
            fill="url(#pnlGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
