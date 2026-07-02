export type CommissionStatus = "approved" | "rejected" | "pending";
export interface CommissionHistoryItem {
  date: string;
  amount: string | number;
  remark: string;
  status: CommissionStatus | string;
}
export interface IBCommissionResponse {
  total_ib_commission: number;
  details: CommissionHistoryItem[];
}
export interface WithdrawCommissionPayload {
  amount: number;
}
export interface WithdrawCommissionApiResponse {
  status: number;
  result: string;
}

// IB-history
export interface IBCommissionHistory {
  date: string;
  amount: string | number;
  remark: string;
  status: string;
}
export interface IBCommissionHistoryResponse {
  data: IBCommissionHistory[];
}
