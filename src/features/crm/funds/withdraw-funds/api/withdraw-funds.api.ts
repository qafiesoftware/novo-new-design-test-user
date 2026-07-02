import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/endpoints";
import {
  BankWithdrawRequest,
  BankWithdrawResponse,
  WithdrawCashApiResponse,
  WithdrawCashRequest,
  WithdrawCryptoApiResponse,
  WithdrawCryptoRequest,
} from "../types/withdraw-funds.types";

export async function submitBankWithdraw(
  payload: BankWithdrawRequest
): Promise<BankWithdrawResponse> {
  const res = await api.post<{ data: BankWithdrawResponse }>(
    API_ENDPOINTS.CRM.WITHDRAW_FUNDS_ADD_WALLET_BAL,
    payload
  );
  return res.data.data;
}

// CASH withdrawal API function
export async function submitCashWithdraw(
  payload: WithdrawCashRequest
): Promise<WithdrawCashApiResponse> {
  const res = await api.post<{ data: WithdrawCashApiResponse }>(
    API_ENDPOINTS.CRM.WITHDRAW_FUND_ADD_WALLET_BAL_CASH,
    payload
  );
  return res.data.data;
}

// Crypto withdrawal API function
export async function submitCryptoWithdraw(
  payload: WithdrawCryptoRequest
): Promise<WithdrawCryptoApiResponse> {
  const res = await api.post<{ data: WithdrawCryptoApiResponse }>(
    API_ENDPOINTS.CRM.WITHDRAW_FUND_BY_CRYPTO,
    payload
  );
  return res.data.data;
}
