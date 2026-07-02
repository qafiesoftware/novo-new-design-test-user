import { fetchRebateClients, fetchRebateHistory } from "@/features/partner/rebates/api/rebates.api";
import { RebateFilters } from "@/features/partner/rebates/types/rebates.types";
import { useQuery } from "@tanstack/react-query";

export const REBATE_KEYS = {
  clients: (filters: RebateFilters) => ["rebates", "clients", filters] as const,
  history: (filters: RebateFilters) => ["rebates", "history", filters] as const,
};

// ── Clients
export function useRebateClients(filters: RebateFilters) {
  return useQuery({
    queryKey: REBATE_KEYS.clients(filters),
    queryFn: () => fetchRebateClients(filters),
    staleTime: 2 * 60 * 1000, // 2 min — matches "updated once in 2 hours"
    placeholderData: (prev) => prev, // keep previous data while fetching
  });
}

// ── History
export function useRebateHistory(filters: RebateFilters) {
  return useQuery({
    queryKey: REBATE_KEYS.history(filters),
    queryFn: () => fetchRebateHistory(filters),
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}
