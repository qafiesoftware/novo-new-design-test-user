import { API_ENDPOINTS } from "@/constants/endpoints";
import api from "@/lib/axios";
import { LoginPayload, LoginResponse } from "../types/login.types";

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, payload);
  return response.data;
}
