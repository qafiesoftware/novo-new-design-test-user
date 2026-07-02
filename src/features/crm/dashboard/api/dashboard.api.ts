import {
  AffiliateProgressPayload,
  AffiliateProgressResponse,
  DashboardResponse,
  UserBalanceDataResponse,
  UserResponse,
} from "./../types/dashboard.types";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/endpoints";

export async function getDashboardStats(): Promise<DashboardResponse> {
  const response = await api.post(API_ENDPOINTS.CRM.GET_DASHBOARD);
  return response.data;
}

export async function getUserData(): Promise<UserResponse> {
  const response = await api.post(API_ENDPOINTS.CRM.GET_USER_DATA);
  return response.data;
}

export async function getUserBalanceData(): Promise<UserBalanceDataResponse> {
  const response = await api.post(API_ENDPOINTS.CRM.USER_BALANCE_DATA);
  return response.data;
}

// Graph

export async function fetchAffiliateProgress(
  payload: AffiliateProgressPayload = {}
): Promise<AffiliateProgressResponse> {
  // Remove empty values
  const cleanedPayload = Object.fromEntries(
    Object.entries(payload).filter(
      ([, value]) => value !== undefined && value !== null && value !== "" && value !== "All"
    )
  );

  const res = await api.post<{
    data: {
      response: AffiliateProgressResponse;
    };
  }>(API_ENDPOINTS.CRM.DASHBOARD_GRAPH, cleanedPayload);
  return res.data.data.response;
}