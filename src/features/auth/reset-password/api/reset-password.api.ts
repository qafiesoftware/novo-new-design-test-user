import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/endpoints";

interface ResetPasswordPayload {
  password: string;
  confirmpassword: string;
  token: string;
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload);
  return response;
}