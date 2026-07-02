import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/endpoints";
import {
  RawDealNode,
  TradingDeal,
  TradingHistoryApiResponse,
  TradingHistoryFilters,
} from "../types/trading-history.types";

// ── Raw → normalized
function mapDealNode(node: RawDealNode): TradingDeal {
  return {
    Symbol: node.Symbol ?? "",
    Action: node.Action ?? "",
    OpenTime: node.OpenTime ?? node.open_date ?? "",
    CloseTime: node.CloseTime ?? node.close_date ?? "",
    OpenPrice: node.OpenPrice ?? node.open_price ?? "",
    ClosePrice: node.ClosePrice ?? node.close_price ?? "",
    volume: node.volume ?? "",
    Profit: node.Profit ?? "",
    commission: node.commission ?? "",
    swapcharge: node.swapcharge ?? "",
    Order: node.Order ?? node.PositionID ?? "",
    PositionID: node.PositionID ?? node.Order ?? "",
    mt5acc: node.mt5acc ?? node.mt5account ?? "",
  };
}

function formatDateForAPI(date: Date | null): string {
  if (!date) return "";
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
}

// ── Fetch
export async function fetchTradingHistory(filters: TradingHistoryFilters): Promise<TradingDeal[]> {
  const today = new Date();
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(today.getDate() - 3);

  const payload = {
    order_type: filters.orderType,
    mt5account: filters.selectedAccount,
    profitloss: filters.profitLoss,
    fdate: formatDateForAPI(filters.startDate ?? threeDaysAgo),
    edate: formatDateForAPI(filters.endDate ?? today),
  };

  const res = await api.post<{ data: TradingHistoryApiResponse }>(
    API_ENDPOINTS.CRM.GET_ALL_ORDER_REPORT_HISTORY,
    payload
  );

  const data = res.data.data;
  if (data?.status === 200 && Array.isArray(data.response?.record)) {
    return data.response.record.map(mapDealNode);
  }
  return [];
}
