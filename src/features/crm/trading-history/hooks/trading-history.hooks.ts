import { useState, useCallback } from "react";
import { fetchTradingHistory } from "../api/trading-history.api";
import {
  FetchStatus,
  TradingDeal,
  TradingHistoryFilters,
  UseTradingHistoryReturn,
} from "../types/trading-history.types";

export function useTradingHistory(): UseTradingHistoryReturn {
  const [deals, setDeals] = useState<TradingDeal[]>([]);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [errorMessage, setError] = useState("");

  const fetchDeals = useCallback(async (filters: TradingHistoryFilters) => {
    setStatus("fetching");
    setError("");
    try {
      const result = await fetchTradingHistory(filters);
      setDeals(result);
      setStatus("idle");
    } catch {
      setStatus("Something went wrong");
      setError("Failed to load trading history. Please try again.");
      setDeals([]);
    }
  }, []);

  return { deals, status, errorMessage, fetchDeals };
}