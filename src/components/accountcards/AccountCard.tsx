"use client";

import React from "react";
import Link from "next/link";
import { FaChartLine, FaArrowCircleDown, FaArrowCircleUp } from "react-icons/fa";
import { Mt5Account } from "@/features/crm/dashboard/types/dashboard.types";

interface AccountCardProps {
  account: Mt5Account;
}

const AccountCard = ({ account }: AccountCardProps) => {
  return (
    <div className="col-span-6 cursor-default rounded-2xl border border-gray-100 bg-white/90 p-6 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-xl lg:col-span-6 dark:border-gray-700 dark:bg-white/[0.04]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-md px-3 py-1 text-xs font-semibold ${
              account.group !== "Demo"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {account.group !== "Demo" ? "Real" : "Demo"}
          </span>

          <span className="rounded-md bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
            {account.group}
          </span>

          <span className="text-sm font-medium text-gray-500">#{account.accno}</span>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {/* External Link */}
          <a
            href="https://webtrading.novotrend.co/terminal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-blue-500 px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-[#52a9ff] hover:text-white"
          >
            <FaChartLine />
            Trade
          </a>

          {/* Internal Route */}
          <Link
            href="/deposit"
            className="flex items-center gap-2 rounded-lg border border-blue-500 px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-[#52a9ff] hover:text-white"
          >
            <FaArrowCircleDown />
            Deposit
          </Link>

          {/* Internal Route */}
          <Link
            href="/withdraws"
            className="flex items-center gap-2 rounded-lg border border-blue-500 px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-[#52a9ff] hover:text-white"
          >
            <FaArrowCircleUp />
            Withdraw
          </Link>
        </div>
      </div>

      {/* Balance */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          ${Number(account.balance).toLocaleString()}
          <span className="ml-1 text-sm font-medium text-gray-500">USD</span>
        </h2>
      </div>

      <div className="my-5 border-t border-gray-200 dark:border-gray-700" />

      {/* Info */}
      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
        <p>
          <span className="font-semibold text-gray-900 dark:text-white">Nick Name:</span>{" "}
          {account.nickname}
        </p>
        <p>
          <span className="font-semibold text-gray-900 dark:text-white">Server:</span>{" "}
          {account.server ?? "-"}
        </p>
        <p>
          <span className="font-semibold text-gray-900 dark:text-white">MT5 Login:</span>{" "}
          {account.accno}
        </p>
        <p>
          <span className="font-semibold text-gray-900 dark:text-white">Leverage:</span> 1:
          {account.leverage}
        </p>
      </div>
    </div>
  );
};

export default AccountCard;