"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Download, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { PiFilePdf, PiFileCsv, PiFileXls } from "react-icons/pi";
import {
  SortDirection,
  ProfitLossFilter,
  OrderType,
  SortField,
} from "@/features/crm/trading-history/types/trading-history.types";
import { exportTradingCSV, exportTradingPDF, exportTradingXLSX } from "@/utils/exportUtils";
import { useTradingHistory } from "@/features/crm/trading-history/hooks/trading-history.hooks";
import { useMT5Accounts } from "@/features/crm/money-transfer/hooks/money-transfer.hooks";

const DateRange = dynamic(() => import("react-date-range").then((mod) => mod.DateRange), {
  ssr: false,
});

// Constants
const ROWS_OPTIONS = [10, 20, 50, 100];

const TABLE_HEADERS: { label: string; field?: SortField }[] = [
  { label: "Symbol" },
  { label: "Type" },
  { label: "Opening Time", field: "OpenTime" },
  { label: "Closing Time", field: "CloseTime" },
  { label: "Open Price" },
  { label: "Close Price" },
  { label: "Volume" },
  { label: "Profit", field: "Profit" },
  { label: "Order ID" },
  { label: "MT5 ID" },
  { label: "Commission" },
  { label: "Swap Charge" },
];

// Date helpers
function parseDealDate(dateStr: string): Date {
  if (!dateStr) return new Date(0);
  const [datePart, timePart] = dateStr.split(" ");
  const [day, month, year] = datePart.split("-").map(Number);
  const [h = 0, m = 0, s = 0] = (timePart ?? "").split(":").map(Number);
  return new Date(year, month - 1, day, h, m, s);
}

function fmtDateLabel(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// Component
export default function TradingHistory() {
  const { deals, status, errorMessage, fetchDeals } = useTradingHistory();
  const { mt5Accounts, isLoading: accountsLoading } = useMT5Accounts();

  // Filter state
  const [selectedAccount, setSelectedAccount] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("0");
  const [profitLoss, setProfitLoss] = useState<ProfitLossFilter>("");
  const [dateRange, setDateRange] = useState([
    {
      startDate: undefined as Date | undefined,
      endDate: undefined as Date | undefined,
      key: "selection",
    },
  ]);

  // UI state
  const [isExportOpen, setExportOpen] = useState(false);
  const [isDateOpen, setDateOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField>("");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const exportRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  const startDate = dateRange[0].startDate;
  const endDate = dateRange[0].endDate;

  // Close dropdowns outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false);
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) setDateOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchDeals({
      selectedAccount: "",
      orderType: "0",
      profitLoss: "",
      startDate: null,
      endDate: null,
    });
  }, []);

  // Reset page
  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage, sortField, sortDir]);

  // Apply filter
  const handleApply = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setCurrentPage(1);
      fetchDeals({
        selectedAccount,
        orderType,
        profitLoss,
        startDate: startDate ?? null,
        endDate: endDate ?? null,
      });
    },
    [selectedAccount, orderType, profitLoss, startDate, endDate, fetchDeals]
  );

  // Sorting
  const handleSort = (field: SortField) => {
    if (!field) return;
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    if (!sortField) return deals;
    return [...deals].sort((a, b) => {
      let av: number | string, bv: number | string;
      if (sortField === "OpenTime" || sortField === "CloseTime") {
        av = parseDealDate(a[sortField]).getTime();
        bv = parseDealDate(b[sortField]).getTime();
      } else {
        av = Number(a.Profit) || 0;
        bv = Number(b.Profit) || 0;
      }
      return sortDir === "asc" ? (av < bv ? -1 : 1) : av > bv ? -1 : 1;
    });
  }, [deals, sortField, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const currentRows = sorted.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Date label
  const dateLabel = useMemo(() => {
    if (!startDate && !endDate) return "";
    if (startDate && endDate && startDate.getTime() !== endDate.getTime())
      return `${fmtDateLabel(startDate)} – ${fmtDateLabel(endDate)}`;
    if (startDate) return fmtDateLabel(startDate);
    return "";
  }, [startDate, endDate]);

  const isLoading = status === "loading";

  // Sort icon
  const SortIcon = ({ field }: { field: SortField }) => {
    if (!field) return null;
    const active = sortField === field;
    const Icon = active && sortDir === "asc" ? ArrowUp : ArrowDown;
    return (
      <Icon className={`ml-1 inline h-3 w-3 ${active ? "text-indigo-500" : "text-gray-400"}`} />
    );
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-md transition-all sm:p-6 dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Trading History</h2>

        {/* Export */}
        <div className="relative" ref={exportRef}>
          <button
            onClick={() => setExportOpen((p) => !p)}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <Download size={16} /> Export
          </button>
          {isExportOpen && (
            <div className="absolute right-0 z-20 mt-2 w-40 rounded-md border bg-white py-2 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-800">
              {[
                { label: "PDF", icon: <PiFilePdf size={16} />, fn: () => exportTradingPDF(sorted) },
                { label: "CSV", icon: <PiFileCsv size={16} />, fn: () => exportTradingCSV(sorted) },
                {
                  label: "Excel",
                  icon: <PiFileXls size={16} />,
                  fn: () => exportTradingXLSX(sorted),
                },
              ].map(({ label, icon, fn }) => (
                <button
                  key={label}
                  onClick={() => {
                    fn();
                    setExportOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-700"
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <form onSubmit={handleApply}>
        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* MT5 Account */}
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="">{accountsLoading ? "Loading..." : "All Accounts"}</option>
            {mt5Accounts.map((acc) => (
              <option key={acc.accno} value={acc.accno}>
                {acc.accno}
              </option>
            ))}
          </select>

          {/* Order Type */}
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value as OrderType)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="0">All Orders</option>
            <option value="1">Open Orders</option>
            <option value="2">Closed Orders</option>
          </select>

          {/* Profit / Loss */}
          <select
            value={profitLoss}
            onChange={(e) => setProfitLoss(e.target.value as ProfitLossFilter)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="">Profit & Loss</option>
            <option value="profit">Profit</option>
            <option value="loss">Loss</option>
          </select>

          {/* Date Range */}
          <div className="relative" ref={dateRef}>
            <input
              readOnly
              onClick={() => setDateOpen((p) => !p)}
              value={dateLabel}
              placeholder="Select date range"
              className="w-full cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />
            {dateLabel && (
              <button
                type="button"
                onClick={() => {
                  setDateRange([{ startDate: undefined, endDate: undefined, key: "selection" }]);
                  setDateOpen(false);
                }}
                className="absolute top-2.5 right-3 text-gray-400 hover:text-red-500"
              >
                ✕
              </button>
            )}
            {isDateOpen && (
              <div className="absolute right-0 z-30 mt-1 rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
                <DateRange
                  ranges={dateRange.map((r) => ({
                    startDate: r.startDate ?? new Date(),
                    endDate: r.endDate ?? new Date(),
                    key: r.key,
                  }))}
                  onChange={(item: RangeKeyDict) => {
                    const sel = item.selection;
                    setDateRange([
                      {
                        startDate: sel.startDate ?? undefined,
                        endDate: sel.endDate ?? undefined,
                        key: "selection",
                      },
                    ]);
                    if (
                      sel.startDate &&
                      sel.endDate &&
                      sel.startDate.getTime() !== sel.endDate.getTime()
                    ) {
                      setDateOpen(false);
                    }
                  }}
                  maxDate={new Date()}
                  moveRangeOnFirstSelection={false}
                  showDateDisplay={false}
                />
              </div>
            )}
          </div>
        </div>

        {/* Apply button */}
        <div className="mb-5 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? "Loading..." : "Apply Filters"}
          </button>
        </div>
      </form>

      {/* Error */}
      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 dark:text-gray-300">
            <tr className="divide-x divide-gray-200 dark:divide-gray-700">
              {TABLE_HEADERS.map(({ label, field }) => (
                <th
                  key={label}
                  onClick={() => field && handleSort(field)}
                  className={`px-4 py-3 text-center font-medium whitespace-nowrap ${field ? "cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-700" : ""}`}
                >
                  {label}
                  {field && <SortIcon field={field} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 dark:text-gray-300">
            {isLoading ? (
              <tr>
                <td colSpan={12} className="py-10 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-indigo-500" />
                  <p className="mt-2 text-sm text-slate-500">Loading trading history...</p>
                </td>
              </tr>
            ) : currentRows.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
                  className="py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No records found for selected filters
                </td>
              </tr>
            ) : (
              currentRows.map((txn, i) => (
                <tr
                  key={i}
                  className="divide-x divide-gray-200 text-center transition hover:bg-gray-50 dark:divide-gray-700 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-3 font-medium">{txn.Symbol}</td>
                  <td
                    className={`px-4 py-3 font-semibold ${txn.Action === "Buy" ? "text-green-600" : "text-red-600"}`}
                  >
                    {txn.Action}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{txn.OpenTime || "-"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{txn.CloseTime || "-"}</td>
                  <td className="px-4 py-3">{txn.OpenPrice}</td>
                  <td className="px-4 py-3">{txn.ClosePrice || "-"}</td>
                  <td className="px-4 py-3">{txn.volume}</td>
                  <td
                    className={`px-4 py-3 font-semibold ${Number(txn.Profit) >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {txn.Profit}
                  </td>
                  <td className="px-4 py-3">{txn.PositionID || txn.Order}</td>
                  <td className="px-4 py-3">{txn.mt5acc}</td>
                  <td className="px-4 py-3">{txn.commission}</td>
                  <td className="px-4 py-3">{txn.swapcharge}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {ROWS_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="text-slate-400">
            {sorted.length > 0
              ? `${(currentPage - 1) * rowsPerPage + 1}–${Math.min(currentPage * rowsPerPage, sorted.length)} of ${sorted.length}`
              : "0 results"}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="rounded px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-40 dark:text-gray-200 dark:hover:bg-slate-700"
          >
            Prev
          </button>
          {[...Array(Math.min(totalPages, 5))].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded px-3 py-1 text-sm ${currentPage === page ? "bg-indigo-600 text-white" : "hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-700"}`}
              >
                {page}
              </button>
            );
          })}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="rounded px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-40 dark:text-gray-200 dark:hover:bg-slate-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
