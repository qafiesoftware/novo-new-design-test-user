export type WithdrawStatus = "idle" | "loading" | "success" | "error";
export type OtpStatus = "idle" | "sending" | "sent" | "error";
export interface BankWithdrawRequest {
  amount: string;
  remark: string;
  otp: string;
}
export interface BankWithdrawResponse {
  status: number;
  result: string;
}
export interface UseBankWithdrawState {
  status: WithdrawStatus;
  errorMessage: string;
  successMessage: string;
  otpSentOnce?: string;
  reset: () => void;
}

export interface UseBankWithdrawActions {
  submitWithdraw: (payload: BankWithdrawRequest) => Promise<void>;
  reset: () => void;
}

export type UseBankWithdrawReturn = UseBankWithdrawState & UseBankWithdrawActions;

// CASH withdrawal types
export interface WithdrawCashRequest {
  amount: string;
  remark: string;
  otp: string;
  deposit_type: "Cash";
}

export interface WithdrawCashApiResponse {
  status: number;
  result: string;
}

export interface UseCashWithdrawState {
  withdrawStatus: WithdrawStatus;
  errorMessage: string;
  successMessage: string;
}

export interface UseCashWithdrawActions {
  submitWithdraw: (payload: WithdrawCashRequest) => Promise<void>;
  reset: () => void;
}

export type UseCashWithdrawReturn = UseCashWithdrawState & UseCashWithdrawActions;

// CRYPTO withdrawal types
export type WithdrawCryptoChain = "bsc" | "tron" | "eth" | "polygon";

export interface WithdrawCryptoRequest {
  chain: WithdrawCryptoChain;
  amount: string;
  walletaddress: string;
  otp: string;
}

export interface WithdrawCryptoApiResponse {
  status: number;
  result: string;
}

export interface UseCryptoWithdrawState {
  withdrawStatus: WithdrawStatus;
  otpStatus: OtpStatus;
  errorMessage: string;
  successMessage: string;
  otpSuccessMessage: string;
  otpErrorMessage: string;
}

export interface UseCryptoWithdrawActions {
  sendOtp: (amount: string) => Promise<void>;
  submitWithdraw: (payload: WithdrawCryptoRequest) => Promise<void>;
  reset: () => void;
}

export type UseCryptoWithdrawReturn = UseCryptoWithdrawState & UseCryptoWithdrawActions;