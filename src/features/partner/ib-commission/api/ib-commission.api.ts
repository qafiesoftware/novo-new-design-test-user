import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/endpoints";
import {
  IBCommissionHistory,
  IBCommissionResponse,
  WithdrawCommissionApiResponse,
  WithdrawCommissionPayload,
} from "../types/ib-commission.types";

export async function fetchIBCommission(): Promise<IBCommissionResponse> {
  const res = await api.post<{ data: { response: IBCommissionResponse } }>(
    API_ENDPOINTS.PARTNER_DASHBOARD.GET_IB_COMMISSION
  );
  return res.data.data.response;
}

export async function withdrawIBCommission(
  payload: WithdrawCommissionPayload
): Promise<WithdrawCommissionApiResponse> {
  const res = await api.post<{ data: WithdrawCommissionApiResponse }>(
    API_ENDPOINTS.PARTNER_DASHBOARD.WITHDRAWS_IB_FUNDS_ADD_WALLET,
    payload
  );
  return res.data.data;
}

// get-ib history
export async function fetchIBCommissionHistory(): Promise<IBCommissionHistory[]> {
  const res = await api.post<{ data: { response: IBCommissionHistory[] } }>(
    API_ENDPOINTS.PARTNER_DASHBOARD.GET_IB_ALL_COMMISSION
  );
  return res.data.data.response;
}
