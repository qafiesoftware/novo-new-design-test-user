import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/endpoints";
import {
  ClientAccountFilters,
  ClientAccountResponse,
  ReportClientResponse,
  SearchFilters,
  RewardHistoryResponse,
  ClientTransactionResponse,
} from "../types/reports.types";

export async function fetchReportClients(): Promise<ReportClientResponse> {
  const payload = {
    search: "",
  };

  const res = await api.post(API_ENDPOINTS.PARTNER_DASHBOARD.GET_REPORT_CLIENTS, payload);
  return res.data.data.response;
}

export async function fetchClientAccounts(
  filters: ClientAccountFilters
): Promise<ClientAccountResponse> {
  const res = await api.post<{ data: { response: ClientAccountResponse } }>(
    API_ENDPOINTS.PARTNER_DASHBOARD.GET_CLIENT_ACCOUNTS,
    filters
  );
  return res.data.data.response;
}

export async function fetchClientTransactions(
  filters: SearchFilters
): Promise<ClientTransactionResponse> {
  const res = await api.post<{ data: { response: ClientTransactionResponse } }>(
    API_ENDPOINTS.PARTNER_DASHBOARD.GET_REPORT_CLIENT_TRANSACTION,
    filters
  );
  return res.data.data.response;
}

export async function fetchRewardHistory(filters: SearchFilters): Promise<RewardHistoryResponse> {
  const res = await api.post<{ data: { response: RewardHistoryResponse } }>(
    API_ENDPOINTS.PARTNER_DASHBOARD.GET_REPORT_REWARD_HISTORY,
    filters
  );
  return res.data.data.response;
}
