import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/endpoints";
import {
  AllTransaction,
  DepositTransaction,
  Transaction,
  TransactionTab,
  TransferTransaction,
  WithdrawTransaction,
} from "../types/transaction-history.types";

const ENDPOINT_MAP: Record<TransactionTab, string> = {
  All: API_ENDPOINTS.CRM.GET_ALL_WALLET_HISTORY,
  Deposit: API_ENDPOINTS.CRM.GET_ALL_DEPOSIT_HISTORY,
  Withdraw: API_ENDPOINTS.CRM.GET_ALL_WITHDRAW_HISTORY,
  Transfer: API_ENDPOINTS.CRM.GET_ALL_TRANSFER_HISTORY,
};

export async function fetchTransactionHistory(
  tab: TransactionTab,
  mt5account: string = ""
): Promise<Transaction[]> {
  const endpoint = ENDPOINT_MAP[tab];
  const res = await api.post<{ data: { status: number; response: unknown[] } }>(endpoint, {
    mt5account,
  });

  const raw = res.data.data.response;
  if (!raw?.length) return [];

  // Normalize each tab's response to unified Transaction shape
  switch (tab) {
    case "All":
      return (raw as AllTransaction[]).map((t, i) => ({
        id: t.Srno ?? i,
        date: t.date,
        details: t.details,
        credit: Number(t.credit) || 0,
        debit: Number(t.debit) || 0,
        balance: Number(t.balance) || 0,
      }));

    case "Deposit":
      return (raw as DepositTransaction[]).map((t, i) => ({
        id: t.id ?? i,
        date: t.date,
        amount: t.amount,
        payment_type: t.payment_type,
        req_image: t.req_image,
        note: t.note,
        req_remark: t.req_remark,
        status: t.status,
      }));

    case "Withdraw":
      return (raw as WithdrawTransaction[]).map((t, i) => ({
        id: t.id ?? i,
        date: t.date,
        amount: Number(t.amount) || 0,
        withdraw_type: t.withdraw_type,
        withdraw_type_details:t.withdraw_type_details,
        status: t.status,
        remark: t.remark,
      }));

    case "Transfer":
      return (raw as TransferTransaction[]).map((t, i) => ({
        id: t.id ?? i,
        date: t.date,
        debit: Number(t.amount) || 0,
        from: t.fromaccno,
        to: t.toaccno,
        note: t.note,
      }));

    default:
      return [];
  }
}
