import {
  AccountListResponse,
  ChangePasswordPayload,
  ChangePasswordResponse,
  OpenAccountPayload,
  OpenAccountResponse,
  UpdateNicknamePayload,
  UpdateNicknameResponse,
} from "./../types/account.types";
import { API_ENDPOINTS } from "@/constants/endpoints";
import api from "@/lib/axios";

export async function getAccountList(): Promise<AccountListResponse> {
  const response = await api.post(API_ENDPOINTS.CRM.ACC_LIST_GROUP);
  return response.data;
}

export async function openAccount(payload: OpenAccountPayload): Promise<OpenAccountResponse> {
  const body = {
    ...payload,
  };
  const response = await api.post(API_ENDPOINTS.CRM.OPEN_LIVE_ACCOUNT_ADD, body);
  return response.data;
}

// MT5 account password changes:

export async function changePassword(
  
  payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> {
  const response = await api.post(API_ENDPOINTS.CRM.CHANGE_MT5_PASSWORD, payload);
  return response.data;
}

export async function updateNickname(
  payload: UpdateNicknamePayload
): Promise<UpdateNicknameResponse> {
  const response = await api.post(API_ENDPOINTS.CRM.UPDATE_MT5_NICKNAME, payload);
  return response.data;
}
