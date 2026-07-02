import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { PartnerDashboardResponse } from "../types/dashboard.types";

export async function fetchPartnerDashboard(): Promise<PartnerDashboardResponse> {
  const res = await api.post<{ data: { response: PartnerDashboardResponse } }>(
    API_ENDPOINTS.PARTNER_DASHBOARD.GET_PARTNER_DASHBOARD
  );
  return res.data.data.response;
}
