import { useState, useCallback } from "react";
import {
  FetchStatus,
  Transaction,
  TransactionFilters,
  TransactionTab,
  UseTransactionHistoryReturn,
} from "../types/transaction-history.types";
import { fetchTransactionHistory } from "../api/transaction-history.api";

export function useTransactionHistory(): UseTransactionHistoryReturn {
  const [data, setData] = useState<Transaction[]>([]);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [errorMessage, setError] = useState("");

  const fetchData = useCallback(async (tab: TransactionTab, filters: TransactionFilters) => {
    setStatus("loading");
    setError("");
    try {
      const result = await fetchTransactionHistory(tab, filters.selectedAccount ?? "");
      setData(result);
      setStatus("idle");
    } catch {
      setStatus("error");
      setError("Failed to load transactions. Please try again.");
      setData([]);
    }
  }, []);

  return { data, status, errorMessage, fetchData };
}
