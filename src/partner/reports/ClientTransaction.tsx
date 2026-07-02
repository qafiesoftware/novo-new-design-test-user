"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { PiFilePdf, PiFileCsv, PiFileXls } from "react-icons/pi";
import { FaFileExport } from "react-icons/fa6";
import { Users, Percent, BadgeDollarSign, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useClientTransactions } from "@/features/partner/reports/hooks/reports.hooks";
import {
  exportTransactionsCSV,
  exportTransactionsPDF,
  exportTransactionsXLSX,
} from "@/utils/exportUtils";

const ROWS_OPTIONS = [5, 10, 15, 20];
const TABLE_HEADS = ["User Name", "Date", "MT5 ID", "Volume (Lots)", "Commission"];

export default function ClientTransaction() {
  const [search, setSearch] = useState("");
  const [mt5Query, setMt5Query] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const exportRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(search, 500);
  const debouncedMt5 = useDebounce(mt5Query, 500);

  const { data, isLoading, isFetching } = useClientTransactions({
    search: debouncedSearch,
    mt5acc: debouncedMt5,
  });

  const details = data?.details ?? [];
  const totalPages = Math.max(1, Math.ceil(details.length / rowsPerPage));
  const currentRows = details.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, debouncedMt5, rowsPerPage]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isWorking = isLoading || isFetching;

  return (
    <div className="w-full space-y-8 dark:text-white">
      {/* <div>
        <h1 className="text-2xl font-semibold">Client Transactions</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          The report is updated once in 2 hours...
        </p>
      </div> */}

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-3">
        {[
          {
            label: "Total Transactions",
            value: data?.total_transaction ?? 0,
            icon: <Users size={26} />,
          },
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
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
              <h2 className="mt-1 text-2xl font-bold">{item.value}</h2>
            </div>
            <div className="rounded-xl bg-[#465FFF]/10 p-3 text-[#465FFF]">{item.icon}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters + Export */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
          <div className="relative w-full md:w-72">
            <FiSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by User or Email"
              className="w-full rounded-lg border px-10 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div className="relative w-full md:w-72">
            <FiSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              value={mt5Query}
              onChange={(e) => setMt5Query(e.target.value)}
              placeholder="Search by MT5 Account"
              className="w-full rounded-lg border px-10 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
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
                  fn: () => exportTransactionsPDF(details),
                  icon: <PiFilePdf size={16} />,
                },
                {
                  label: "CSV",
                  fn: () => exportTransactionsCSV(details),
                  icon: <PiFileCsv size={16} />,
                },
                {
                  label: "Excel",
                  fn: () => exportTransactionsXLSX(details),
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
      <div className="overflow-auto rounded-md border bg-white dark:border-slate-700 dark:bg-slate-800">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-slate-700">
              {TABLE_HEADS.map((h) => (
                <th
                  key={h}
                  className="border px-4 py-3 text-center font-medium whitespace-nowrap dark:border-slate-600"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isWorking ? (
              <tr>
                <td colSpan={5} className="py-10 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-indigo-500" />
                </td>
              </tr>
            ) : currentRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-sm text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              currentRows.map((row, i) => (
                <tr key={i} className="text-center hover:bg-gray-50 dark:hover:bg-slate-700">
                  <td className="border px-4 py-2 dark:border-slate-700">{row.user_name || "-"}</td>
                  <td className="border px-4 py-2 whitespace-nowrap dark:border-slate-700">
                    {row.date || "-"}
                  </td>
                  <td className="border px-4 py-2 dark:border-slate-700">{row.mt5_id || "-"}</td>
                  <td className="border px-4 py-2 dark:border-slate-700">{row.tot_lot || "-"}</td>
                  <td className="border px-4 py-2 dark:border-slate-700">{row.commision || "-"}</td>
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
            {details.length > 0
              ? `${(currentPage - 1) * rowsPerPage + 1}–${Math.min(currentPage * rowsPerPage, details.length)} of ${details.length}`
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
