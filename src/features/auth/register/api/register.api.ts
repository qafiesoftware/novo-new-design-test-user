import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { CountryListResponse, RegisterPayload, RegisterResponse } from "../types/register.types";

export async function getCountries(): Promise<CountryListResponse> {
  const response = await api.get(API_ENDPOINTS.COMMON.COUNTRIES);
  return response.data;
}

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const body = {
    ...payload,
    cpassword: payload.password,
  };
  const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, body);
  return response.data;
}