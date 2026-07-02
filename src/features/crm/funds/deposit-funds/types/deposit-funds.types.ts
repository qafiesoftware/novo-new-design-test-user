import { ApiResponse } from "./../../../../../types/api.types";
export interface BankDetail {
  id: string;
  bankname: string;
  accname: string;
  accno: string;
  ifsc: string;
  swiftcode: string;
  iban_number?: string;
}

export type GetBankResponse = BankDetail[];

// Bank Transfer deposit Types
export interface DepositFundsPayload {
  amount: string;
  req_transaction_id: string;
  remark: string;
  deposit_type: string;
  receipt: File | null;
}

export type DepositResponse = ApiResponse<[]>;

// Cash Deposit Types
export interface CashDepositPayload {
  amount: string;
  deposit_type: "Cash";
  remark: string;
}

export type CashDepositResponse = ApiResponse<[]>;

// wallet generate types
export type CryptoNetwork = "BEP20" | "TRC20" | "ETH20" | "MATIC20";

export type DepositStatus = "idle" | "loading" | "success" | "error";
export interface GenerateWalletRequest {
  amount: string;
  network: CryptoNetwork;
}
export interface WalletData {
  walletaddress: string;
  walletscanima: string;
}
export interface GenerateWalletApiResponse {
  status: number;
  response: WalletData;
  result: string;
}
export interface UseCryptoDepositState {
  walletData: WalletData | null;
  status: DepositStatus;
  errorMessage: string;
  successMessage: string;
}
export interface UseCryptoDepositActions {
  generateWallet: (payload: GenerateWalletRequest) => Promise<void>;
  reset: () => void;
}

export type UseCryptoDepositReturn = UseCryptoDepositState & UseCryptoDepositActions;
