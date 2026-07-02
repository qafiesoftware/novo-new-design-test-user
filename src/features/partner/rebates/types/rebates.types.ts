// Rebate Client
export interface RebateClient {
  user_name: string;
  email: string;
  mt5_id: string;
  rebate_per: string | number;
  tot_lot: number;
  commision: number;
}

export interface RebateClientSummary {
  total_lots: number | string;
  total_commision: number | string;
}
// total_lots
export interface RebateClientsResponse {
  clients_count: number;
  total_commision: number | string;
  total_lots: number | string;
  details: RebateClient[];
  summary?: RebateClientSummary;
}

// Rebate History
export interface RebateHistoryItem {
  user_name: string;
  email: string;
  processed_date: string;
  mt5_id: string;
  tot_lot: number;
  commision: number;
}

export interface RebateHistoryResponse {
  total_lots: number | string;
  total_commision: number | string;
  details: RebateHistoryItem[];
}

// Filters
export interface RebateFilters {
  search: string;
  mt5acc: string;
}
