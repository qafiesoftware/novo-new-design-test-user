"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, Download, Loader2 } from "lucide-react";
import { PiFilePdf, PiFileCsv, PiFileXls } from "react-icons/pi";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { useTransactionHistory } from "@/features/crm/transaction-history/hooks/transaction-history.hooks";
import { TAB_HEADERS } from "@/features/crm/transaction-history/data/Data";

import {
  TransactionTab,
  Transaction,
} from "@/features/crm/transaction-history/types/transaction-history.types";
import DepositTable from "./DepositTable";
import WithdrawTable from "./WithdrawTable";
import TransferTable from "./TransferTable";
import { exportCSV, exportPDF, exportXLSX } from "@/utils/exportUtils";
import { useMT5Accounts } from "@/features/crm/money-transfer/hooks/money-transfer.hooks";

//Constants

const TABS: TransactionTab[] = ["All", "Deposit", "Withdraw", "Transfer"];
const ROWS_OPTIONS = [10, 20, 50, 100];

// Date helper
const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const [datePart, timePart] = dateStr.split(" ");
  if (!datePart) return null;
  const [day, month, year] = datePart.split("-").map(Number);
  const [h = 0, m = 0, s = 0] = (timePart ?? "").split(":").map(Number);
  return new Date(year, month - 1, day, h, m, s);
};

//  AllRows — inline component
// currentPage aur rowsPerPage props pass
const AllRows = ({
  rows,
  currentPage,
  rowsPerPage,
}: {
  rows: Transaction[];
  currentPage: number;
  rowsPerPage: number;
}) => (
  <>
    {rows.length === 0 ? (
      <tr>
        <td colSpan={7} className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No transactions found
        </td>
      </tr>
    ) : (
      rows.map((t, i) => (
        <tr
          key={t.id}
          className="divide-x text-center transition hover:bg-blue-50/50 dark:hover:bg-gray-800/50"
        >
          {/* Page offset added */}
          <td className="px-4 py-3">{(currentPage - 1) * rowsPerPage + i + 1}</td>
          <td className="px-4 py-3 whitespace-nowrap">{t.date}</td>
          <td className="px-4 py-3">{t.details ?? "-"}</td>
          <td className="px-4 py-3">{t.credit}</td>
          <td className="px-4 py-3">{t.debit}</td>
          <td className="px-4 py-3">{t.balance}</td>
        </tr>
      ))
    )}
  </>
);
// Main Component
export default function TransactionHistory() {
  const { data, status, errorMessage, fetchData } = useTransactionHistory();
  const { mt5Accounts, isLoading: accountsLoading } = useMT5Accounts();

  const [activeTab, setActiveTab] = useState<TransactionTab>("All"); // all Transaction
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isExportOpen, setExportOpen] = useState(false);
  const [isDateOpen, setDateOpen] = useState(false);

  const [dateRange, setDateRange] = useState([
    {
      startDate: undefined as Date | undefined,
      endDate: undefined as Date | undefined,
      key: "selection",
    },
  ]);

  const startDate = dateRange[0].startDate;
  const endDate = dateRange[0].endDate;

  const exportRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  //  Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false);
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) setDateOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  //  Fetch on tab / account change
  useEffect(() => {
    fetchData(activeTab, { selectedAccount });
    setCurrentPage(1);
  }, [activeTab, selectedAccount]);

  //  Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, startDate, endDate, rowsPerPage]);

  //  Client-side filter
  const filtered = useMemo(() => {
    return data.filter((t) => {
      const matchSearch =
        !searchQuery ||
        t.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.date?.includes(searchQuery) ||
        t.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.to?.toLowerCase().includes(searchQuery.toLowerCase());

      let matchDate = true;
      if (startDate || endDate) {
        const txDate = parseDate(t.date ?? "");
        if (!txDate) return false;
        if (startDate) {
          const s = new Date(startDate);
          s.setHours(0, 0, 0, 0);
          if (txDate < s) matchDate = false;
        }
        if (endDate) {
          const e = new Date(endDate);
          e.setHours(23, 59, 59, 999);
          if (txDate > e) matchDate = false;
        }
      }
      return matchSearch && matchDate;
    });
  }, [data, searchQuery, startDate, endDate]);

  //  Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const currentRows = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  //  Date label
  const dateLabel = useMemo(() => {
    if (!startDate && !endDate) return "";
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    if (startDate && endDate && startDate.getTime() !== endDate.getTime())
      return `${fmt(startDate)} – ${fmt(endDate)}`;
    if (startDate) return fmt(startDate);
    return "";
  }, [startDate, endDate]);

  const isLoading = status === "loading";

  //  Render
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold dark:text-white">Transaction History</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your deposits and withdrawals will appear here.
          </p>
        </div>

        {/* Export dropdown */}
        <div className="relative w-full sm:w-auto" ref={exportRef}>
          <button
            onClick={() => setExportOpen((p) => !p)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-gray-100 sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <Download size={16} /> Export
          </button>
          {isExportOpen && (
            <div className="absolute right-0 left-0 z-20 mt-2 rounded-md border bg-white py-2 text-sm shadow-lg sm:right-0 sm:left-auto sm:w-40 dark:border-slate-700 dark:bg-slate-800">
              {[
                {
                  label: "PDF",
                  icon: <PiFilePdf size={16} />,
                  fn: () => exportPDF(activeTab, filtered),
                },
                {
                  label: "CSV",
                  icon: <PiFileCsv size={16} />,
                  fn: () => exportCSV(activeTab, filtered),
                },
                {
                  label: "Excel",
                  icon: <PiFileXls size={16} />,
                  fn: () => exportXLSX(activeTab, filtered),
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
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Tab buttons */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto sm:col-span-2 lg:col-span-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap ${
                activeTab === tab
                  ? "bg-[#465FFF] text-white"
                  : "bg-gray-100 dark:bg-slate-800 dark:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Account select */}
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <option value="">{accountsLoading ? "Loading..." : "All Accounts"}</option>
          {mt5Accounts.map((acc) => (
            <option key={acc.accno} value={acc.accno}>
              {acc.accno}
            </option>
          ))}
        </select>

        {/* Search */}
        <div className="relative">
          <Search className="absolute top-2.5 left-3 text-gray-400" size={18} />
          <input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-10 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>

        {/* Date range */}
        <div className="relative" ref={dateRef}>
          <input
            readOnly
            onClick={() => setDateOpen((p) => !p)}
            value={dateLabel}
            placeholder="Select date range"
            className="w-full cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          {dateLabel && (
            <button
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

      {/* Error banner */}
      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border dark:border-gray-700">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            <tr className="divide-x divide-gray-200 dark:divide-gray-700">
              {TAB_HEADERS[activeTab]?.map((h) => (
                <th key={h} className="px-4 py-3 text-center font-medium whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-700 dark:divide-gray-700 dark:text-gray-300">
            {isLoading ? (
              <tr>
                <td colSpan={10} className="py-10 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-indigo-500" />
                  <p className="mt-2 text-sm text-slate-500">Loading transactions...</p>
                </td>
              </tr>
            ) : activeTab === "All" ? (
              <AllRows rows={currentRows} currentPage={currentPage} rowsPerPage={rowsPerPage} />
            ) : activeTab === "Deposit" ? (
              <DepositTable
                rows={currentRows}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
              />
            ) : activeTab === "Withdraw" ? (
              <WithdrawTable
                rows={currentRows}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
              />
            ) : (
              <TransferTable
                rows={currentRows}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
              />
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
            {filtered.length > 0
              ? `${(currentPage - 1) * rowsPerPage + 1}–${Math.min(currentPage * rowsPerPage, filtered.length)} of ${filtered.length}`
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
                className={`rounded px-3 py-1 text-sm ${
                  currentPage === page
                    ? "bg-[#465FFF] text-white"
                    : "hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-700"
                }`}
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
