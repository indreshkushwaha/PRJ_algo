"use client";

import type { OrderHistoryItem } from "@/lib/types";

interface OrderHistoryProps {
  items: OrderHistoryItem[];
}

const statusColors: Record<string, string> = {
  filled: "text-emerald-400 bg-emerald-400/10",
  pending: "text-amber-400 bg-amber-400/10",
  rejected: "text-red-400 bg-red-400/10",
  cancelled: "text-zinc-400 bg-zinc-400/10",
};

export default function OrderHistory({ items }: OrderHistoryProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
        Order History
      </h3>
      <div className="max-h-64 space-y-2 overflow-y-auto">
        {items.map((order) => (
          <div
            key={order.id}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-sm"
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="font-medium text-[var(--foreground)]">
                {order.underlying} · {order.expiry}
              </span>
              <span
                className={`rounded px-2 py-0.5 text-xs font-medium ${statusColors[order.status] ?? "text-zinc-400"}`}
              >
                {order.status}
              </span>
            </div>
            <div className="text-[var(--muted)]">{order.strategy}</div>
            <div className="mt-1 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
              {order.legs.map((leg, i) => (
                <span key={i}>
                  {leg.type} {leg.strike} × {leg.qty}
                </span>
              ))}
            </div>
            <div className="mt-1 text-xs text-[var(--muted)]">
              {new Date(order.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
