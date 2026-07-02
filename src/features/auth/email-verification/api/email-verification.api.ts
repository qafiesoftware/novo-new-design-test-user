import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/endpoints";
import {
  OtpVerifyPayload,
  OtpVerifyResponse,
  ResendOtpPayload,
  ResendOtpResponse,
} from "../types/emailVerification.types";

export async function verifyOtp(payload: OtpVerifyPayload): Promise<OtpVerifyResponse> {
  const response = await api.post(API_ENDPOINTS.AUTH.REGISTER_OTP_VERIFY, payload);
  return response.data;
}

export async function resendOtp(payload: ResendOtpPayload): Promise<ResendOtpResponse> {
  const response = await api.post(API_ENDPOINTS.AUTH.RESEND_OTP, payload);
  return response.data;
}