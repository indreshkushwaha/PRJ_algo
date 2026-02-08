export type UnderlyingId = string;
export type ExpiryId = string;
export type StrategyId = "iron-condor" | "iron-fly" | "straddle" | "strangle";

export interface Underlying {
  id: UnderlyingId;
  symbol: string;
  name: string;
  spot: number;
  asOfDate: string; // YYYY-MM-DD
}
 
export interface Expiry {
  id: ExpiryId;
  underlyingId: UnderlyingId;
  date: string; // YYYY-MM-DD
  label: string;
}

export interface Strategy {
  id: StrategyId;
  name: string;
  description: string;
  legs: number;
}

export type OptionType = "call" | "put";

export interface OptionLeg {
  id: string;
  type: OptionType;
  strike: number;
  quantity: number;
  premium: number;
  role: "buy" | "sell";
}

export interface OrderHistoryItem {
  id: string;
  timestamp: string;
  underlying: string;
  expiry: string;
  strategy: string;
  legs: { type: string; strike: number; qty: number }[];
  status: "pending" | "filled" | "rejected" | "cancelled";
}

export interface PnLPoint {
  date: string;
  pnl: number;
  cumulative: number;
}
