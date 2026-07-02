"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Users, Percent, BadgeDollarSign, Loader2 } from "lucide-react";
import { PiFilePdf, PiFileCsv, PiFileXls } from "react-icons/pi";
import { FaFileExport } from "react-icons/fa6";
import { useDebounce } from "@/hooks/useDebounce";
import { useReportClients } from "@/features/partner/reports/hooks/reports.hooks";
import { exportClientsCSV, exportClientsPDF, exportClientsXLSX } from "@/utils/exportUtils";

export default function Clients() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(search, 500);
  const { data, isLoading, isFetching } = useReportClients();

  // Client-side filter (search + status) — API takes no filters for this endpoint
  const filtered = useMemo(() => {
    let list = data?.details ?? [];
    if (debouncedSearch) {
      list = list.filter(
        (r) =>
          r.user_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          r.email.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }
    if (statusFilter && statusFilter !== "All") {
      list = list.filter((r) => r.status === statusFilter);
    }
    return list;
  }, [data, debouncedSearch, statusFilter]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isWorking = isLoading || isFetching;

  return (
    <div className="space-y-6 dark:text-white">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clients</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
          View your referred users, rebates & commissions in real-time.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-3">
        {[
          { label: "Total Clients", value: data?.clients_count ?? 0, icon: <Users size={26} /> },
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
          <div className="relative w-full md:w-72">
            <Search size={18} className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by User or Email"
              className="w-full rounded-xl border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-[#465FFF] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:ring-[#465FFF] md:w-40 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
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
                  icon: <PiFilePdf size={16} />,
                  fn: () => exportClientsPDF(filtered),
                },
                {
                  label: "CSV",
                  icon: <PiFileCsv size={16} />,
                  fn: () => exportClientsCSV(filtered),
                },
                {
                  label: "Excel",
                  icon: <PiFileXls size={16} />,
                  fn: () => exportClientsXLSX(filtered),
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
            </motion.div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <table className="w-full min-w-max border-collapse text-sm">
          <thead className="border-b bg-[#465FFF]/5 text-center text-gray-700 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-300">
            <tr>
              {["Sr.No", "User Name", "Email ID", "Status", "Rebates"].map((h) => (
                <th key={h} className="border-r px-5 py-3 font-medium dark:border-slate-600">
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
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-sm text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => (
                <tr
                  key={row.id ?? i}
                  className="border-t text-center text-sm transition hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700"
                >
                  <td className="border-r px-5 py-3 dark:border-slate-700">{i + 1}</td>
                  <td className="border-r px-5 py-3 whitespace-nowrap dark:border-slate-700">
                    {row.user_name || "-"}
                  </td>
                  <td className="border-r px-5 py-3 whitespace-nowrap dark:border-slate-700">
                    {row.email || "-"}
                  </td>
                  <td className="border-r px-5 py-3 dark:border-slate-700">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${row.status === "Active" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200" : "bg-gray-200 text-gray-600 dark:bg-slate-600 dark:text-gray-200"}`}
                    >
                      {row.status || "-"}
                    </span>
                  </td>
                  <td className="px-5 py-3">{row.rebates || "0"} USD</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
