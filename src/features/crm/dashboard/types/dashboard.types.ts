import { ApiResponse } from "./../../../../types/api.types";
export interface Mt5Account {
  selectgroup: string | number;
  accno: string;
  balance: number;
  equity: number;
  group: string;
  nickname: string;
  leverage: string;
  mainPasswordStatus?: string | number;
  server?: string; // frontend side
  main_password_status: string | number;
}

export interface DashboardUser {
  username: string;
  first_name: string;
  last_name: string;
  debitbalance: number;
  withdrawal: number | string;
  profilestatus: number;
  mt5accounts: Mt5Account[];
  walletbalance: string;
  kyc_status: string;
  mt5accbal: number;
  user_activated_for_ib: string;
}

export type DashboardResponse = ApiResponse<DashboardUser>;

// users data API response
export interface UserData {
  user_id: string;
  user_country: string;
  user_img: string;
  req_date: string;
  user_name: string;
  first_name: string;
  last_name: string;
  user_code: string;
  user_reg_code: string;
  user_mobile: string;
  user_auth_type: string;
  doc_front: string;
  doc_back: string;
  doc_type: string;
  email_verify: string;
  user_bio: string;
  user_reg_date: string;
  logourl: string;
  contryname: string;
  birthdate: string;
  firstname: string;
  lastname: string;
  level2: number;
  level3: number;
}

export type UserResponse = ApiResponse<UserData>;

export interface UserBalanceData {
  user_id: string;
  balance: string;
  debitbal: string;
  creditbal: string;
  currentdate: string;
  mt5accbal: string;
  user_activated_for_ib: string;
  ib_reject_by_admin: string;
  withdraw_pending: string;
  remaining_balance: string;
  totalwithdraw: string;
  total_notification: string;
}
export type UserBalanceDataResponse = ApiResponse<UserBalanceData>;

// graph
export type DurationType = "monthly" | "quarterly" | "annually";

export interface AffiliateProgressItem {
  level: string;
  user_comm: string | number;
}

// ✅ affiliate_progress_new object hai — data array + total_comm_sum
export interface AffiliateProgressNew {
  data: AffiliateProgressItem[];
  total_comm_sum: string | number;
}

export interface StatisticsItem {
  month: string;
  lotsize: string;
  profit: string;
}

export interface MonthlySalesItem {
  symbol: string;
  month: string;
  lotsize: string;
  profit: string;
}

export interface MonthlySalesResponse {
  symbols: string[];
  records: MonthlySalesItem[];
}

export interface AffiliateProgressResponse {
  affiliate_progress_new: AffiliateProgressNew;
  affiliate_progress: AffiliateProgressItem[];
  total_comm_sum: number | string;
  statistics: StatisticsItem[];
  monthly_sales: MonthlySalesResponse;
}
export interface AffiliateProgressPayload {
  duration?: DurationType;
  symbol?: string;
}
