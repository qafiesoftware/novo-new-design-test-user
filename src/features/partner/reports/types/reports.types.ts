// Client Report
export interface ReportClient {
  id: string;
  user_name: string;
  email: string;
  status: "Active" | "Inactive";
  rebates: number;
  reward?: number;
}

export interface ReportClientSummary {
  clients_count: number;
  total_lots: number;
  total_commision: number;
}

export interface ReportClientResponse {
  details: ReportClient[];
  clients_count?: number;
  total_lots?: number;
  total_commision?: number;
}

// Client Account
export interface ClientAccountReport {
  user_id: string;
  user_name: string;
  email: string;
  mt5_id: string;
  sign_up_date: string;
  lotsize: number;
  commision: number;
  level: string;
}

export interface ClientAccountResponse {
  details: ClientAccountReport[];
  clients_count: number;
  total_lots: number;
  total_commision: number;
}

// Client Transaction
export interface ClientTransaction {
  user_name: string;
  mt5_id: string;
  date: string;
  tot_lot: number;
  commision: number;
}

export interface ClientTransactionResponse {
  details: ClientTransaction[];
  total_commision: number;
  total_lots: number;
  total_transaction: number;
}

//  Reward History
export interface RewardHistoryItem {
  user_name: string;
  email: string;
  payment_date: string;
  order_in_mt: string;
  partner_code: string;
  country_name: string;
  mt5_id: string;
  account_type: string;
  tot_lot: number;
}

export interface RewardHistoryResponse {
  details: RewardHistoryItem[];
  total_lots: number;
  total_commision: number;
}

//  Common filters
export interface SearchFilters {
  search: string;
  mt5acc: string;
}

export interface ClientAccountFilters extends SearchFilters {
  searchby_level: string;
}