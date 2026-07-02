"use client";

import React, { ReactNode, FormEvent } from "react";

interface BaseDepositFormProps {
  children?: ReactNode;
  onCancel?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  showCurrency?: boolean;
  currency?: string;
  amountValue: string | number;
  setAmountValue?: (value: string) => void;
  showAmountPrefix?: boolean;
  showReceipt?: boolean;
  termsChecked?: boolean;
  setTermsChecked?: (checked: boolean) => void;
}

export default function BaseDepositForm({
  children,
  onCancel,
  onSubmit,
  isSubmitting = false,
  showCurrency = true,
  currency = "USD",
  amountValue,
  setAmountValue,
  showAmountPrefix = true,
  showReceipt = true,
}: BaseDepositFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-6 shadow-md dark:bg-slate-900"
      aria-labelledby="deposit-form-heading"
    >
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3
            id="deposit-form-heading"
            className="text-lg font-semibold text-slate-900 dark:text-slate-100"
          >
            Make a Deposit
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Fill out the form below to submit your deposit request.
          </p>
        </div>

        {/* Custom injected content */}
        {children}

        {/* Amount */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Amount
          </label>
          <div className="mt-1">
            <div className="flex rounded-md shadow-sm">
              {showAmountPrefix && (
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-slate-200 bg-slate-50 px-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300">
                  {showCurrency ? currency : ""}
                </span>
              )}

              <input
                id="amount"
                name="amount"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                value={amountValue}
                onChange={(e) => setAmountValue && setAmountValue(e.target.value)}
                placeholder="0.00"
                required
                className={`block w-full min-w-0 flex-1 rounded-md border px-3 py-2 ${
                  showAmountPrefix ? "rounded-l-none" : ""
                } border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100`}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Minimum deposit and limits will be shown on card. Please verify before submitting.
            </p>
          </div>
        </div>

        {/* Transaction Id */}
        <div>
          <label
            htmlFor="txid"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Transaction Id
          </label>
          <input
            id="txid"
            name="txid"
            type="text"
            placeholder="Enter transaction id"
            className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-100"
          />
        </div>

        {/* Remarks */}
        <div>
          <label
            htmlFor="remarks"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Remarks
          </label>
          <textarea
            id="remarks"
            name="remarks"
            rows={3}
            placeholder="Enter remarks here"
            className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-100"
          />
        </div>

        {/* Receipt */}
        {showReceipt && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Receipt
            </label>
            <div className="mt-1 flex items-center gap-3">
              <input
                id="receipt"
                name="receipt"
                type="file"
                accept="image/*"
                className="block text-sm text-slate-500"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload a photo/scanned copy of transaction receipt (optional).
              </p>
            </div>
          </div>
        )}

        {/* Terms */}
        <div className="text-md leading-relaxed text-slate-500 dark:text-slate-400">
          <div className="text-md flex items-start gap-3 leading-relaxed text-slate-500 dark:text-slate-400">
            <input
              type="checkbox"
              id="acceptTerms"
              required
              className="mt-1 h-4 w-4 rounded-sm border border-slate-300 accent-[#465FFF] transition outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700"
            />
            <label htmlFor="acceptTerms" className="flex-1 cursor-pointer">
              <span className="font-semibold">Accept Terms and Conditions</span>
              <br />
              By clicking <strong>Make Deposit</strong>, you agree that you have read and accepted
              the Terms and Conditions and Privacy Policy of Novotrend Ltd.
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-200"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-gradient-to-r from-indigo-600 to-violet-500 px-4 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-60"
          >
            {isSubmitting ? "Submitting…" : "Make Deposit"}
          </button>
        </div>
      </div>
    </form>
  );
}
