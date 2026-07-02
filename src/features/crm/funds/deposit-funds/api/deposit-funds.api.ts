import api from "@/lib/axios";
import { GetBankResponse } from "../types/deposit-funds.types";
import { API_ENDPOINTS } from "@/constants/endpoints";

export const getBankDetailsApi = async (): Promise<GetBankResponse> => {
  const response = await api.post(API_ENDPOINTS.CRM.GET_ADMIN_BANK_DETAILS);
  return response.data?.data?.response;
};

// fund-deposit api
import type {
  CashDepositPayload,
  CashDepositResponse,
  CryptoNetwork,
  DepositFundsPayload,
  DepositResponse,
  GenerateWalletApiResponse,
  GenerateWalletRequest,
} from "../types/deposit-funds.types";
import { ApiResponse } from "@/types/api.types";
import { NETWORK_GENERATE_MAP } from "../schemas/deposit-funds.schemas";

export const depositFundsAddWalletBalance = async (
  payload: DepositFundsPayload
): Promise<ApiResponse<DepositResponse>> => {
  const formData = new FormData();

  formData.append("amount", payload.amount);
  formData.append("req_transaction_id", payload.req_transaction_id);
  formData.append("remark", payload.remark);
  formData.append("deposit_type", payload.deposit_type);

  if (payload.receipt) {
    formData.append("receipt", payload.receipt);
  }

  const response = await api.post(API_ENDPOINTS.CRM.DEPOSIT_FUNDS_ADD_WALLET_BAL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

//  CASH DEPOSIT API
export const addCashDeposit = async (payload: CashDepositPayload): Promise<CashDepositResponse> => {
  const response = await api.post(API_ENDPOINTS.CRM.DEPOSIT_FUNDS_ADD_WALLET_BAL_CASH, payload);

  return response.data;
};

// Walllet generate api

export async function generateCryptoWallet(
  payload: GenerateWalletRequest
): Promise<GenerateWalletApiResponse> {
  const { network, ...rest } = payload;
  const endpoint = NETWORK_GENERATE_MAP[network];
  const res = await api.post<{ data: GenerateWalletApiResponse }>(endpoint, rest);
  return res.data.data;
}

export const NETWORK_META: Record<CryptoNetwork, { label: string; icon: string }> = {
  BEP20: { label: "USDT - BEP20 (Binance Smart Chain)", icon: "🟡" },
  TRC20: { label: "USDT - TRC20 (Tron)", icon: "🔴" },
  ETH20: { label: "USDT - ERC20 (Ethereum)", icon: "🔷" },
  MATIC20: { label: "USDT - MATIC (Polygon)", icon: "🟣" },
};
