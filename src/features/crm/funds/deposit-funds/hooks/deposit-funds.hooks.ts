import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import {
  addCashDeposit,
  depositFundsAddWalletBalance,
  generateCryptoWallet,
  getBankDetailsApi,
} from "../api/deposit-funds.api";
import type { AxiosError } from "axios";

export const useGetBankDetails = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["bank-details"],
    queryFn: getBankDetailsApi,
  });

  return {
    bankDetails: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// deposit funds api hook

import type {
  CashDepositPayload,
  CryptoNetwork,
  DepositFundsPayload,
  DepositStatus,
  GenerateWalletRequest,
  UseCryptoDepositReturn,
  WalletData,
} from "../types/deposit-funds.types";

// Deposit - through Bank
export const useDepositFundsAddWalletBalance = () => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: DepositFundsPayload) => depositFundsAddWalletBalance(payload),
    onSuccess: (response) => {
      const responseData = response?.data;
      if (responseData?.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["userBalance", "userData"] });
        setMessage({
          type: "success",
          text: responseData?.result || "Deposit successful.",
        });
      } else {
        setMessage({
          type: "error",
          text: responseData?.result || "Something went wrong.",
        });
      }
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }>;
      setMessage({
        type: "error",
        text: err.response?.data?.message || err.message || "Deposit failed.",
      });
    },
  });

  return { ...mutation, message };
};

// Cash Deposit API hook
export function useCashDeposit() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: CashDepositPayload) => addCashDeposit(payload),
    onSuccess: (data) => {
      const res = data?.data;
      if (res?.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["userBalance", "userData"] });
        setMessage({
          type: "success",
          text: res?.result || "Cash deposit successful",
        });
      } else {
        setMessage({
          type: "error",
          text: res?.result || "Failed to process cash deposit",
        });
      }
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }>;
      setMessage({
        type: "error",
        text:
          err.response?.data?.message || err.message || "Something went wrong. Please try again.",
      });
    },
  });

  return { ...mutation, message, setMessage };
}

export function useCryptoDeposit(network: CryptoNetwork): UseCryptoDepositReturn {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [status, setStatus] = useState<DepositStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
    if (!errorMessage) return;

    const timer = setTimeout(() => {
      setErrorMessage("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const generateWallet = useCallback(
    async (payload: GenerateWalletRequest) => {
      setStatus("loading");
      setErrorMessage("");
      setSuccessMessage("");

      try {
        const data = await generateCryptoWallet({ ...payload, network });

        if (data.status === 200) {
          setWalletData(data.response);
          setStatus("success");
          setSuccessMessage("Wallet generated successfully!");
        } else {
          setStatus("error");
          setErrorMessage(data.result || "Failed to generate wallet");
          setWalletData(null);
        }
      } catch {
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again.");
        setWalletData(null);
      }
    },
    [network]
  );

  const reset = useCallback(() => {
    setWalletData(null);
    setStatus("idle");
    setErrorMessage("");
    setSuccessMessage("");
  }, []);

  return { walletData, status, errorMessage, successMessage, generateWallet, reset };
}
