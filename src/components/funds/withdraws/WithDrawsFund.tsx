"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Filter } from "lucide-react";
import type { Account } from "@/common/types/account";

type AccountType = {
  id: string;
  name: string;
  category: "Deposit" | "Crypto" | "Coming Soon";
  subtype: "cash" | "bank" | "crypto" | "coming";
  status?: "Active" | "Inactive";
  currency: string;
  fees: string;
  limits: string;
  lastActivity: string;
  icon: string;
  balance: string;
};

type ActiveFormType = {
  type: "cash" | "bank" | "crypto";
  account: Account;
} | null;

const CashDepositForm = dynamic(() => import("./CashWithDrawsForm"), { ssr: false });
const BankDepositForm = dynamic(() => import("./BankWithdrawsForm"), { ssr: false });
const CryptoDepositForm = dynamic(() => import("./CryptoWithDrawsForm"), { ssr: false });

export default function WithDrawsFund() {
  const [activeForm, setActiveForm] = useState<ActiveFormType>(null);
  const [filter, setFilter] = useState<string>("All");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // CLICK OUTSIDE
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Accounts
  const accounts: AccountType[] = [
    {
      id: "bank-transfer",
      name: "Bank Transfer",
      category: "Deposit",
      subtype: "bank",
      status: "Active",
      currency: "USD",
      fees: "0%",
      limits: "$10 - $1000",
      lastActivity: "2h ago",
      icon: "🏦",
      balance: "$5,000",
    },
    {
      id: "cash",
      name: "Cash",
      category: "Deposit",
      subtype: "cash",
      status: "Active",
      currency: "USD",
      fees: "0%",
      limits: "$10 - $1,000",
      lastActivity: "2h ago",
      icon: "💵",
      balance: "$1,000",
    },
    {
      id: "usdt-bep20",
      name: "USDT - BEP20",
      category: "Crypto",
      subtype: "crypto",
      status: "Active",
      currency: "USDT",
      fees: "0%",
      limits: "$10 - $1,000",
      lastActivity: "2h ago",
      icon: "🪙",
      balance: "$10,000",
    },
    {
      id: "usdt-trc20",
      name: "USDT - TRC20",
      category: "Crypto",
      subtype: "crypto",
      status: "Active",
      currency: "USDT",
      fees: "0%",
      limits: "$10 - $1,000",
      lastActivity: "2h ago",
      icon: "🔗",
      balance: "$5,000",
    },
    {
      id: "usdt-eth20",
      name: "USDT - ETH20",
      category: "Crypto",
      subtype: "crypto",
      status: "Active",
      currency: "USDT",
      fees: "0%",
      limits: "$10 - $1,000",
      lastActivity: "2h ago",
      icon: "🪙",
      balance: "$2,500",
    },
    {
      id: "usdt-matic20",
      name: "USDT - MATIC20",
      category: "Crypto",
      subtype: "crypto",
      status: "Active",
      currency: "USDT",
      fees: "0%",
      limits: "$10 - $1,000",
      lastActivity: "2h ago",
      icon: "🔗",
      balance: "$1,000",
    },
    {
      id: "binance-pay",
      name: "Binance Pay",
      category: "Coming Soon",
      subtype: "coming",
      currency: "—",
      fees: "0%",
      limits: "$10 - $1,000",
      lastActivity: "-",
      icon: "⚡",
      balance: "$0",
    },
    {
      id: "neteller",
      name: "Neteller",
      category: "Coming Soon",
      subtype: "coming",
      currency: "—",
      fees: "0%",
      limits: "$10 - $1,000",
      lastActivity: "-",
      icon: "🌐",
      balance: "$0",
    },
  ];

  const filteredAccounts =
    filter === "All" ? accounts : accounts.filter((a) => a.category === filter);

  // Handle click on card
  const handleDepositClick = (account: AccountType) => {
    if (account.subtype === "coming") return;

    if (account.subtype === "cash") {
      setActiveForm({ type: "cash", account });
    } else if (account.subtype === "bank") {
      setActiveForm({ type: "bank", account });
    } else if (account.subtype === "crypto") {
      setActiveForm({ type: "crypto", account });
    }
  };

  const handleBack = () => setActiveForm(null);

  // Motion variants
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
                  All Accounts (Withdraw)
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Withdraw your funds from following methods
                </p>
              </div>

              {/* Filter */}
              {/* Filter */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown((s) => !s)}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
                      className="absolute right-0 z-30 mt-2 w-44 rounded-lg border bg-white dark:border-gray-700 dark:bg-slate-800"
                    >
                      {["All", "Deposit", "Crypto", "Coming Soon"].map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setFilter(t);
                            setShowDropdown(false);
                          }}
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:text-gray-200 dark:hover:bg-slate-700"
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
                  className={`relative rounded-2xl border p-5 shadow-sm transition-all dark:border-gray-700 dark:bg-slate-800 ${
                    acc.status !== "Active" ? "cursor-not-allowed opacity-70" : ""
                  }`}
                >
                  <div className="absolute top-0 left-0 h-full w-2 rounded-l-2xl bg-gradient-to-b from-indigo-400 to-violet-500 opacity-80" />

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/30 text-2xl shadow-sm backdrop-blur-sm">
                        {acc.icon}
                      </div>
                      <h3 className="text-sm font-semibold dark:text-white">{acc.name}</h3>
                    </div>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700 dark:bg-green-900 dark:text-green-300">
                      {acc.status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <div className="dark:text-gray-200">Fees: {acc.fees}</div>
                    <div className="dark:text-gray-200">Limits: {acc.limits}</div>
                  </div>

                  <div className="flex justify-between">
                    <p className="mt-1 text-xs dark:text-gray-200">Processing time: Instant</p>
                    <button
                      onClick={() => handleDepositClick(acc)}
                      disabled={acc.status !== "Active"}
                      className="mt-4 rounded-md bg-indigo-600 px-3 py-2 text-sm text-white"
                    >
                      {acc.status === "Active" ? "Withdraw" : "Unavailable"}
                    </button>
                  </div>

                  {acc.subtype === "coming" && (
                    <div className="absolute top-2 right-2 rounded-md bg-indigo-600 px-3 py-1 text-[10px] text-white">
                      Coming Soon
                    </div>
                  )}
                </motion.article>
              ))}
            </div>
          </motion.div>
        ) : (
          // FORM VIEW
          <motion.div
            key="form"
            initial="initial"
            animate="enter"
            exit="exit"
            variants={panelVariants}
            transition={{ duration: 0.22 }}
          >
            <AnimatePresence mode="wait">
              {activeForm?.type === "cash" && (
                <motion.div key="cash">
                  <CashDepositForm account={activeForm.account} onBack={handleBack} />
                </motion.div>
              )}

              {activeForm?.type === "bank" && (
                <motion.div key="bank">
                  <BankDepositForm account={activeForm.account} onBack={handleBack} />
                </motion.div>
              )}

              {activeForm?.type === "crypto" && (
                <motion.div key="crypto">
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
