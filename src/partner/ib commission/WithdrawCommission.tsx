"use client";

import Image from "next/image";
import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import images2 from "../../../public/images/grid-image/commission.jpg";
import {
  useIBCommission,
  useIBCommissionHistory,
  useWithdrawCommission,
} from "@/features/partner/ib-commission/hooks/ib-commission.hooks";

// Status badge
function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();
  const cls =
    s === "approved"
      ? "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400"
      : s === "rejected"
        ? "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400"
        : s === "pending"
          ? "bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400"
          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";

  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${cls}`}>{status}</span>;
}

// Date formatter
function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), "dd MMM yyyy, hh:mm a");
  } catch {
    return dateStr;
  }
}

// Component
export default function WithdrawCommission() {
  const [amount, setAmount] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { data, isLoading: dataLoading } = useIBCommission();
  const withdraw = useWithdrawCommission();

  const { data: tableData = [], isLoading: dataLoadingHistory } = useIBCommissionHistory();
  const totalCommission = data?.total_ib_commission ?? 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg("Please enter a valid amount.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    if (parsedAmount > totalCommission) {
      setErrorMsg(`Maximum withdrawable amount is $${totalCommission}`);
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    const res = await withdraw.mutateAsync({ amount: parsedAmount });
    if (res.status === 200) {
      setSuccessMsg(res.result || "Withdrawal successful!");
      setAmount("");
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      setErrorMsg(res.result || "Withdrawal failed. Please try again.");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const isSubmitting = withdraw.isPending;

  return (
    <>
      {/* Commission History toggle */}
      <div className="flex justify-center md:justify-end">
        <button
          type="button"
          onClick={() => setShowHistory((p) => !p)}
          className="mt-6 self-start rounded-xl border bg-[#465FFF] px-4 py-2 text-sm text-white transition hover:bg-[#3649e8]"
        >
          {showHistory ? "Hide History" : "Commission History"}
        </button>
      </div>

      {/* Main Card */}
      <div className="flex w-full items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-xl border border-gray-200/30 bg-white shadow-xl md:grid-cols-7 dark:border-white/5 dark:bg-slate-800">
          {/* Left — Withdraw Panel */}
          <div className="col-span-4 flex flex-col justify-center p-5 sm:p-6 md:p-10">
            <h2 className="mb-6 text-xl font-semibold sm:text-2xl text-gray-800 dark:text-white">
              Withdraw Commission
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-6 md:items-center">
              {/* Form */}
              <div className="space-y-4 md:col-span-4">
                {/* Success */}
                <AnimatePresence>
                  {successMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      {successMsg}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error */}
                <AnimatePresence>
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {errorMsg}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Commission Balance */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Commission Balance
                  </label>
                  <input
                    disabled
                    value={dataLoading ? "Loading..." : `$ ${totalCommission.toLocaleString()}`}
                    className="w-full cursor-not-allowed rounded-xl border-none bg-gray-100 px-4 py-3 text-gray-700 dark:bg-white/5 dark:text-gray-300"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Maximum withdrawable:{" "}
                    <span className="font-semibold text-gray-600 dark:text-gray-300">
                      ${totalCommission}
                    </span>
                  </p>
                </div>

                {/* Withdraw Amount */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Withdraw Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || /^\d+(\.\d{0,2})?$/.test(val)) {
                        setAmount(val);
                        setErrorMsg("");
                        setSuccessMsg("");
                      }
                    }}
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                    placeholder="Enter withdraw amount"
                    className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 transition outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !amount || dataLoading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-base text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 md:max-w-sm dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Processing..." : "Withdraw"}
                </button>
              </div>
            </div>
          </div>

          {/* Right — Illustration */}
          <div className="relative col-span-3 hidden md:block">
            <Image
              src={images2}
              alt="Finance dashboard"
              className="h-full w-full object-cover"
              width={500}
              height={600}
            />
          </div>
        </div>
      </div>

      {/* Commission History Table */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-white/10 dark:bg-slate-800"
          >
            <div className="border-b border-gray-200 px-4 py-4 sm:px-6 dark:border-white/10">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                IB Commission History
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100 text-center dark:bg-slate-700 dark:text-gray-300">
                    {["Date", "Amount", "Remark", "Status"].map((h) => (
                      <th
                        key={h}
                        className="border border-gray-300 px-5 py-3 font-medium dark:border-white/10"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataLoadingHistory ? (
                    <tr>
                      <td colSpan={4} className="py-10 text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-indigo-500" />
                      </td>
                    </tr>
                  ) : tableData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        No commission history found.
                      </td>
                    </tr>
                  ) : (
                    tableData.map((row, i) => (
                      <tr
                        key={i}
                        className="text-center transition hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
                      >
                        <td className="border border-gray-300 px-5 py-3 whitespace-nowrap dark:border-white/10 dark:bg-slate-800">
                          {formatDate(row?.date) || "-"}
                        </td>
                        <td className="max-w-[220px] break-words border border-gray-300 px-5 py-3 dark:border-white/10 dark:bg-slate-800">
                          $ {row?.amount || "-"}
                        </td>
                        <td className="max-w-[220px] break-words border border-gray-300 px-5 py-3 dark:border-white/10 dark:bg-slate-800">
                          {row?.remark || "-"}
                        </td>
                        <td className="max-w-[220px] break-words border border-gray-300 px-5 py-3 dark:border-white/10 dark:bg-slate-800">
                          <StatusBadge status={row?.status || "-"} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
