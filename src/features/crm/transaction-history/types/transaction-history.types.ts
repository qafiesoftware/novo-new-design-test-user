export type TransactionTab = "All" | "Deposit" | "Withdraw" | "Transfer";

export type FetchStatus = "idle" | "loading" | "error";

// ── API Response shapes
export interface AllTransaction {
  Srno: number;
  date: string;
  details: string;
  credit: number;
  debit: number;
  balance: number;
}

export interface DepositTransaction {
  id: number;
  date: string;
  amount: number;
  payment_type: string;
  req_image?: string;
  req_remark?: string;
  note?: string;
  status: string;
}

export interface WithdrawTransaction {
  id: number;
  date: string;
  amount: string;
  withdraw_type: string;
  withdraw_type_details: string;
  status: string;
  remark?: string;
}

export interface TransferTransaction {
  id: number;
  date: string;
  amount: string;
  fromaccno: string;
  toaccno: string;
  note?: string;
}

export type AnyTransaction =
  | AllTransaction
  | DepositTransaction
  | WithdrawTransaction
  | TransferTransaction;

// Unified Transaction for new design tables
export interface Transaction {
  id: number;
  date: string;
  details?: string;
  credit?: number;
  debit?: number;
  balance?: number;
  type?: string;
  req_image?: string;
  note?: string;
  receipt?: string;
  req_remark?: string;
  remark?: string;
  withdraw_type?: string;
  withdraw_type_details?: string;
  payment_type?: string;
  from?: string;
  amount?: number;
  to?: string;
  status?: string;
  // currentPage?: number;
  // rowsPerPage?: number;
}

// Hook state
export interface UseTransactionHistoryState {
  data: Transaction[];
  status: FetchStatus;
  errorMessage: string;
}

export interface UseTransactionHistoryActions {
  fetchData: (tab: TransactionTab, filters: TransactionFilters) => Promise<void>;
}

export interface TransactionFilters {
  selectedAccount?: string;
  startDate?: Date | null;
  endDate?: Date | null;
}

export type UseTransactionHistoryReturn = UseTransactionHistoryState & UseTransactionHistoryActions;
