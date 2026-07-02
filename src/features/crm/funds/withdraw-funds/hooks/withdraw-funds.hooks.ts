import { useState, useCallback } from "react";
import {
  submitBankWithdraw,
  submitCashWithdraw,
  submitCryptoWithdraw,
} from "../api/withdraw-funds.api";
import {
  BankWithdrawRequest,
  UseBankWithdrawReturn,
  UseCashWithdrawReturn,
  WithdrawCashRequest,
  WithdrawCryptoRequest,
  WithdrawStatus,
} from "../types/withdraw-funds.types";

export function useBankWithdraw(): UseBankWithdrawReturn {
  const [status, setStatus] = useState<WithdrawStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const submitWithdraw = useCallback(async (payload: BankWithdrawRequest) => {
    setStatus("loading");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const data = await submitBankWithdraw(payload);

      if (data.status === 200) {
        setStatus("success");
        setSuccessMessage(data.result || "Withdrawal request submitted successfully!");
      } else {
        setStatus("error");
        setErrorMessage(data.result || "Withdrawal failed. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setErrorMessage("");
    setSuccessMessage("");
  }, []);

  return { status, errorMessage, successMessage, submitWithdraw, reset };
}

// CASH withdrawal hook

export function useCashWithdraw(): UseCashWithdrawReturn {
  const [withdrawStatus, setWithdrawStatus] = useState<WithdrawStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const submitWithdraw = useCallback(async (payload: WithdrawCashRequest) => {
    setWithdrawStatus("loading");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const data = await submitCashWithdraw(payload);

      if (data.status === 200) {
        setWithdrawStatus("success");
        setSuccessMessage(data.result || "Withdrawal submitted successfully.");
      } else {
        setWithdrawStatus("error");
        setErrorMessage(data.result || "Withdrawal failed.");
      }
    } catch {
      setWithdrawStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }, []);

  const reset = useCallback(() => {
    setWithdrawStatus("idle");
    setErrorMessage("");
    setSuccessMessage("");
  }, []);

  return { withdrawStatus, errorMessage, successMessage, submitWithdraw, reset };
}

// CRYPTO withdrawal hook

export function useCryptoWithdraw() {
  const [withdrawStatus, setWithdrawStatus] = useState<WithdrawStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const submitWithdraw = useCallback(async (payload: WithdrawCryptoRequest) => {
    setWithdrawStatus("loading");
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const data = await submitCryptoWithdraw(payload);
      if (data.status === 200) {
        setWithdrawStatus("success");
        setSuccessMessage(data.result || "Withdrawal submitted successfully.");
      } else {
        setWithdrawStatus("error");
        setErrorMessage(data.result || "Withdrawal failed.");
      }
    } catch {
      setWithdrawStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }, []);

  const reset = useCallback(() => {
    setWithdrawStatus("idle");
    setErrorMessage("");
    setSuccessMessage("");
  }, []);

  return { withdrawStatus, errorMessage, successMessage, submitWithdraw, reset };
}
