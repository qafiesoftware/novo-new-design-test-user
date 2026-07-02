import { useQuery } from "@tanstack/react-query";
import { ClientAccountFilters, SearchFilters } from "../types/reports.types";
import {
  fetchClientAccounts,
  fetchClientTransactions,
  fetchReportClients,
  fetchRewardHistory,
} from "../api/reports.api";
import { AffiliateProgressPayload } from "@/features/crm/dashboard/types/dashboard.types";
import { fetchAffiliateProgress } from "@/features/crm/dashboard/api/dashboard.api";

export const REPORT_KEYS = {
  clients: ["report", "clients"] as const,
  accounts: (f: ClientAccountFilters) => ["report", "accounts", f] as const,
  transactions: (f: SearchFilters) => ["report", "transactions", f] as const,
  rewards: (f: SearchFilters) => ["report", "rewards", f] as const,
};

export function useReportClients() {
  return useQuery({
    queryKey: REPORT_KEYS.clients,
    queryFn: fetchReportClients,
    staleTime: 2 * 60 * 1000,
  });
}

export function useClientAccounts(filters: ClientAccountFilters) {
  return useQuery({
    queryKey: REPORT_KEYS.accounts(filters),
    queryFn: () => fetchClientAccounts(filters),
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useClientTransactions(filters: SearchFilters) {
  return useQuery({
    queryKey: REPORT_KEYS.transactions(filters),
    queryFn: () => fetchClientTransactions(filters),
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useRewardHistory(filters: SearchFilters) {
  return useQuery({
    queryKey: REPORT_KEYS.rewards(filters),
    queryFn: () => fetchRewardHistory(filters),
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

// Dashboard-graph APIs
export const AFFILIATE_KEY = (payload: AffiliateProgressPayload = {}) =>
  [
    "affiliate-progress",
    payload.duration ?? "all-duration",
    payload.symbol ?? "all-symbol",
  ] as const;

export function useAffiliateProgress(payload: AffiliateProgressPayload = {}) {
  return useQuery({
    queryKey: AFFILIATE_KEY(payload),
    queryFn: () => fetchAffiliateProgress(payload),
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}
