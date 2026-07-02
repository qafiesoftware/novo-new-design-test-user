import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchIBCommission,
  fetchIBCommissionHistory,
  withdrawIBCommission,
} from "../api/ib-commission.api";
import { WithdrawCommissionPayload } from "../types/ib-commission.types";

const IB_KEY = ["ib-commission"] as const;

// Fetch commission data
export function useIBCommission() {
  return useQuery({
    queryKey: IB_KEY,
    queryFn: fetchIBCommission,
    staleTime: 2 * 60 * 1000,
  });
}

// Withdraw commission
export function useWithdrawCommission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WithdrawCommissionPayload) => withdrawIBCommission(payload),
    onSuccess: (data) => {
      if (data.status === 200) {
        // Refetch commission data after successful withdrawal
        queryClient.invalidateQueries({ queryKey: IB_KEY });
      }
    },
  });
}

// get-history

export function useIBCommissionHistory() {
  return useQuery({
    queryKey: ["ibCommissionHistory"],
    queryFn: fetchIBCommissionHistory,
    staleTime: 2 * 60 * 1000,
  });
}