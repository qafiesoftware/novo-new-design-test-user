export type FetchStatus = "idle" | "loading" | "error" | "fetching" | "Something went wrong";
export type OrderType = "0" | "1" | "2"; // 0=all, 1=open, 2=close
export type ProfitLossFilter = "" | "profit" | "loss";
export type SortField = "OpenTime" | "CloseTime" | "Profit" | "";
export type SortDirection = "asc" | "desc";

export interface TradingDeal {
  Symbol: string;
  Action: string;
  OpenTime: string;
  CloseTime: string;
  OpenPrice: string;
  ClosePrice: string;
  volume: string;
  Profit: string | number;
  Order: string;
  PositionID: string;
  mt5acc: string;
  commission: string | number;
  swapcharge: string | number;
}

export interface TradingHistoryApiResponse {
  status: number;
   response: {
    total_record: number;
    record: RawDealNode[];
  };
}

export interface RawDealNode {
  Symbol?: string;
  Action?: string;
  OpenTime?: string;
  open_date?: string;
  CloseTime?: string;
  close_date?: string;
  OpenPrice?: string;
  open_price?: string;
  ClosePrice?: string;
  close_price?: string;
  volume?: string;
  Profit?: string | number;
  commission?: string | number;
  swapcharge?: string | number;
  Order?: string;
  PositionID?: string;
  mt5acc?: string;
  mt5account?: string;
}

export interface TradingHistoryFilters {
  selectedAccount: string;
  orderType: OrderType;
  profitLoss: ProfitLossFilter;
  startDate: Date | null;
  endDate: Date | null;
}

export interface UseTradingHistoryState {
  deals: TradingDeal[];
  status: FetchStatus;
  errorMessage: string;
}

export interface UseTradingHistoryActions {
  fetchDeals: (filters: TradingHistoryFilters) => Promise<void>;
}

export type UseTradingHistoryReturn = UseTradingHistoryState & UseTradingHistoryActions;
