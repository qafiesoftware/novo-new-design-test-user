import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/endpoints";

export async function forgotPassword(email: string) {
  const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  return response;
}