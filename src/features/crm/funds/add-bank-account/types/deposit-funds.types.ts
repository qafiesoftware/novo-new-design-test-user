import { ApiResponse } from "@/types/api.types";
export interface AddBankPayload {
  bankname: string;
  accname: string;
  accno: string;
  ifsc: string;
  iban_number?: string;
  status: string | number;
  bankaddress: string;
  kyc_bank_image?: File | null;
}

export type AddBankResponse = ApiResponse<AddBankPayload>["data"];
export interface UserBankDetails {
  bankname: string;
  accno: string;
  ifsc: string;
  iban: string;
  kyc_bank_address: string;
  accholder: string;
  status: string;
  image?: string;
}
