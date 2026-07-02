import {
  EkycPayload,
  EkycResponse,
  UpdatePasswordPayload,
  UpdatePasswordResponse,
  UpdateProfilePayload,
  UpdateProfileResponse,
  UserProfileResponse,
} from "./../types/user-profile.types";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/endpoints";

export async function getKyc(): Promise<EkycResponse> {
  const response = await api.post(API_ENDPOINTS.CRM.GET_KYC);
  return response.data;
}

export async function submitEkyc(payload: EkycPayload): Promise<EkycResponse> {
  const formData = new FormData();
  formData.append("doc_type", payload.doc_type);
  formData.append("doc_number", payload.doc_number ?? "");
  formData.append("doc_type2", payload.doc_type2);
  formData.append("doc_number2", payload.doc_number2 ?? "");
  if (payload.doc_front) formData.append("doc_front", payload.doc_front);
  if (payload.doc_back) formData.append("doc_back", payload.doc_back);
  if (payload.doc_front2) formData.append("doc_front2", payload.doc_front2);
  if (payload.doc_back2) formData.append("doc_back2", payload.doc_back2);

  const response = await api.post(API_ENDPOINTS.CRM.EKYC, formData);
  return response.data;
}

// update profile

export async function getUserProfile(): Promise<UserProfileResponse> {
  const response = await api.post(API_ENDPOINTS.CRM.GET_USER_DATA);
  return response.data;
}

export async function updateUserProfile(
  payload: UpdateProfilePayload
): Promise<UpdateProfileResponse> {
  const formData = new FormData();

  formData.append("first_name", payload.first_name);
  formData.append("last_name", payload.last_name);
  formData.append("dob", payload.dob);
  formData.append("bio", payload.bio);
  formData.append("mobileno", payload.mobileno?.toString() ?? "");

  if (payload.user_img) {
    formData.append("user_img", payload.user_img);
  }

  const response = await api.post(API_ENDPOINTS.CRM.UPDATE_USER, formData);

  return response.data;
}

// password-update:

export async function updateUserPassword(
  payload: UpdatePasswordPayload
): Promise<UpdatePasswordResponse> {
  const response = await api.post(API_ENDPOINTS.CRM.CHANGE_LOGINPASSWORD, {
    currentpassword: payload.current_password,
    password: payload.new_password,
    confirmpassword: payload.confirm_password,
  });

  return response.data;
}
