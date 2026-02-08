import type { Underlying, Expiry, Strategy, OptionLeg, OrderHistoryItem, PnLPoint } from "./types";

export const MOCK_UNDERLYINGS: Underlying[] = [
  { id: "nifty50", symbol: "NIFTY", name: "Nifty 50", spot: 24520, asOfDate: "2025-02-08" },
  { id: "banknifty", symbol: "BANKNIFTY", name: "Bank Nifty", spot: 52100, asOfDate: "2025-02-08" },
  { id: "finifty", symbol: "FINNIFTY", name: "Fin Nifty", spot: 22100, asOfDate: "2025-02-08" },
];

export const MOCK_EXPIRIES: Expiry[] = [
  { id: "nifty-1", underlyingId: "nifty50", date: "2025-02-13", label: "13 Feb 2025 (Weekly)" },
  { id: "nifty-2", underlyingId: "nifty50", date: "2025-02-20", label: "20 Feb 2025 (Weekly)" },
  { id: "nifty-3", underlyingId: "nifty50", date: "2025-02-27", label: "27 Feb 2025 (Monthly)" },
  { id: "bnf-1", underlyingId: "banknifty", date: "2025-02-12", label: "12 Feb 2025 (Weekly)" },
  { id: "bnf-2", underlyingId: "banknifty", date: "2025-02-19", label: "19 Feb 2025 (Weekly)" },
  { id: "fnf-1", underlyingId: "finifty", date: "2025-02-14", label: "14 Feb 2025 (Weekly)" },
];

export const STRATEGIES: Strategy[] = [
  { id: "iron-condor", name: "Iron Condor", description: "Sell OTM put & call, buy further OTM", legs: 4 },
  { id: "iron-fly", name: "Iron Fly", description: "Sell ATM straddle, buy OTM strangle", legs: 4 },
  { id: "straddle", name: "Straddle", description: "Buy/sell same strike call and put", legs: 2 },
  { id: "strangle", name: "Strangle", description: "Buy/sell OTM call and OTM put", legs: 2 },
];

function getStrikesNearSpot(spot: number, count: number = 8): number[] {
  const step = spot >= 20000 ? 100 : 50;
  const start = Math.floor((spot - step * (count / 2)) / step) * step;
  return Array.from({ length: count }, (_, i) => start + i * step);
}

export function getMockLegsForStrategy(
  strategyId: string,
  spot: number
): OptionLeg[] {
  const strikes = getStrikesNearSpot(spot);
  const atm = strikes[Math.floor(strikes.length / 2)];
  const otmLow = atm - (spot >= 20000 ? 200 : 100);
  const otmHigh = atm + (spot >= 20000 ? 200 : 100);
  const farLow = otmLow - (spot >= 20000 ? 200 : 100);
  const farHigh = otmHigh + (spot >= 20000 ? 200 : 100);

  switch (strategyId) {
    case "iron-condor":
      return [
        { id: "1", type: "put", strike: farLow, quantity: 1, premium: -45, role: "buy" },
        { id: "2", type: "put", strike: otmLow, quantity: 1, premium: 120, role: "sell" },
        { id: "3", type: "call", strike: otmHigh, quantity: 1, premium: 115, role: "sell" },
        { id: "4", type: "call", strike: farHigh, quantity: 1, premium: -42, role: "buy" },
      ];
    case "iron-fly":
      return [
        { id: "1", type: "put", strike: otmLow, quantity: 1, premium: -35, role: "buy" },
        { id: "2", type: "put", strike: atm, quantity: 1, premium: 185, role: "sell" },
        { id: "3", type: "call", strike: atm, quantity: 1, premium: 182, role: "sell" },
        { id: "4", type: "call", strike: otmHigh, quantity: 1, premium: -38, role: "buy" },
      ];
    case "straddle":
      return [
        { id: "1", type: "put", strike: atm, quantity: 1, premium: -210, role: "buy" },
        { id: "2", type: "call", strike: atm, quantity: 1, premium: -205, role: "buy" },
      ];
    case "strangle":
      return [
        { id: "1", type: "put", strike: otmLow, quantity: 1, premium: -95, role: "buy" },
        { id: "2", type: "call", strike: otmHigh, quantity: 1, premium: -88, role: "buy" },
      ];
    default:
      return [];
  }
}

export const MOCK_ORDER_HISTORY: OrderHistoryItem[] = [
  {
    id: "ord-1",
    timestamp: "2025-02-08T10:32:00",
    underlying: "NIFTY",
    expiry: "13 Feb 2025",
    strategy: "Iron Condor",
    legs: [
      { type: "Put", strike: 24200, qty: 1 },
      { type: "Put", strike: 24400, qty: -1 },
      { type: "Call", strike: 24600, qty: -1 },
      { type: "Call", strike: 24800, qty: 1 },
    ],
    status: "filled",
  },
  {
    id: "ord-2",
    timestamp: "2025-02-07T14:15:00",
    underlying: "BANKNIFTY",
    expiry: "12 Feb 2025",
    strategy: "Straddle",
    legs: [
      { type: "Put", strike: 52000, qty: 1 },
      { type: "Call", strike: 52000, qty: 1 },
    ],
    status: "filled",
  },
  {
    id: "ord-3",
    timestamp: "2025-02-06T09:45:00",
    underlying: "NIFTY",
    expiry: "20 Feb 2025",
    strategy: "Strangle",
    legs: [
      { type: "Put", strike: 24200, qty: 1 },
      { type: "Call", strike: 24800, qty: 1 },
    ],
    status: "rejected",
  },
];

export const MOCK_PNL_DATA: PnLPoint[] = [
  { date: "2025-02-01", pnl: 4200, cumulative: 4200 },
  { date: "2025-02-02", pnl: -1800, cumulative: 2400 },
  { date: "2025-02-03", pnl: 3100, cumulative: 5500 },
  { date: "2025-02-04", pnl: 1200, cumulative: 6700 },
  { date: "2025-02-05", pnl: -900, cumulative: 5800 },
  { date: "2025-02-06", pnl: 2400, cumulative: 8200 },
  { date: "2025-02-07", pnl: 1800, cumulative: 10000 },
  { date: "2025-02-08", pnl: 1500, cumulative: 11500 },
];
