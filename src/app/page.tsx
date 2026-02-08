"use client";

import { useCallback, useMemo, useState } from "react";
import {
  MOCK_UNDERLYINGS,
  MOCK_EXPIRIES,
  STRATEGIES,
  getMockLegsForStrategy,
  MOCK_ORDER_HISTORY,
  MOCK_PNL_DATA,
} from "@/lib/mockData";
import { showApiNotConfiguredAlert } from "@/lib/apiAlert";
import type { Underlying, Expiry, Strategy as StrategyType, OptionLeg } from "@/lib/types";
import PnLChart from "@/components/PnLChart";
import OrderHistory from "@/components/OrderHistory";
import OptionsLegs from "@/components/OptionsLegs";

export default function DemoPage() {
  const [underlying, setUnderlying] = useState<Underlying | null>(null);
  const [expiry, setExpiry] = useState<Expiry | null>(null);
  const [strategy, setStrategy] = useState<StrategyType | null>(null);
  const [legs, setLegs] = useState<OptionLeg[]>([]);

  const expiriesForUnderlying = useMemo(() => {
    if (!underlying) return [];
    return MOCK_EXPIRIES.filter((e) => e.underlyingId === underlying.id);
  }, [underlying]);

  const handleUnderlyingChange = useCallback((u: Underlying) => {
    setUnderlying(u);
    setExpiry(null);
    setStrategy(null);
    setLegs([]);
  }, []);

  const handleExpiryChange = useCallback((e: Expiry) => {
    setExpiry(e);
    setStrategy(null);
    setLegs([]);
  }, []);

  const handleStrategyChange = useCallback(
    (s: StrategyType) => {
      setStrategy(s);
      if (underlying) {
        setLegs(getMockLegsForStrategy(s.id, underlying.spot));
      }
    },
    [underlying]
  );

  const handleStrikeChange = useCallback((legId: string, strike: number) => {
    setLegs((prev) =>
      prev.map((l) => (l.id === legId ? { ...l, strike } : l))
    );
  }, []);

  const handlePlaceOrder = useCallback(() => {
    showApiNotConfiguredAlert();
  }, []);

  const canPlaceOrder = underlying && expiry && strategy && legs.length > 0;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="border-b border-[var(--border)] bg-[var(--card)] px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">
            Options Strategy Builder
          </h1>
          <button
            type="button"
            onClick={showApiNotConfiguredAlert}
            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] transition hover:bg-[var(--border)] hover:text-[var(--foreground)]"
          >
            Connect API
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 p-6">
        {/* Step 1: Underlying */}
        <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            1. Select Underlying
          </h2>
          <div className="flex flex-wrap gap-2">
            {MOCK_UNDERLYINGS.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleUnderlyingChange(u)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  underlying?.id === u.id
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                    : "border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--muted)]"
                }`}
              >
                {u.symbol} — {u.name} (₹{u.spot.toLocaleString()})
              </button>
            ))}
          </div>
          {underlying && (
            <p className="mt-2 text-xs text-[var(--muted)]">
              As of date: {underlying.asOfDate}
            </p>
          )}
        </section>

        {/* Step 2: Expiry */}
        <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            2. Select Expiry
          </h2>
          {!underlying ? (
            <p className="text-sm text-[var(--muted)]">
              Select an underlying first.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {expiriesForUnderlying.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => handleExpiryChange(e)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    expiry?.id === e.id
                      ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                      : "border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--muted)]"
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Step 3: Strategy */}
        <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            3. Select Strategy
          </h2>
          {!expiry ? (
            <p className="text-sm text-[var(--muted)]">
              Select an expiry first.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {STRATEGIES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleStrategyChange(s)}
                  className={`rounded-lg border p-4 text-left transition ${
                    strategy?.id === s.id
                      ? "border-[var(--accent)] bg-[var(--accent)]/10"
                      : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--muted)]"
                  }`}
                >
                  <div className="font-medium text-[var(--foreground)]">
                    {s.name}
                  </div>
                  <div className="mt-1 text-xs text-[var(--muted)]">
                    {s.description}
                  </div>
                  <div className="mt-1 text-xs text-[var(--muted)]">
                    {s.legs} legs
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Step 4: Options & Strikes */}
        {strategy && (
          <OptionsLegs legs={legs} onStrikeChange={handleStrikeChange} />
        )}

        {/* Place order */}
        <section className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={!canPlaceOrder}
            className={`rounded-xl px-6 py-3 text-base font-semibold transition ${
              canPlaceOrder
                ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
                : "cursor-not-allowed bg-[var(--border)] text-[var(--muted)]"
            }`}
          >
            Place Live Order
          </button>
          {!canPlaceOrder && (
            <span className="text-sm text-[var(--muted)]">
              Select underlying, expiry, and strategy to enable.
            </span>
          )}
        </section>

        {/* Analytics */}
        <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Cumulative P&L (Demo)
          </h3>
          <PnLChart data={MOCK_PNL_DATA} />
        </section>

        {/* History */}
        <OrderHistory items={MOCK_ORDER_HISTORY} />
      </main>
    </div>
  );
}
