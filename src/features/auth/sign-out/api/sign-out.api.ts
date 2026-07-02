import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/endpoints";

export async function logoutUser(): Promise<void> {
  await api.post(API_ENDPOINTS.AUTH.LOG_OUT);
}