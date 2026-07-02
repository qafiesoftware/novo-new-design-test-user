import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/endpoints";
import type {
  RebateClientsResponse,
  RebateFilters,
  RebateHistoryResponse,
} from "../types/rebates.types";

export async function fetchRebateClients(filters: RebateFilters): Promise<RebateClientsResponse> {
  const res = await api.post<{ data: { response: RebateClientsResponse } }>(
    API_ENDPOINTS.PARTNER_DASHBOARD.GET_REBATES_CLIENT,
    { search: filters.search, mt5acc: filters.mt5acc }
  );
  return res.data.data.response;
}

export async function fetchRebateHistory(filters: RebateFilters): Promise<RebateHistoryResponse> {
  const res = await api.post<{ data: { response: RebateHistoryResponse } }>(
    API_ENDPOINTS.PARTNER_DASHBOARD.GET_REBATES_HISTORY,
    { search: filters.search, mt5acc: filters.mt5acc }
  );
  return res.data.data.response;
}