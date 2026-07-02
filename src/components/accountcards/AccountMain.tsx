"use client";

import { useState } from "react";
import {
  FaWallet,
  FaCoins,
  FaExchangeAlt,
  FaPlus,
  FaThLarge,
  FaList,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import Link from "next/link";
import AccountModal from "./accountmodal/AccountModal";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";
import { useDashboardStats } from "@/features/crm/dashboard/hooks/dashboard.hooks";
import { Mt5Account } from "@/features/crm/dashboard/types/dashboard.types";

export default function AccountMain() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tab, setTab] = useState<"Real" | "Demo">("Real");
  const [sortOrder, setSortOrder] = useState<"Newest" | "Oldest">("Newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [modalType, setModalType] = useState<"password" | "nickname" | null>(null);

  const { user, isLoading } = useDashboardStats();

  const mt5Accounts: Mt5Account[] = (user?.mt5accounts ?? []).map((acc: Mt5Account) => ({
    ...acc,
    server: "Novotrend Ltd.",
  }));

  const filteredAccounts = mt5Accounts
    .filter((acc) => (tab === "Demo" ? acc.group === "Demo" : acc.group !== "Demo"))
    .sort((a, b) =>
      sortOrder === "Newest" ? b.accno.localeCompare(a.accno) : a.accno.localeCompare(b.accno)
    );

  const toggleExpand = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="border-brand-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  return (
    <section className="w-full px-4 py-8 transition-colors sm:px-8 md:px-12">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-3 text-2xl font-semibold text-gray-900 md:mb-0 dark:text-white">
            My Accounts
          </h1>

          {/* Tabs */}
          <div className="my-4 flex w-fit rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-800 dark:bg-slate-800">
            {(["Real", "Demo"] as const).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                  tab === t
                    ? "bg-[#465FFF] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#111018]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Sort + View + Add */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "Newest" | "Oldest")}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-slate-800 dark:text-gray-200"
          >
            <option>Newest</option>
            <option>Oldest</option>
          </select>

          <div className="flex items-center overflow-hidden rounded-md border border-gray-300 dark:border-gray-700 dark:text-gray-200">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={`px-3 py-2 ${
                view === "grid" ? "bg-gradient-to-r from-[#6B4CFF]/10 to-[#C66BFF]/10" : ""
              }`}
            >
              <FaThLarge />
            </button>

            <button
              type="button"
              onClick={() => setView("list")}
              className={`px-3 py-2 ${
                view === "list" ? "bg-gradient-to-r from-[#6B4CFF]/10 to-[#C66BFF]/10" : ""
              }`}
            >
              <FaList />
            </button>
          </div>

          <Link href="/add-account" className="inline-block">
            <button
              type="button"
              className="flex items-center gap-2 rounded-md bg-[#465FFF] px-4 py-2 text-sm font-medium text-white transition hover:opacity-95"
            >
              <FaPlus /> Add Account
            </button>
          </Link>
        </div>
      </div>

      {/* Empty State */}
      {filteredAccounts.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No {tab} accounts found.</p>
      ) : (
        <div
          className={`grid items-start gap-6 ${
            view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          }`}
        >
          {filteredAccounts.map((account) => {
            const isOpen = expanded === account.accno;

            return (
              <div
                key={account.accno}
                className="group rounded-md border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-slate-800"
              >
                <div className="p-5 sm:p-6">
                  <div
                    className={`flex ${
                      view === "list"
                        ? "flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                        : "flex-col gap-4"
                    }`}
                  >
                    {/* Left: Account Info */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                            account.group !== "Demo"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
                          }`}
                        >
                          {account.group !== "Demo" ? "Real" : "Demo"}
                        </span>

                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          #{account.accno} {account.group}
                        </span>
                      </div>

                      <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        {Number(account.balance).toLocaleString()}{" "}
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {account.group?.toLowerCase().includes("cent") ? "USC" : "USD"}
                        </span>
                      </h2>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      <Link
                        href="/deposit"
                        className="flex items-center gap-2 rounded-md bg-[#465FFF] px-4 py-2 text-sm font-medium text-white transition"
                      >
                        <FaWallet className="text-xs" />
                        Deposit
                      </Link>

                      <Link
                        href="/withdraws"
                        className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium transition dark:bg-white/5 dark:text-white"
                      >
                        <FaCoins className="text-xs text-red-500" />
                        Withdraw
                      </Link>
                      <a
                        href="https://webtrading.novotrend.co/terminal"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium transition dark:bg-white/5 dark:text-white"
                      >
                        <FaExchangeAlt className="text-xs text-[#465FFF]" />
                        Trade
                      </a>
                    </div>
                  </div>

                  {/* Expand Toggle */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => toggleExpand(account.accno)}
                      className="flex items-center gap-1 text-sm text-gray-600 transition hover:text-[#465FFF] dark:text-gray-200"
                    >
                      {isOpen ? (
                        <>
                          Hide details <FaChevronUp className="text-xs" />
                        </>
                      ) : (
                        <>
                          View details <FaChevronDown className="text-xs" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Expandable Details */}
                  <div
                    className="overflow-hidden transition-[max-height] duration-300"
                    style={{ maxHeight: isOpen ? 400 : 0 }}
                  >
                    <div className="mt-4 space-y-2 border-t border-gray-200 pt-4 text-sm dark:border-gray-800">
                      <p className="dark:text-white">
                        <span className="font-medium">Nick Name:</span> {account.nickname}
                      </p>

                      <p className="dark:text-white">
                        <span className="font-medium">Server:</span> {account.server}
                      </p>

                      <p className="dark:text-white">
                        <span className="font-medium">MT5 Login:</span> {account.accno}
                      </p>

                      <p className="dark:text-white">
                        <span className="font-medium">Leverage:</span> 1:{account.leverage}
                      </p>

                      <div className="flex gap-6 pt-3">
                        <button
                          onClick={() => setModalType("password")}
                          className="flex items-center gap-2 text-sm text-[#465FFF] transition hover:underline"
                        >
                          <RiLockPasswordLine size={15} />
                          Change Trading Password
                        </button>

                        <button
                          onClick={() => setModalType("nickname")}
                          className="flex items-center gap-2 text-sm text-[#465FFF] transition hover:underline"
                        >
                          <FaUserEdit size={15} />
                          Update Nick Name
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <AccountModal
        type={modalType}
        onClose={() => setModalType(null)}
        mt5id={expanded ?? ""}
        nickname={mt5Accounts.find((a) => a.accno === expanded)?.nickname ?? ""}
      />
    </section>
  );
}