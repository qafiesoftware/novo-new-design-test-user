import { TradingDeal } from "@/features/crm/trading-history/types/trading-history.types";
import {
  TransactionTab,
  Transaction,
} from "./../features/crm/transaction-history/types/transaction-history.types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { RebateClient, RebateHistoryItem } from "@/features/partner/rebates/types/rebates.types";
import {
  ClientAccountReport,
  ClientTransaction,
  ReportClient,
  RewardHistoryItem,
} from "@/features/partner/reports/types/reports.types";

// Headers per tab
export const TAB_HEADERS: Record<TransactionTab, string[]> = {
  All: ["Sr No.", "Date", "Details", "Credit", "Debit", "Balance"],
  Deposit: ["Sr No.", "Date", "Details", "Credit", "Receipt", "Note", "Status", "Remark"],
  Withdraw: ["Sr No.", "Date", "Amount", "Withdraw Type", "Status", "Remark"],
  Transfer: ["Sr No.", "Date", "Amount", "From", "To", "Note"],
};

// Row extractor per tab

function extractRows(tab: TransactionTab, data: Transaction[]): (string | number)[][] {
  switch (tab) {
    case "All":
      return data.map((t, i) => [
        i + 1,
        t.date ?? "",
        t.details ?? "",
        t.credit ?? "-",
        t.debit ?? "-",
        t.balance ?? "-",
      ]);
    case "Deposit":
      return data.map((t, i) => [
        i + 1,
        t.date ?? "",
        t.details ?? "",
        t.credit ?? "-",
        t.receipt ? "Yes" : "-",
        t.note ?? "-",
        t.status ?? "-",
        t.remark ?? "-",
      ]);
    case "Withdraw":
      return data.map((t, i) => [
        i + 1,
        t.date ?? "",
        t.debit ?? "-",
        t.withdraw_type ?? "-",
        t.status ?? "-",
        t.remark ?? "-",
      ]);
    case "Transfer":
      return data.map((t, i) => [
        i + 1,
        t.date ?? "",
        t.debit ?? "-",
        t.from ?? "-",
        t.to ?? "-",
        t.note ?? "-",
      ]);
    default:
      return [];
  }
}

// Export functions
export function exportCSV(tab: TransactionTab, data: Transaction[]) {
  const headers = TAB_HEADERS[tab];
  const rows = extractRows(tab, data);
  if (!rows.length) return;

  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = `${tab}_history.csv`;
  a.click();
}

export function exportXLSX(tab: TransactionTab, data: Transaction[]) {
  const headers = TAB_HEADERS[tab];
  const rows = extractRows(tab, data);
  if (!rows.length) return;

  const ws = XLSX.utils.json_to_sheet(
    rows.map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i]])))
  );
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, tab);
  XLSX.writeFile(wb, `${tab}_history.xlsx`);
}

export function exportPDF(tab: TransactionTab, data: Transaction[]) {
  const headers = TAB_HEADERS[tab];
  const rows = extractRows(tab, data);
  if (!rows.length) return;

  const doc = new jsPDF();
  doc.text(`${tab} History`, 14, 15);
  autoTable(doc, {
    startY: 20,
    head: [headers],
    body: rows.map((r) => r.map(String)),
  });
  doc.save(`${tab}_history.pdf`);
}

// ============  For trading history ==================

export const TRADING_HEADERS = [
  "Symbol",
  "Type",
  "Opening Time",
  "Closing Time",
  "Open Price",
  "Close Price",
  "Volume",
  "Profit",
  "Order ID",
  "MT5 ID",
  "Commission",
  "Swap Charge",
];

function getRows(deals: TradingDeal[]) {
  return deals.map((d) => [
    d.Symbol,
    d.Action,
    d.OpenTime,
    d.CloseTime,
    d.OpenPrice,
    d.ClosePrice,
    d.volume,
    d.Profit,
    d.PositionID,
    d.mt5acc,
    d.commission,
    d.swapcharge,
  ]);
}

export function exportTradingCSV(deals: TradingDeal[]) {
  const rows = getRows(deals);
  if (!rows.length) return;
  const csv = [TRADING_HEADERS, ...rows].map((r) => r.join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = "Trading_History.csv";
  a.click();
}

export function exportTradingXLSX(deals: TradingDeal[]) {
  const rows = getRows(deals);
  if (!rows.length) return;
  const ws = XLSX.utils.json_to_sheet(
    rows.map((r) => Object.fromEntries(TRADING_HEADERS.map((h, i) => [h, r[i]])))
  );
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Trading History");
  XLSX.writeFile(wb, "Trading_History.xlsx");
}

export function exportTradingPDF(deals: TradingDeal[]) {
  const rows = getRows(deals);
  if (!rows.length) return;
  const doc = new jsPDF("landscape");
  doc.text("Trading History", 14, 15);
  autoTable(doc, {
    startY: 20,
    head: [TRADING_HEADERS],
    body: rows.map((r) => r.map(String)),
    columnStyles: Object.fromEntries(TRADING_HEADERS.map((_, i) => [i, { cellWidth: 22 }])),
  });
  doc.save("Trading_History.pdf");
}

// PARTNER DASHBOARD Client export

const CLIENT_HEADERS = [
  "User Name",
  "Email ID",
  "MT5 ID",
  "Rebate %",
  "Volume (Lots)",
  "Commission",
];

function getClientRows(data: RebateClient[]) {
  return data.map((d) => [
    d.user_name,
    d.email,
    d.mt5_id,
    d.rebate_per,
    d.tot_lot ?? 0,
    d.commision ?? 0,
  ]);
}

// History export
const HISTORY_HEADERS = [
  "User Name",
  "Email ID",
  "Processed Date",
  "MT5 ID",
  "Volume (Lots)",
  "Commission",
];

function getHistoryRows(data: RebateHistoryItem[]) {
  return data.map((d) => [
    d.user_name,
    d.email,
    d.processed_date,
    d.mt5_id,
    d.tot_lot ?? 0,
    d.commision ?? 0,
  ]);
}

// Generic export helpers
function doCSV(headers: string[], rows: (string | number)[][], filename: string) {
  if (!rows.length) return;
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = filename;
  a.click();
}

function doXLSX(headers: string[], rows: (string | number)[][], filename: string, sheet: string) {
  if (!rows.length) return;
  const ws = XLSX.utils.json_to_sheet(
    rows.map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i]])))
  );
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheet);
  XLSX.writeFile(wb, filename);
}

function doPDF(headers: string[], rows: (string | number)[][], title: string, filename: string) {
  if (!rows.length) return;
  const doc = new jsPDF();
  doc.text(title, 14, 15);
  autoTable(doc, { startY: 20, head: [headers], body: rows.map((r) => r.map(String)) });
  doc.save(filename);
}

//  Public API
export const exportClientCSV = (data: RebateClient[]) =>
  doCSV(CLIENT_HEADERS, getClientRows(data), "rebates_clients.csv");
export const exportClientXLSX = (data: RebateClient[]) =>
  doXLSX(CLIENT_HEADERS, getClientRows(data), "rebates_clients.xlsx", "Rebate Clients");
export const exportClientPDF = (data: RebateClient[]) =>
  doPDF(CLIENT_HEADERS, getClientRows(data), "Rebate Clients", "rebates_clients.pdf");

export const exportHistoryCSV = (data: RebateHistoryItem[]) =>
  doCSV(HISTORY_HEADERS, getHistoryRows(data), "rebates_history.csv");
export const exportHistoryXLSX = (data: RebateHistoryItem[]) =>
  doXLSX(HISTORY_HEADERS, getHistoryRows(data), "rebates_history.xlsx", "Rebate History");
export const exportHistoryPDF = (data: RebateHistoryItem[]) =>
  doPDF(HISTORY_HEADERS, getHistoryRows(data), "Rebate History", "rebates_history.pdf");

// ============  For partner dashboard ==================

function doCSVReport(headers: string[], rows: (string | number)[][], filename: string) {
  if (!rows.length) return;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([[headers, ...rows].map((r) => r.join(",")).join("\n")], { type: "text/csv" })
  );
  a.download = filename;
  a.click();
}

function doXLSXReport(
  headers: string[],
  rows: (string | number)[][],
  filename: string,
  sheet: string
) {
  if (!rows.length) return;
  const ws = XLSX.utils.json_to_sheet(
    rows.map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i]])))
  );
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheet);
  XLSX.writeFile(wb, filename);
}

function doPDFReport(
  headers: string[],
  rows: (string | number)[][],
  title: string,
  filename: string,
  landscape = false
) {
  if (!rows.length) return;
  const doc = new jsPDF(landscape ? "landscape" : "portrait");
  doc.text(title, 14, 15);
  autoTable(doc, { startY: 20, head: [headers], body: rows.map((r) => r.map(String)) });
  doc.save(filename);
}

// Report Clients
const RC_H = ["User Name", "Email ID", "Status", "Rebates"];
const rcRows = (d: ReportClient[]) =>
  d.map((r) => [r.user_name, r.email, r.status, r.rebates ?? 0]);

export const exportClientsCSV = (d: ReportClient[]) =>
  doCSVReport(RC_H, rcRows(d), "report_clients.csv");
export const exportClientsXLSX = (d: ReportClient[]) =>
  doXLSXReport(RC_H, rcRows(d), "report_clients.xlsx", "Clients");
export const exportClientsPDF = (d: ReportClient[]) =>
  doPDFReport(RC_H, rcRows(d), "Report Clients", "report_clients.pdf");

//  Client Accounts
const CA_H = [
  "User Name",
  "Email ID",
  "MT5 ID",
  "Sign-up date",
  "Volume (Lots)",
  "Commission",
  "Level",
];

const caRows = (d: ClientAccountReport[]) =>
  d.map((r) => [
    r.user_name,
    r.email,
    r.mt5_id,
    r.sign_up_date,
    r.lotsize ?? 0,
    r.commision ?? 0,
    r.level,
  ]);

export const exportAccountsCSV = (d: ClientAccountReport[]) =>
  doCSVReport(CA_H, caRows(d), "client_accounts.csv");
export const exportAccountsXLSX = (d: ClientAccountReport[]) =>
  doXLSXReport(CA_H, caRows(d), "client_accounts.xlsx", "Accounts");
export const exportAccountsPDF = (d: ClientAccountReport[]) =>
  doPDFReport(CA_H, caRows(d), "Client Accounts", "client_accounts.pdf");

//  Client Transactions
const CT_H = ["User Name", "MT5 ID", "Date", "Volume (Lots)", "Commission"];
const ctRows = (d: ClientTransaction[]) =>
  d.map((r) => [r.user_name, r.mt5_id, r.date, r.tot_lot ?? 0, r.commision ?? 0]);

export const exportTransactionsCSV = (d: ClientTransaction[]) =>
  doCSVReport(CT_H, ctRows(d), "client_transactions.csv");
export const exportTransactionsXLSX = (d: ClientTransaction[]) =>
  doXLSXReport(CT_H, ctRows(d), "client_transactions.xlsx", "Transactions");
export const exportTransactionsPDF = (d: ClientTransaction[]) =>
  doPDFReport(CT_H, ctRows(d), "Client Transactions", "client_transactions.pdf");

//  Reward History
const RH_H = [
  "User Name",
  "Email ID",
  "Payment Date",
  "MT5 Order",
  "Partner Code",
  "Client Country",
  "MT5 ID",
  "Client Account Type",
  "Volume (Lots)",
];
const rhRows = (d: RewardHistoryItem[]) =>
  d.map((r) => [
    r.user_name,
    r.email,
    r.payment_date,
    r.order_in_mt,
    r.partner_code,
    r.country_name,
    r.mt5_id,
    r.account_type,
    r.tot_lot ?? 0,
  ]);

export const exportRewardsCSV = (d: RewardHistoryItem[]) =>
  doCSVReport(RH_H, rhRows(d), "reward_history.csv");
export const exportRewardsXLSX = (d: RewardHistoryItem[]) =>
  doXLSXReport(RH_H, rhRows(d), "reward_history.xlsx", "Rewards");
export const exportRewardsPDF = (d: RewardHistoryItem[]) =>
  doPDFReport(RH_H, rhRows(d), "Reward History", "reward_history.pdf", true);