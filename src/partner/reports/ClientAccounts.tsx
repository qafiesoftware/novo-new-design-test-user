"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Users,
  Percent,
  BadgeDollarSign,
  ChevronUp,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { PiFilePdf, PiFileCsv, PiFileXls } from "react-icons/pi";
import { FaFileExport } from "react-icons/fa6";

import { useDebounce } from "@/hooks/useDebounce";
import { useClientAccounts } from "@/features/partner/reports/hooks/reports.hooks";
import { exportAccountsCSV, exportAccountsPDF, exportAccountsXLSX } from "@/utils/exportUtils";
import { ClientAccountReport } from "@/features/partner/reports/types/reports.types";
// import type { ClientAccountReport  } from "./types/reportClient.types";

const ROWS_OPTIONS = [5, 10, 15, 20];

export default function ClientAccount() {
  const [search, setSearch] = useState("");
  const [mt5Query, setMt5Query] = useState("");
  const [level, setLevel] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const [sortField, setSortField] = useState<keyof ClientAccountReport | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const exportRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(search, 500);
  const debouncedMt5 = useDebounce(mt5Query, 500);
  const debouncedLevel = useDebounce(level, 500);

  const { data, isLoading, isFetching } = useClientAccounts({
    search: debouncedSearch,
    mt5acc: debouncedMt5,
    searchby_level: debouncedLevel,
  });

  const details = data?.details ?? [];

  // Sort
  const sorted = useMemo(() => {
    if (!sortField) return details;
    return [...details].sort((a, b) => {
      const av = a[sortField],
        bv = b[sortField];
      return sortOrder === "asc" ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
    });
  }, [details, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const currentRows = sorted.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, debouncedMt5, debouncedLevel, rowsPerPage]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSort = (field: keyof ClientAccountReport) => {
    if (sortField === field) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ field }: { field: keyof ClientAccountReport }) =>
    sortField === field ? (
      sortOrder === "asc" ? (
        <ChevronUp size={14} />
      ) : (
        <ChevronDown size={14} />
      )
    ) : null;

  const isWorking = isLoading || isFetching;

  const COLS: { label: string; key: keyof ClientAccountReport }[] = [
    { label: "User Name", key: "user_name" },
    { label: "Email ID", key: "email" },
    { label: "MT5 ID", key: "mt5_id" },
    { label: "Sign-up date", key: "sign_up_date" },
    { label: "Volume (Lots)", key: "lotsize" },
    { label: "Commission", key: "commision" },
    { label: "Level", key: "level" },
  ];

  return (
    <div className="space-y-6 dark:text-white">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Client Accounts</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
          View your referred users, rebates & commissions in real-time.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-3">
        {[
          { label: "Client Accounts", value: data?.clients_count ?? 0, icon: <Users size={26} /> },
          { label: "Volume (Lots)", value: data?.total_lots ?? 0, icon: <Percent size={26} /> },
          {
            label: "Commission",
            value: data?.total_commision ?? "0.00",
            icon: <BadgeDollarSign size={26} />,
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="group flex items-center justify-between rounded-2xl border bg-white p-5 shadow-md transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
          >
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300">{item.label}</p>
              <h2 className="mt-1 text-2xl font-bold">{item.value}</h2>
            </div>
            <div className="rounded-xl bg-[#465FFF]/10 p-3 text-[#465FFF]">{item.icon}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters + Export */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex w-full flex-wrap gap-3 md:w-auto">
          <div className="relative w-full md:w-64">
            <Search size={18} className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by User or Email"
              className="w-full rounded-xl border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-[#465FFF] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div className="relative w-full md:w-64">
            <Search size={18} className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              value={mt5Query}
              onChange={(e) => setMt5Query(e.target.value)}
              placeholder="Search by MT5 Account"
              className="w-full rounded-xl border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-[#465FFF] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:ring-[#465FFF] md:w-44 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="">Search by Level</option>
            {[1, 2, 3, 4, 5].map((l) => (
              <option key={l} value={String(l)}>
                Level {l}
              </option>
            ))}
          </select>
        </div>
        <div className="relative" ref={exportRef}>
          <button
            onClick={() => setExportOpen((p) => !p)}
            className="flex items-center gap-2 rounded-xl bg-[#465FFF] px-4 py-2 text-sm text-white hover:bg-[#3649e8]"
          >
            <FaFileExport size={18} /> Export
          </button>
          {exportOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 z-20 mt-2 w-40 rounded-md border bg-white py-2 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-800"
            >
              {[
                {
                  label: "PDF",
                  fn: () => exportAccountsPDF(details),
                  icon: <PiFilePdf size={16} />,
                },
                {
                  label: "CSV",
                  fn: () => exportAccountsCSV(details),
                  icon: <PiFileCsv size={16} />,
                },
                {
                  label: "Excel",
                  fn: () => exportAccountsXLSX(details),
                  icon: <PiFileXls size={16} />,
                },
              ].map(({ label, fn, icon }) => (
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
            </motion.div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead className="bg-gray-100 text-center dark:bg-slate-700 dark:text-gray-300">
            <tr>
              {COLS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="cursor-pointer border-r px-5 py-3 font-medium select-none dark:border-slate-600"
                >
                  <div className="flex items-center justify-center gap-1">
                    {col.label} <SortIcon field={col.key} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isWorking ? (
              <tr>
                <td colSpan={7} className="py-10 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-indigo-500" />
                </td>
              </tr>
            ) : currentRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-sm text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              currentRows.map((row, i) => (
                <tr
                  key={`${row.user_id}-${row.mt5_id}-${i}`}
                  className="border-t text-center text-sm hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700"
                >
                  <td className="border-r px-5 py-3 dark:border-slate-700">{row.user_name || "-"}</td>
                  <td className="border-r px-5 py-3 dark:border-slate-700">{row.email || "-"}</td>
                  <td className="border-r px-5 py-3 dark:border-slate-700">{row.mt5_id || "-"}</td>
                  <td className="border-r px-5 py-3 whitespace-nowrap dark:border-slate-700">
                    {row.sign_up_date || "-"}
                  </td>
                  <td className="border-r px-5 py-3 dark:border-slate-700">{row.lotsize || "-"}</td>
                  <td className="border-r px-5 py-3 dark:border-slate-700">
                    {row.commision || "-"}
                  </td>
                  <td className="px-5 py-3">{row.level || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-4 py-2 md:flex-row">
        <div className="flex items-center gap-2 text-sm">
          Rows per page:
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-md border px-2 py-1 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {ROWS_OPTIONS.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
          <span className="text-gray-400">
            {sorted.length > 0
              ? `${(currentPage - 1) * rowsPerPage + 1}–${Math.min(currentPage * rowsPerPage, sorted.length)} of ${sorted.length}`
              : "0 results"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="disabled:opacity-40"
          >
            Prev
          </button>
          {[...Array(Math.min(totalPages, 5))].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`rounded-md px-3 py-1 ${currentPage === i + 1 ? "bg-[#465FFF] text-white" : "hover:bg-gray-100 dark:hover:bg-slate-700"}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
