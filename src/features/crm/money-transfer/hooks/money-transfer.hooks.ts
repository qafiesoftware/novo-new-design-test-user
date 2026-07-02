import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MT5Account,
  MT5ToMT5Request,
  MT5ToWalletRequest,
  TransferApiResponse,
  TransferTab,
  UseMT5AccountsReturn,
  UseTransferReturn,
  WalletToMT5Request,
} from "../types/money-transfer.types";
import { fetchMT5Accounts, submitTransferApi } from "../api/money-transfer.api";

type TransferPayload = MT5ToWalletRequest | WalletToMT5Request | MT5ToMT5Request;

// useMT5Accounts
export function useMT5Accounts(): UseMT5AccountsReturn {
  const query = useQuery<MT5Account[]>({
    queryKey: ["mt5Accounts"],
    queryFn: async () => {
      const accounts = await fetchMT5Accounts();
      return accounts.filter((a) => a.group_name !== "Demo");
    },
  });

  return {
    mt5Accounts: query.data ?? [],
    isLoading: query.isLoading,
    error: query.isError ? "Failed to load MT5 accounts." : "",
  };
}

// useTransfer
export function useTransfer(): UseTransferReturn {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ payload, tab }: { payload: TransferPayload; tab: TransferTab }) =>
      submitTransferApi(payload, tab),

    onSuccess: (data: TransferApiResponse) => {
      if (data.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["mt5Accounts"] });
        queryClient.invalidateQueries({ queryKey: ["userBalance", "userData"] });
      }
    },
  });

  const submitTransfer = useCallback(
    (payload: TransferPayload, tab: TransferTab) => {
      mutation.mutate({ payload, tab });
    },
    [mutation]
  );

  const reset = useCallback(() => mutation.reset(), [mutation]);

  const isSuccess = mutation.isSuccess && mutation.data?.status === 200;
  const isError = mutation.isError || (mutation.isSuccess && mutation.data?.status !== 200);

  return {
    transferStatus: mutation.isPending
      ? "loading"
      : isSuccess
        ? "success"
        : isError
          ? "error"
          : "idle",
    successMessage: isSuccess ? (mutation.data?.result ?? "Transfer successful.") : "",
    errorMessage: isError
      ? mutation.isError
        ? "Something went wrong. Please try again."
        : (mutation.data?.result ?? "Transfer failed.")
      : "",
    submitTransfer,
    reset,
  };
}
