import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/endpoints";
import {
  MT5Account,
  MT5ToMT5Request,
  MT5ToWalletRequest,
  TransferApiResponse,
  TransferTab,
  WalletToMT5Request,
} from "../types/money-transfer.types";

//  Common: MT5 Account List 
export async function fetchMT5Accounts(): Promise<MT5Account[]> {
  const res = await api.post<{
    data: { status: number; response: MT5Account[] };
  }>(API_ENDPOINTS.COMMON.MT5_ACCOUNT_LIST);
  return res.data.data.response;
}

// Tab endpoint map 
const TRANSFER_ENDPOINT_MAP: Record<TransferTab, string> = {
  MT5ToWallet: API_ENDPOINTS.CRM.MT5_TO_WALLET,
  WalletToMT5: API_ENDPOINTS.CRM.WALLET_TO_MT5,
  MT5ToMT5: API_ENDPOINTS.CRM.MT5_TO_MT5_TRANSFER,
};

// Submit transfer (works for all 3 tabs) 
export async function submitTransferApi(
  payload: MT5ToWalletRequest | WalletToMT5Request | MT5ToMT5Request,
  tab: TransferTab
): Promise<TransferApiResponse> {
  const endpoint = TRANSFER_ENDPOINT_MAP[tab];
  const res = await api.post<{ data: TransferApiResponse }>(endpoint, payload);
  return res.data.data;
}