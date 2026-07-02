import { ApiResponse } from "./../../../../types/api.types";
export interface accountListGroup {
  groupid: string;
  groupname: string;
  leverage: string;
}

export type AccountListResponse = ApiResponse<accountListGroup>;

export interface OpenAccount {
  selectgroup: string | number;
  accleverage: string;
  nickname: string;
  mainpassword: string | number;
  investorpassword: string | number;
}

export type OpenAccountPayload = OpenAccount;

export interface OpenAccountResponse {
  data: {
    status: number;
    result: string;
    response: {
      login: string;
      name: string;
      email: string;
      main_password: string;
      group: string;
      leverage: string;
      zip_code: string;
      country: string;
      state: string;
      city: string;
      address: string;
      phone: string;
      phone_password: string;
      investor_password: string;
    };
  };
}

// update MT5 account password:
export interface ChangePasswordPayload {
  passwordtype: "main" | "investor" | "both";
  mt5id: string;
  mainPasswordStatus?: string | number;
  can_change_password?: string | number;
  mainpassword?: string;
  investorpassword?: string;
}

export interface UpdateNicknamePayload {
  mt5id: string;
  nickname: string;
}

export type ChangePasswordResponse = ApiResponse<ChangePasswordPayload>;
export type UpdateNicknameResponse = ApiResponse<[]>;
