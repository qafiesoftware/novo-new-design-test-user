"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Filter } from "lucide-react";
import type { Account } from "@/common/types/account";
import { CryptoNetwork } from "@/features/crm/funds/deposit-funds/types/deposit-funds.types";

// Lazy load forms (improve initial load)
const CashDepositForm = dynamic(() => import("./CashDepositForm"), { ssr: false });
const BankDepositForm = dynamic(() => import("./BankDepositForm"), { ssr: false });
const CryptoDepositForm = dynamic(() => import("./CryptoDepositForm"), { ssr: false });

// ActiveForm type
type ActiveForm =
  | { type: "cash"; account: Account }
  | { type: "bank"; account: Account }
  | { type: "crypto"; account: Account & { network: CryptoNetwork } }
  | null;

export default function DepositPanel() {
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);
  const [filter, setFilter] = useState<"All" | "Deposit" | "Crypto" | "Coming Soon">("All");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // CLICK OUTSIDE -> close dropdown
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Sample accounts (UI-only)
  const accounts: Account[] = [
    {
      id: "bank-transfer",
      name: "Bank Transfer",
      category: "Deposit",
      subtype: "bank",
      status: "Active",
      balance: "12,450.00",
      currency: "USD",
      fees: "0%",
      limits: "$10 - $1000",
      lastActivity: "2h ago",
      icon: "🏦",
    },
    {
      id: "cash",
      name: "Cash",
      category: "Deposit",
      subtype: "cash",
      status: "Active",
      balance: "--",
      currency: "USD",
      fees: "0%",
      limits: "$10 - $1,000",
      lastActivity: "2h ago",
      icon: "💵",
    },
    {
      id: "usdt-bep20",
      name: "USDT - BEP20",
      category: "Crypto",
      subtype: "crypto",
      status: "Active",
      balance: "3,200.12",
      currency: "USDT",
      fees: "0%",
      limits: "$10 - $1,000",
      lastActivity: "2h ago",
      icon: "🪙",
      network: "BEP20",
    },
    {
      id: "usdt-trc20",
      name: "USDT - TRC20",
      category: "Crypto",
      subtype: "crypto",
      status: "Active",
      balance: "0.00",
      currency: "USDT",
      fees: "0%",
      limits: "$10 - $1,000",
      lastActivity: "2h ago",
      icon: "🔗",
      network: "TRC20",
    },
    {
      id: "usdt-eth20",
      name: "USDT - ETH20",
      category: "Crypto",
      subtype: "crypto",
      status: "Active",
      balance: "0.00",
      currency: "USDT",
      fees: "0%",
      limits: "$10 - $1,000",
      lastActivity: "2h ago",
      icon: "🔗",
      network: "ETH20",
    },

    {
      id: "usdt-matic20",
      name: "USDT - MATIC20",
      category: "Crypto",
      subtype: "crypto",
      status: "Active",
      balance: "0.00",
      currency: "USDT",
      fees: "0%",
      limits: "$10 - $1,000",
      lastActivity: "2h ago",
      icon: "🔗",
      network: "MATIC20",
    },

    {
      id: "binance-pay",
      name: "Binance Pay",
      category: "Coming Soon",
      subtype: "coming",
      status: "",
      balance: "--",
      currency: "—",
      fees: "0%",
      limits: "$10 - $1,000",
      lastActivity: "-",
      icon: "⚡",
    },
  ];

  const filteredAccounts =
    filter === "All" ? accounts : accounts.filter((a) => a.category === filter);

  const handleDepositClick = (account: Account) => {
    if (account.subtype === "coming") return;

    if (account.subtype === "cash") setActiveForm({ type: "cash", account });
    else if (account.subtype === "bank") setActiveForm({ type: "bank", account });
    else if (account.subtype === "crypto" && account.network) {
      setActiveForm({
        type: "crypto",
        account: account as Account & { network: CryptoNetwork },
      });
    } else setActiveForm(null);
  };

  const handleBack = () => setActiveForm(null);

  const panelVariants = {
    initial: { opacity: 0, y: 8 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  return (
    <div className="rounded-2xl bg-gray-50 p-5 transition-all md:p-8 dark:bg-slate-900">
      <AnimatePresence mode="wait">
        {!activeForm ? (
          <motion.div
            key="list"
            initial="initial"
            animate="enter"
            exit="exit"
            variants={panelVariants}
            transition={{ duration: 0.22 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  All Accounts
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  View and manage all your available accounts
                </p>
              </div>

              {/* Filter */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown((s) => !s)}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <Filter className="h-4 w-4" />
                  Filter: {filter}
                </button>
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.16 }}
                      className="absolute right-0 z-30 mt-2 w-44 origin-top-right rounded-lg border border-slate-100 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
                    >
                      {["All", "Deposit", "Crypto", "Coming Soon"].map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setFilter(t as "All" | "Deposit" | "Crypto" | "Coming Soon");
                            setShowDropdown(false);
                          }}
                          className={`block w-full px-4 py-2 text-left text-sm ${
                            filter === t
                              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                              : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/40"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAccounts.map((acc) => (
                <motion.article
                  key={acc.id}
                  whileHover={{ scale: acc.status === "Active" ? 1.02 : 1 }}
                  className={`relative rounded-2xl border p-5 shadow-sm transition-all ${
                    acc.status !== "Active"
                      ? "cursor-not-allowed bg-slate-50 opacity-70 dark:bg-slate-800/40"
                      : "bg-white dark:bg-slate-800"
                  }`}
                >
                  {/* Left accent bar */}
                  <div className="absolute top-0 left-0 h-full w-2 rounded-l-2xl bg-gradient-to-b from-indigo-400 to-violet-500 opacity-80" />
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/30 text-2xl shadow-sm backdrop-blur-sm">
                        <span aria-hidden>{acc.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {acc.name}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                          acc.status === "Active"
                            ? "bg-green-100/60 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {acc.status}
                      </span>
                    </div>
                  </div>
                  {/* Balance & meta */}
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div>Fees: {acc.fees}</div>
                    <div>Limits: {acc.limits}</div>
                  </div>
                  {/* Buttons */}
                  <div className="flex justify-between">
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Processing time: Instant (30 mins)
                    </p>
                    <div className="mt-4">
                      <button
                        onClick={() => handleDepositClick(acc)}
                        disabled={acc.status !== "Active"}
                        className={`rounded-md px-3 py-2 text-sm font-medium shadow-sm transition-all ${
                          acc.status === "Active"
                            ? "bg-gradient-to-r from-indigo-600 to-violet-500 text-white hover:brightness-95"
                            : "cursor-not-allowed border border-dashed border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-500"
                        }`}
                      >
                        {acc.status === "Active" ? "Deposit" : "Unavailable"}
                      </button>
                    </div>
                  </div>

                  {/* Coming soon badge overlay */}
                  {acc.subtype === "coming" && (
                    <div className="pointer-events-none absolute top-2 right-2 rounded-md bg-gradient-to-r from-indigo-600 to-violet-500 px-3 py-1 text-[10px] font-semibold text-white shadow">
                      Coming Soon
                    </div>
                  )}
                </motion.article>
              ))}
            </div>
          </motion.div>
        ) : (
          // Form view (Cash / Bank / Crypto)
          <motion.div
            key="form"
            initial="initial"
            animate="enter"
            exit="exit"
            variants={panelVariants}
            transition={{ duration: 0.22 }}
            className=""
          >
            <AnimatePresence mode="wait">
              {activeForm?.type === "cash" && (
                <motion.div
                  key="cash"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                >
                  <CashDepositForm account={activeForm.account} onBack={handleBack} />
                </motion.div>
              )}
              {activeForm?.type === "bank" && (
                <motion.div
                  key="bank"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                >
                  <BankDepositForm account={activeForm.account} onBack={handleBack} />
                </motion.div>
              )}
              {activeForm?.type === "crypto" && (
                <motion.div
                  key="crypto"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                >
                  <CryptoDepositForm account={activeForm.account} onBack={handleBack} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
