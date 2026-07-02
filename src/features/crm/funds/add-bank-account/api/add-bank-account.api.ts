import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { AddBankPayload, AddBankResponse, UserBankDetails } from "../types/deposit-funds.types";

export const addUserBankApi = async (payload: AddBankPayload): Promise<AddBankResponse> => {
  const formData = new FormData();
  formData.append("bankname", payload.bankname);
  formData.append("accname", payload.accname);
  formData.append("accno", payload.accno);
  formData.append("ifsc", payload.ifsc.toUpperCase());
  formData.append("iban_number", payload.iban_number ?? "");
  formData.append("bankaddress", payload.bankaddress);

  if (payload.kyc_bank_image) {
    formData.append("kyc_bank_image", payload.kyc_bank_image);
  }

  const response = await api.post(API_ENDPOINTS.CRM.ADD_USER_BANK, formData);
  return response.data?.data || response.data;
};

export const getUserBankDetailsApi = async (): Promise<UserBankDetails> => {
  const response = await api.post(API_ENDPOINTS.CRM.GET_BANK_DETAILS);
  return response.data?.data?.response;
};
