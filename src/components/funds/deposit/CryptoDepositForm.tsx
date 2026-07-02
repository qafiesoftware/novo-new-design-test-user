"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Copy, CheckCheck, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { Account } from "@/common/types/account";
import Image from "next/image";
import { CryptoNetwork } from "@/features/crm/funds/deposit-funds/types/deposit-funds.types";
import { NETWORK_META } from "@/features/crm/funds/deposit-funds/api/deposit-funds.api";
import { useCryptoDeposit } from "@/features/crm/funds/deposit-funds/hooks/deposit-funds.hooks";
import { cryptoDepositSchema } from "@/features/crm/funds/deposit-funds/schemas/deposit-funds.schemas";

interface CryptoDepositFormProps {
  onBack: () => void;
  account: Account & { network: CryptoNetwork };
}

export default function CryptoDepositForm({ onBack, account }: CryptoDepositFormProps) {
  const network = account.network;
  const meta = NETWORK_META[network];

  const { walletData, status, errorMessage, successMessage, generateWallet, reset } =
    useCryptoDeposit(network);

  const [amount, setAmount] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [copied, setCopied] = useState(false);

  const isLoading = status === "loading";
  const isSuccess = status === "success";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    const result = cryptoDepositSchema.safeParse({ amount, termsAccepted });
    if (!result.success) {
      setValidationError(result.error.issues[0].message);
      return;
    }

    await generateWallet({ amount, network });
  };

  const handleBack = useCallback(() => {
    reset();
    onBack();
  }, [reset, onBack]);

  const handleCopy = useCallback(() => {
    if (!walletData?.walletaddress) return;
    navigator.clipboard.writeText(walletData.walletaddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [walletData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl bg-white p-6 shadow-md dark:bg-slate-800"
    >
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Deposit USDT</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {meta.icon} {meta.label}
          </p>
        </div>
        <button
          onClick={handleBack}
          className="rounded-full p-2 transition hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </button>
      </div>

      {/* Success banner */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error banner */}
      <AnimatePresence>
        {(errorMessage || validationError) && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {validationError || errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          /* ── Form ── */
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Amount */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Amount (USD)
              </label>
              <div className="flex items-center rounded-lg border border-slate-300 bg-white focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800">
                <span className="border-r border-slate-300 px-3 py-3 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400">
                  USD
                </span>
                <input
                  type="number"
                  name="amount"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setValidationError("");
                  }}
                  placeholder="0.00"
                  step="0.01"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  className="w-full border-0 bg-transparent px-4 py-3 text-sm text-slate-800 outline-none dark:text-white"
                />
              </div>
              <p className="mt-1 text-xs text-slate-400">Min: $10 — Max: $1,000</p>
            </div>

            {/* Terms */}
            <div className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded-sm border border-slate-300 accent-indigo-600 dark:border-slate-700"
                />
                <label htmlFor="acceptTerms" className="flex-1 cursor-pointer">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Accept Terms and Conditions
                  </span>
                  <br />
                  By clicking <strong>Make Deposit</strong>, you agree you have read and accepted
                  the Terms and Conditions and Privacy Policy of Novotrend Ltd.
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
              <button
                type="button"
                onClick={handleBack}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !amount}
                className="flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? "Generating..." : "Make Deposit"}
              </button>
            </div>
          </motion.form>
        ) : (
          /* ── Wallet View (success state) ── */
          <motion.div
            key="wallet"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* QR */}
            {walletData?.walletscanima && (
              <div className="flex justify-center">
                <Image
                  src={walletData.walletscanima}
                  alt="Wallet QR Code"
                  width={192}
                  height={192}
                  className="h-48 w-48 rounded-xl border border-slate-200 shadow-md dark:border-slate-700"
                />
              </div>
            )}

            {/* Address */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                Wallet Address
              </label>
              <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center dark:border-slate-700 dark:bg-slate-700/40">
                <p className="flex-1 text-xs break-all text-slate-700 dark:text-slate-300">
                  {walletData?.walletaddress}
                </p>
                <button
                  onClick={handleCopy}
                  className="flex shrink-0 items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-indigo-700"
                >
                  {copied ? (
                    <>
                      <CheckCheck className="h-3.5 w-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy Address
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Warning */}
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
              ⚠️ Send only <strong>USDT ({network})</strong> to this address. Wrong network =
              permanent loss.
            </div>

            {/* Back */}
            <div className="flex justify-end border-t border-slate-200 pt-4 dark:border-slate-700">
              <button
                onClick={handleBack}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Back to Accounts
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
