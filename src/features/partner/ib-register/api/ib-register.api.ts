import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { BecomePartnerPayload, BecomePartnerResponse } from "../types/ib-register.types";

export async function becomePartnerAPI(
  payload: BecomePartnerPayload
): Promise<BecomePartnerResponse> {
  const res = await api.post(API_ENDPOINTS.PARTNER_DASHBOARD.IB_REGISTER, payload);

  return res.data.data;
}
