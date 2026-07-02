"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, KeyRound, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Account } from "@/common/types/account";
import { useGetUserBankDetails } from "@/features/crm/funds/add-bank-account/hooks/add-bank-account.hook";
import { useBankWithdraw } from "@/features/crm/funds/withdraw-funds/hooks/withdraw-funds.hooks";
import { useSendOtp } from "@/hooks/useSendOtp";
import { bankWithdrawSchema } from "@/features/crm/funds/withdraw-funds/schemas/withdraw-funds.schemas";
import { useUserBalanceData } from "@/features/crm/dashboard/hooks/dashboard.hooks";

interface BankWithdrawsFormProps {
  onBack: () => void;
  account?: Account;
}

const OTP_TYPE = "withdraw_bank_otp";

export default function BankWithdrawsForm({ onBack }: BankWithdrawsFormProps) {
  const router = useRouter();
  const { bankDetails, isLoading } = useGetUserBankDetails();
  const { user } = useUserBalanceData();
  const hasBankDetails = bankDetails && Object.keys(bankDetails).length > 0;

  const { status, errorMessage, successMessage, submitWithdraw, reset } = useBankWithdraw();
  const { otpStatus, otpSentOnce, otpMessage, otpError, sendOtp, resetOtp } = useSendOtp();

  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [otp, setOtp] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Derived states
  const isOtpSending = otpStatus === "sending";
  const isSubmitting = status === "loading";
  const isSuccess = status === "success";

  // otpSentOnce
  const canSendOtp = !!amount && parseFloat(amount) > 0 && hasBankDetails && !otpSentOnce;
  const canSubmit = otpSentOnce && otp.length === 6 && termsAccepted && !isSubmitting;

  // Handlers
  const handleSendOtp = useCallback(async () => {
    if (!canSendOtp) return;
    await sendOtp({ amount, otp_type: OTP_TYPE });
  }, [canSendOtp, amount, sendOtp]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d{0,6}$/.test(val)) setOtp(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    const result = bankWithdrawSchema.safeParse({ amount, remark, otp });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[issue.path[0] as string] = issue.message;
      });
      setValidationErrors(errors);
      return;
    }

    await submitWithdraw({ amount, remark, otp });
  };

  const handleBack = useCallback(() => {
    reset();
    resetOtp();
    onBack();
  }, [reset, resetOtp, onBack]);

  // Success screen
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

  // Main render
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
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Withdraw Bank Transfer
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Withdraw your funds via bank transfer
          </p>
        </div>
        <button
          onClick={handleBack}
          className="rounded-full p-2 transition hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </button>
      </div>

      {/* Global error banner */}
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

      {/* Payment method row */}
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
              className="cursor-not-allowed rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option>Bank Transfer</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500 dark:text-slate-400">
              Currency
            </label>
            <select
              disabled
              className="cursor-not-allowed rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option>USD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bank details card */}
      <div className="mb-6 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
        <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
          Bank Details
        </h3>

        {isLoading ? (
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
            ))}
          </div>
        ) : hasBankDetails ? (
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            {[
              ["Bank Name", bankDetails?.bankname],
              ["Account Holder", bankDetails?.accholder],
              ["Account Number", bankDetails?.accno],
              ["IFSC / SWIFT Code", bankDetails?.ifsc],
              ["IBAN Number", bankDetails?.iban],
            ].map(([label, value]) => (
              <p key={label} className="text-slate-600 dark:text-slate-300">
                <span className="font-medium">{label}:</span> {value || "—"}
              </p>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No bank account found. Please add your bank account first.
            </p>
            <button
              type="button"
              onClick={() => router.push("/newaccount")}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Add Bank Account
            </button>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Amount */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Amount
          </label>
          <div className="flex items-center rounded-lg border border-slate-300 bg-white focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800">
            <span className="border-r border-slate-300 px-3 py-3 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400">
              USD
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                // amount change pe OTP reset — security
                if (otpSentOnce) {
                  resetOtp();
                  setOtp("");
                }
              }}
              min="0"
              step="0.01"
              placeholder="0.00"
              disabled={isSubmitting}
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
              className="w-full border-0 bg-transparent px-4 py-3 text-sm text-slate-800 outline-none disabled:cursor-not-allowed dark:text-white"
            />
          </div>
          {validationErrors.amount && (
            <p className="mt-1 text-xs text-red-500">{validationErrors.amount}</p>
          )}
        </div>

        {/* Remark */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Remark <span className="text-xs text-slate-400">(optional)</span>
          </label>
          <input
            type="text"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter your remark"
            disabled={isSubmitting}
            className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed dark:border-slate-700 dark:text-white"
          />
        </div>

        {/* OTP section */}
        <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
          <h4 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
            OTP Verification
          </h4>

          {/* Send OTP button */}
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={!canSendOtp || isOtpSending}
            className="mb-3 flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isOtpSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <KeyRound className="h-4 w-4" />
                {/* otpSentOnce label */}
                {otpSentOnce ? "OTP Sent " : "Send OTP"}
              </>
            )}
          </button>

          {/* OTP success message */}
          <AnimatePresence>
            {otpMessage && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-3 flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
              >
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                {otpMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* OTP error message */}
          <AnimatePresence>
            {otpError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-3 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {otpError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* OTP input */}
          <div>
            <input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              // otpSentOnce use karo — timer expire hone pe bhi enabled rahega
              disabled={!otpSentOnce || isSubmitting}
              className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-slate-700 dark:text-white dark:disabled:bg-slate-800/40"
            />
            {validationErrors.otp && (
              <p className="mt-1 text-xs text-red-500">{validationErrors.otp}</p>
            )}
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 rounded-sm border border-slate-300 accent-indigo-600 dark:border-slate-700"
          />
          <label htmlFor="acceptTerms" className="flex-1 cursor-pointer leading-relaxed">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Accept Terms and Conditions
            </span>
            <br />
            By clicking <strong>Withdraw</strong>, you agree that you have read and accepted the
            Terms and Conditions and Privacy Policy of Novotrend Ltd.
          </label>
        </div>

        {/* Action buttons */}
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
            disabled={!canSubmit}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Processing..." : "Withdraw"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
