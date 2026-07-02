"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Types
interface AccountType {
  status: string;
  title: string;
  type: "crypto" | "bank" | "cash" | string;
  typeLabel: string;
  balance: number | string;
  id: string | number;
  currency: string;
  createdAt: string;
}

interface DepositCardProps {
  account: AccountType;
  onDeposit: (type: string) => void;
}

// Component
export default function DepositCard({ account, onDeposit }: DepositCardProps) {
  const isComingSoon = account.status === "coming-soon";

  return (
    <motion.div
      className={`relative rounded-2xl border p-6 transition-all ${
        isComingSoon
          ? "cursor-not-allowed border-slate-300 bg-slate-100 opacity-70 dark:border-slate-700 dark:bg-slate-800"
          : "border-slate-200 bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
      }`}
    >
      {/* Left Accent Stripe */}
      {isComingSoon && (
        <div className="absolute top-0 left-0 h-full w-[3px] rounded-l-2xl bg-indigo-500" />
      )}

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{account.title}</h3>

        {/* Badge */}
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            isComingSoon
              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-600/30 dark:text-indigo-300"
              : account.type === "crypto"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                : account.type === "bank"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : account.type === "cash"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          {isComingSoon ? "Coming Soon" : account.typeLabel}
        </span>
      </div>

      {/* Balance */}
      <div className="mb-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">Wallet Balance</p>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          ${account.balance}
        </h2>
      </div>

      {/* Details */}
      <div className="mb-5 space-y-1 text-sm text-slate-600 dark:text-slate-300">
        <p>
          <span className="font-medium">Account ID:</span> {account.id}
        </p>
        <p>
          <span className="font-medium">Currency:</span> {account.currency}
        </p>
        <p>
          <span className="font-medium">Created On:</span> {account.createdAt}
        </p>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={() => !isComingSoon && onDeposit(account.type)}
          disabled={isComingSoon}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
            isComingSoon
              ? "cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
              : "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
          }`}
        >
          {isComingSoon ? "Unavailable" : "Deposit"}
          {!isComingSoon && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </motion.div>
  );
}
