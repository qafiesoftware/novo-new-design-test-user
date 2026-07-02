"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useSendOtp } from "@/hooks/useSendOtp";
import {
  useMT5Accounts,
  useTransfer,
} from "@/features/crm/money-transfer/hooks/money-transfer.hooks";
import {
  mt5ToMT5Schema,
  mt5ToWalletSchema,
  walletToMT5Schema,
} from "@/features/crm/money-transfer/schemas/money-transfer.schemas";
import { TransferTab } from "@/features/crm/money-transfer/types/money-transfer.types";
import { useUserBalanceData } from "@/features/crm/dashboard/hooks/dashboard.hooks";

// Tab config
const TABS: { id: TransferTab; label: string }[] = [
  { id: "MT5ToMT5", label: "Transfer Between Accounts" },
  { id: "MT5ToWallet", label: "MT5 to Wallet" },
  { id: "WalletToMT5", label: "Wallet to MT5" },
];

const OTP_TYPE_MAP: Record<TransferTab, string> = {
  MT5ToMT5: "transfer_between_account",
  MT5ToWallet: "mt5_to_wallet",
  WalletToMT5: "wallet_to_mt5",
};

// Helper
// function accountLabel(acc: MT5Account) {
//   const prefix = acc.group_name === "MT5AccountCent" ? "¢" : "$";
//   return `${acc.accno} — ${prefix}${acc.amount}`;
// }

// Main Component
export default function AccountSwitchTabs() {
  const { user } = useUserBalanceData();

  const [activeTab, setActiveTab] = useState<TransferTab>("MT5ToMT5");

  const handleTabChange = (tab: TransferTab) => {
    setActiveTab(tab);
    resetAll();
  };

  // Shared hooks
  const { mt5Accounts, isLoading: accountsLoading } = useMT5Accounts();
  const { otpStatus, otpSentOnce, otpMessage, otpError, sendOtp, resetOtp } = useSendOtp();
  const { transferStatus, errorMessage, successMessage, submitTransfer, reset } = useTransfer();

  // Local form state
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [otp, setOtp] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Derived
  const isOtpSent = otpSentOnce;
  const isOtpSending = otpStatus === "sending";
  const isSubmitting = transferStatus === "loading";
  const isSuccess = transferStatus === "success";

  // Selected account balance for display
  const selectedFromAcc = useMemo(
    () => mt5Accounts.find((a) => a.accno === fromAccount),
    [mt5Accounts, fromAccount]
  );

  const selectedToAcc = useMemo(
    () => mt5Accounts.find((a) => a.accno === toAccount),
    [mt5Accounts, toAccount]
  );

  // MT5 to MT5: filter out selected from/to so same account can't appear in both
  const fromOptions = useMemo(
    () => mt5Accounts.filter((a) => a.accno !== toAccount),
    [mt5Accounts, toAccount]
  );

  const toOptions = useMemo(
    () => mt5Accounts.filter((a) => a.accno !== fromAccount),
    [mt5Accounts, fromAccount]
  );

  // Reset all state
  const resetAll = useCallback(() => {
    reset();
    resetOtp();
    setFromAccount("");
    setToAccount("");
    setAmount("");
    setNote("");
    setOtp("");
    setTermsAccepted(false);
    setFieldErrors({});
  }, [reset, resetOtp]);

  // Send OTP
  // const handleSendOtp = useCallback(async () => {
  //   if (!amount || parseFloat(amount) <= 0) return;
  //   await sendOtp({ amount, otp_type: OTP_TYPE_MAP[activeTab] });
  // }, [amount, activeTab, sendOtp]);

  const handleSendOtp = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    await sendOtp({
      amount,
      otp_type: OTP_TYPE_MAP[activeTab],
      mt5_id:
        activeTab === "MT5ToMT5"
          ? fromAccount
          : activeTab === "MT5ToWallet"
            ? fromAccount
            : toAccount,
      mt5_receiverid: activeTab === "MT5ToMT5" ? toAccount : "",
    });
  }, [amount, activeTab, fromAccount, toAccount, sendOtp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (activeTab === "MT5ToMT5") {
      const result = mt5ToMT5Schema.safeParse({
        senderid: fromAccount,
        receiverid: toAccount,
        amount,
        note,
        otp,
        termsAccepted,
      });
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((i) => {
          errors[i.path[0] as string] = i.message;
        });
        setFieldErrors(errors);
        return;
      }
      await submitTransfer(
        { senderid: fromAccount, receiverid: toAccount, amount, note, otp },
        activeTab
      );
    } else if (activeTab === "MT5ToWallet") {
      const result = mt5ToWalletSchema.safeParse({
        mt5accountselect: fromAccount, // MT5 select = fromAccount
        amount,
        note,
        otp,
        termsAccepted,
      });
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((i) => {
          errors[i.path[0] as string] = i.message;
        });
        setFieldErrors(errors);
        return;
      }
      await submitTransfer({ mt5accountselect: fromAccount, amount, note, otp }, activeTab);
    } else {
      // WalletToMT5 — MT5 select = toAccount
      const result = walletToMT5Schema.safeParse({
        mt5accountselect: toAccount, // toAccount,
        amount,
        note,
        otp,
        termsAccepted,
      });
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((i) => {
          errors[i.path[0] as string] = i.message;
        });
        setFieldErrors(errors);
        return;
      }
      await submitTransfer({ mt5accountselect: toAccount, amount, note, otp }, activeTab);
    }
  };

  // Success screen
  if (isSuccess) {
    return (
      <div className="p-4">
        <TabsHeader activeTab={activeTab} onTabChange={handleTabChange} />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-xl border border-gray-100 bg-white p-10 text-center shadow-sm dark:border-gray-800 dark:bg-slate-900"
        >
          <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-500" />
          <h3 className="mb-2 text-xl font-semibold text-slate-800 dark:text-white">
            Transfer Successful
          </h3>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">{successMessage}</p>
          <button
            onClick={resetAll}
            className="rounded-md border border-slate-300 px-6 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            New Transfer
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <TabsHeader activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="mt-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-slate-900">
        <h4 className="mb-6 text-base font-semibold text-slate-900 dark:text-white">
          {TABS.find((t) => t.id === activeTab)?.label}
        </h4>

        {/* Global error */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ── From Account ── */}
          <AnimatePresence mode="wait">
            {activeTab !== "WalletToMT5" ? (
              // MT5ToMT5 or MT5ToWallet — show MT5 dropdown as FROM
              <motion.div
                key="from-mt5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  From Account
                  {selectedFromAcc && (
                    <span className="ml-2 text-xs font-normal text-indigo-500">
                      Balance:{" "}
                      {selectedFromAcc.group_name === "Cent"
                        ? `¢${selectedFromAcc.amount}`
                        : `$${selectedFromAcc.amount}`}
                    </span>
                  )}
                </label>
                <select
                  value={fromAccount}
                  onChange={(e) => {
                    setFromAccount(e.target.value);
                    setFieldErrors((p) => ({ ...p, mt5accountselect: "" }));
                    resetOtp();
                    setOtp("");
                  }}
                  className={`w-full rounded-lg border bg-transparent px-4 py-3 text-sm text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:bg-slate-800 dark:text-white ${fieldErrors.mt5accountselect ? "border-red-400" : "border-slate-300 dark:border-slate-700"}`}
                >
                  <option value="">
                    {accountsLoading ? "Loading accounts..." : "Select MT5 Account"}
                  </option>
                  {fromOptions.map((acc) => (
                    <option key={acc.accno} value={acc.accno}>
                      {acc.accno}
                    </option>
                  ))}
                </select>
                {fieldErrors.senderid && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.senderid}</p>
                )}
              </motion.div>
            ) : (
              // WalletToMT5 — show Wallet as FROM (disabled)
              <motion.div
                key="from-wallet"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  From Account
                </label>
                <select
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-slate-300 bg-transparent px-4 py-3 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option>Personal Wallet ({user?.balance})</option>
                </select>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── To Account ── */}
          <AnimatePresence mode="wait">
            {activeTab !== "MT5ToWallet" ? (
              // MT5ToMT5 or WalletToMT5 — show MT5 dropdown as TO
              <motion.div
                key="to-mt5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  To Account
                  {selectedToAcc && (
                    <span className="ml-2 text-xs font-normal text-indigo-500">
                      Balance:{" "}
                      {selectedToAcc.group_name === "Cent"
                        ? `¢${selectedToAcc.amount}`
                        : `$${selectedToAcc.amount}`}
                    </span>
                  )}
                </label>
                <select
                  value={toAccount}
                  onChange={(e) => {
                    setToAccount(e.target.value);
                    setFieldErrors((p) => ({ ...p, mt5_receiverid: "" }));
                  }}
                  className={`w-full rounded-lg border bg-transparent px-4 py-3 text-sm text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:bg-slate-800 dark:text-white ${fieldErrors.receiverid ? "border-red-400" : "border-slate-300 dark:border-slate-700"}`}
                >
                  <option value="">
                    {accountsLoading ? "Loading accounts..." : "Select MT5 Account"}
                  </option>
                  {toOptions.map((acc) => (
                    <option key={acc.accno} value={acc.accno}>
                      {acc.accno}
                    </option>
                  ))}
                </select>
                {fieldErrors.receiverid && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.receiverid}</p>
                )}
              </motion.div>
            ) : (
              // MT5ToWallet — show Wallet as TO (disabled)
              <motion.div
                key="to-wallet"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  To Account
                </label>
                <select
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-slate-300 bg-transparent px-4 py-3 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option>Personal Wallet ({user?.balance})</option>
                </select>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Amount */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Amount
            </label>
            <div
              className={`flex items-center rounded-lg border bg-white focus-within:ring-1 focus-within:ring-indigo-500 dark:bg-slate-800 ${fieldErrors.amount ? "border-red-400" : "border-slate-300 dark:border-slate-700"}`}
            >
              <span className="border-r border-slate-300 px-3 py-3 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400">
                USD
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setFieldErrors((p) => ({ ...p, amount: "" }));
                }}
                disabled={isOtpSent}
                min="0"
                step="0.01"
                placeholder="0.00"
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                className="w-full border-0 bg-transparent px-4 py-3 text-sm text-slate-800 outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:text-white"
              />
            </div>
            {fieldErrors.amount && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.amount}</p>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Note <span className="text-slate-400">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a reference note for this transfer"
              className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-3 text-sm text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:text-white"
            />
          </div>

          {/* OTP Section */}
          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <h4 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
              OTP Verification
            </h4>

            <div className="mb-3">
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={!amount || parseFloat(amount) <= 0 || isOtpSending || isOtpSent}
                className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isOtpSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : isOtpSent ? (
                  <>OTP Sent</>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" /> Send OTP
                  </>
                )}
              </button>
            </div>

            <AnimatePresence>
              {otpMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-3 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  {otpMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {otpError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {otpError}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isOtpSent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      if (/^\d*$/.test(e.target.value)) {
                        setOtp(e.target.value);
                        setFieldErrors((p) => ({ ...p, otp: "" }));
                      }
                    }}
                    placeholder="Enter 6 digit OTP"
                    className={`w-full rounded-lg border bg-transparent px-4 py-3 text-sm text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:text-white ${fieldErrors.otp ? "border-red-400" : "border-slate-300 dark:border-slate-700"}`}
                  />
                  {fieldErrors.otp && (
                    <p className="mt-1 text-xs text-red-500">{fieldErrors.otp}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Terms */}
          <div className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  setFieldErrors((p) => ({ ...p, termsAccepted: "" }));
                }}
                className="mt-1 h-4 w-4 rounded-sm border border-slate-300 accent-indigo-600 dark:border-slate-700"
              />
              <label htmlFor="acceptTerms" className="flex-1 cursor-pointer">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Accept Terms and Conditions
                </span>
                <br />
                By clicking <strong>Transfer</strong>, you agree to the Terms and Privacy Policy of
                Novotrend Ltd.
              </label>
            </div>
            {fieldErrors.termsAccepted && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.termsAccepted}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
            <button
              type="button"
              onClick={resetAll}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={!amount || !isOtpSent || otp.length !== 6 || !termsAccepted || isSubmitting}
              className="flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Processing..." : "Transfer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Tabs Header — extracted 

function TabsHeader({
  activeTab,
  onTabChange,
}: {
  activeTab: TransferTab;
  onTabChange: (t: TransferTab) => void;
}) {
  return (
    <ul className="relative flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
      {TABS.map((tab) => (
        <li
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`cursor-pointer rounded-t-md border-b-2 px-6 py-3 text-[15px] transition-all ${
            activeTab === tab.id
              ? "border-indigo-600 bg-gray-50 font-semibold text-indigo-600 dark:bg-slate-800"
              : "border-transparent font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400"
          }`}
        >
          {tab.label}
        </li>
      ))}
    </ul>
  );
}
