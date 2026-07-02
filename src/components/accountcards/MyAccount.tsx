"use client";

import React, { useState } from "react";
import AccountCard from "./AccountCard";
import { useDashboardStats } from "@/features/crm/dashboard/hooks/dashboard.hooks";
import { Mt5Account } from "@/features/crm/dashboard/types/dashboard.types";

const MyAccount: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Real" | "Demo">("Real");
  const { user, isLoading } = useDashboardStats();

  const mt5Accounts: Mt5Account[] = (user?.mt5accounts ?? []).map((acc: Mt5Account) => ({
    ...acc,
    server: "Novotrend Ltd.",
  }));

  const filteredAccounts = mt5Accounts.filter((acc) =>
    activeTab === "Demo" ? acc.group === "Demo" : acc.group !== "Demo"
  );

  const tabs = [
    { id: "Real", label: "Real" },
    { id: "Demo", label: "Demo" },
  ] as const;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="border-brand-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 dark:text-white">My Account</h1>

      {/* Tabs */}
      <div className="mt-4 flex w-fit gap-2 rounded-lg bg-slate-200 p-1 dark:bg-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-md px-5 py-2.5 text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-600 hover:bg-slate-300 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Account Cards */}
      {filteredAccounts.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          No {activeTab} accounts found.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-7 sm:grid-cols-2">
          {filteredAccounts.map((acc) => (
            <AccountCard key={acc.accno} account={acc} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAccount;
