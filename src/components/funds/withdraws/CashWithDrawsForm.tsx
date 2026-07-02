"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, KeyRound, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { Account } from "@/common/types/account";
import { useSendOtp } from "@/hooks/useSendOtp";
import { useCashWithdraw } from "@/features/crm/funds/withdraw-funds/hooks/withdraw-funds.hooks";
import { cashWithdrawSchema } from "@/features/crm/funds/withdraw-funds/schemas/withdraw-funds.schemas";
import { useUserBalanceData } from "@/features/crm/dashboard/hooks/dashboard.hooks";

interface CashWithdrawsFormProps {
  onBack: () => void;
  account?: Account;
}

export default function CashWithDrawsForm({ onBack }: CashWithdrawsFormProps) {
  const { otpStatus, otpSentOnce, otpMessage, otpError, sendOtp, resetOtp } = useSendOtp();
  const { user } = useUserBalanceData();
  const { withdrawStatus, errorMessage, successMessage, submitWithdraw, reset } = useCashWithdraw();

  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [otp, setOtp] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Derived
  const isOtpSending = otpStatus === "sending";
  const isSubmitting = withdrawStatus === "loading";
  const isSuccess = withdrawStatus === "success";

  const handleSendOtp = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    await sendOtp({ amount, otp_type: "withdraw_cash_otp" });
  }, [amount, sendOtp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const result = cashWithdrawSchema.safeParse({ amount, remark, otp, termsAccepted });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[issue.path[0] as string] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    await submitWithdraw({ amount, remark, otp, deposit_type: "Cash" });
  };

  const handleBack = useCallback(() => {
    reset();
    resetOtp();
    onBack();
  }, [reset, resetOtp, onBack]);

  // Success Screen
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white p-10 text-center shadow-md dark:bg-slate-800"
      >
        <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-500" />
        <h3 className="mb-2 text-xl font-semibold text-slate-800 dark:text-white">
          Withdrawal Submitted
        </h3>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">{successMessage}</p>
        <button
          onClick={handleBack}
          className="rounded-md border border-slate-300 px-6 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          Back to Accounts
        </button>
      </motion.div>
    );
  }

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
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Withdraw Cash</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Withdraw your funds via cash</p>
        </div>
        <button
          onClick={handleBack}
          className="rounded-full p-2 transition hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </button>
      </div>

      {/* Payment meta */}
      <div className="mb-6 flex flex-col justify-between gap-3 text-sm sm:flex-row">
        <p className="text-slate-700 dark:text-slate-300">
          <span className="font-semibold">Current Wallet Balance:</span> $ {user?.balance}
        </p>
        <div className="flex gap-3">
          <div>
            <label className="mb-1 block text-xs text-slate-500 dark:text-slate-400">
              Payment Method
            </label>
            <select
              disabled
              className="w-40 cursor-not-allowed rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option>Cash</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500 dark:text-slate-400">
              Currency
            </label>
            <select
              disabled
              className="w-24 cursor-not-allowed rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option>USD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Global error */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* From Account + Amount */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              From Account
            </label>
            <select
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-slate-300 bg-transparent px-4 py-3 text-sm text-slate-800 dark:border-slate-700 dark:text-white"
            >
              <option>Wallet Balance</option>
            </select>
          </div>

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
                  // ✅ amount change
                  if (otpSentOnce) {
                    resetOtp();
                    setOtp("");
                  }
                }}
                // otpSentOnce
                disabled={otpSentOnce || isSubmitting}
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
        </div>

        {/* Remark */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Remark
          </label>
          <input
            type="text"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter your remark (optional)"
            className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-3 text-sm text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:text-white"
          />
        </div>

        {/* OTP Section */}
        <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
          <h4 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
            OTP Verification
          </h4>

          {/* Send OTP button */}
          <div className="mb-3">
            <button
              type="button"
              onClick={handleSendOtp}
              // otpSentOnce se block karo re-send
              disabled={!amount || parseFloat(amount) <= 0 || isOtpSending || otpSentOnce}
              className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isOtpSending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                </>
              ) : otpSentOnce ? (
                // otpSentOnce label
                <>
                  <CheckCircle2 className="h-4 w-4" /> OTP Sent 
                </>
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

          {/* AnimatePresence */}
          {otpSentOnce && (
            <div>
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
                disabled={isSubmitting}
                className={`w-full rounded-lg border bg-transparent px-4 py-3 text-sm text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:text-white ${fieldErrors.otp ? "border-red-400" : "border-slate-300 dark:border-slate-700"}`}
              />
              {fieldErrors.otp && <p className="mt-1 text-xs text-red-500">{fieldErrors.otp}</p>}
            </div>
          )}
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
              By clicking <strong>Withdraw</strong>, you agree to our Terms and Privacy Policy of
              Novotrend Ltd.
            </label>
          </div>
          {fieldErrors.termsAccepted && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.termsAccepted}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
          <button
            type="button"
            onClick={handleBack}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          {/* !isOtpSent → !otpSentOnce */}
          <button
            type="submit"
            disabled={!amount || !otpSentOnce || otp.length !== 6 || !termsAccepted || isSubmitting}
            className="flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Processing..." : "Withdraw"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
