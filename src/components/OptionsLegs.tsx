"use client";

import type { OptionLeg } from "@/lib/types";

interface OptionsLegsProps {
  legs: OptionLeg[];
  onStrikeChange: (legId: string, strike: number) => void;
}

export default function OptionsLegs({ legs, onStrikeChange }: OptionsLegsProps) {
  if (legs.length === 0) return null;

  const totalPremium = legs.reduce((s, l) => s + l.premium * l.quantity * (l.role === "sell" ? 1 : -1), 0);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
        Option Legs
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
              <th className="pb-2 pr-4">Type</th>
              <th className="pb-2 pr-4">Strike</th>
              <th className="pb-2 pr-4">Qty</th>
              <th className="pb-2 pr-4">Role</th>
              <th className="pb-2">Premium</th>
            </tr>
          </thead>
          <tbody>
            {legs.map((leg) => (
              <tr key={leg.id} className="border-b border-[var(--border)] last:border-0">
                <td className="py-2 pr-4">
                  <span
                    className={
                      leg.type === "call"
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }
                  >
                    {leg.type.toUpperCase()}
                  </span>
                </td>
                <td className="py-2 pr-4">
                  <input
                    type="number"
                    value={leg.strike}
                    onChange={(e) =>
                      onStrikeChange(leg.id, Number(e.target.value) || leg.strike)
                    }
                    className="w-24 rounded border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                  />
                </td>
                <td className="py-2 pr-4">{leg.quantity}</td>
                <td className="py-2 pr-4">
                  <span
                    className={
                      leg.role === "sell"
                        ? "text-amber-400"
                        : "text-sky-400"
                    }
                  >
                    {leg.role.toUpperCase()}
                  </span>
                </td>
                <td className="py-2">
                  {leg.role === "sell" ? "+" : ""}
                  {leg.premium} × {leg.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 border-t border-[var(--border)] pt-3 text-sm font-medium text-[var(--foreground)]">
        Net premium: ₹{totalPremium.toFixed(0)}
      </div>
    </div>
  );
}
