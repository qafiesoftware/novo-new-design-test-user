export type TransferTab = "MT5ToMT5" | "MT5ToWallet" | "WalletToMT5";

export type TransferStatus = "idle" | "loading" | "success" | "error";

//  MT5 Account (common API response)
export interface MT5Account {
  group_name: string;
  amount: number;
  sr_no: number;
  id: string;
  accno: string;
}

// Request payloads
export interface MT5ToWalletRequest {
  mt5accountselect: string;
  amount: string;
  note: string;
  otp: string;
}

export interface WalletToMT5Request {
  mt5accountselect: string;
  amount: string;
  note: string;
  otp: string;
}

export interface MT5ToMT5Request {
  senderid: string; // from
  receiverid: string; // to
  amount: string;
  note: string;
  otp: string;
}

// API response (common shape)
export interface TransferApiResponse {
  status: number;
  result: string;
}

// Hook return
export interface UseTransferState {
  transferStatus: TransferStatus;
  errorMessage: string;
  successMessage: string;
}

export interface UseTransferActions {
  submitTransfer: (
    payload: MT5ToWalletRequest | WalletToMT5Request | MT5ToMT5Request,
    tab: TransferTab
  ) => void;
  reset: () => void;
}

export type UseTransferReturn = UseTransferState & UseTransferActions;

// useMT5Accounts hook return
export interface UseMT5AccountsReturn {
  mt5Accounts: MT5Account[];
  isLoading: boolean;
  error: string;
}
