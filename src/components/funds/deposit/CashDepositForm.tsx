"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ZodError } from "zod";

import type { Account } from "@/common/types/account";
import FormMessage from "@/common/UI/FormMessage";
import { useCashDeposit } from "@/features/crm/funds/deposit-funds/hooks/deposit-funds.hooks";
import { cashDepositSchema } from "@/features/crm/funds/deposit-funds/schemas/deposit-funds.schemas";
import { useUserBalanceData } from "@/features/crm/dashboard/hooks/dashboard.hooks";

interface CashDepositFormProps {
  onBack: () => void;
  account?: Account;
}

interface FormDataType {
  paymentMethod: string;
  currency: string;
  amount: string;
  remarks: string;
}

interface FormErrors {
  amount?: string;
  remarks?: string;
  acceptTerms?: string;
}

export default function CashDepositForm({ onBack }: CashDepositFormProps) {
  const { mutate: addCashDeposit, isPending, message, setMessage } = useCashDeposit();
  const { user } = useUserBalanceData();

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [formData, setFormData] = useState<FormDataType>({
    paymentMethod: "Cash Transfer",
    currency: "USD",
    amount: "",
    remarks: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (message) {
      setMessage(null);
    }
  };

  const validateForm = () => {
    try {
      cashDepositSchema.parse({
        amount: formData.amount,
        remark: formData.remarks,
      });

      const fieldErrors: FormErrors = {};

      if (!acceptedTerms) {
        fieldErrors.acceptTerms = "Please accept Terms and Conditions";
      }

      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        return false;
      }

      setErrors({});
      return true;
    } catch (error: unknown) {
      const fieldErrors: FormErrors = {};

      if (error instanceof ZodError) {
        error.issues.forEach((err) => {
          const fieldName = err.path[0];

          if (fieldName === "amount") {
            fieldErrors.amount = err.message;
          }

          if (fieldName === "remark") {
            fieldErrors.remarks = err.message;
          }
        });
      }

      if (!acceptedTerms) {
        fieldErrors.acceptTerms = "Please accept Terms and Conditions";
      }

      setErrors(fieldErrors);
      return false;
    }
  };

  const resetForm = () => {
    setFormData({
      paymentMethod: "Cash Transfer",
      currency: "USD",
      amount: "",
      remarks: "",
    });

    setAcceptedTerms(false);
    setErrors({});
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (message) {
      setMessage(null);
    }

    const isValid = validateForm();

    if (!isValid) return;

    const payload = {
      amount: formData.amount,
      deposit_type: "Cash" as const,
      remark: formData.remarks,
    };

    addCashDeposit(payload, {
      onSuccess: (response) => {
        if (response?.data?.status === 200) {
          resetForm();
        }
      },
    });
  };

  const fadeMotion = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <motion.div
      {...fadeMotion}
      transition={{ duration: 0.25 }}
      className="max-h-[calc(100vh-130px)] overflow-y-auto rounded-2xl bg-white p-6 shadow-md dark:bg-slate-800"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Cash Deposit</h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Deposit funds via cash transfer
          </p>
        </div>

        <button
          onClick={onBack}
          className="rounded-full p-2 transition hover:bg-slate-100 dark:hover:bg-slate-700"
          title="Back"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </button>
      </div>

      {/* Wallet Balance & Options */}
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
              className="w-40 cursor-not-allowed rounded-lg border border-slate-300 bg-transparent px-4 py-3 text-slate-800 dark:border-slate-700 dark:text-white"
              value={formData.paymentMethod}
              disabled
            >
              <option>Cash Transfer</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500 dark:text-slate-400">
              Currency
            </label>

            <select
              className="w-24 cursor-not-allowed rounded-lg border border-slate-300 bg-transparent px-4 py-3 text-slate-800 dark:border-slate-700 dark:text-white"
              value={formData.currency}
              disabled
            >
              <option>USD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Deposit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount + Remarks */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Amount */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Amount
            </label>

            <input
              type="text"
              inputMode="decimal"
              name="amount"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              placeholder="Enter amount"
              className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-3 text-slate-800 outline-none dark:border-slate-700 dark:text-white"
            />

            {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
          </div>

          {/* Remarks */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Remarks
            </label>

            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Enter remarks"
              className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-3 text-slate-800 outline-none dark:border-slate-700 dark:text-white"
            />

            {errors.remarks && <p className="mt-1 text-sm text-red-500">{errors.remarks}</p>}
          </div>
        </div>

        {/* Success / Error Message */}
        {message && (
          <div className="mb-5">
            <FormMessage message={message} />
          </div>
        )}

        {/* Terms */}
        <div className="text-md leading-relaxed text-slate-500 dark:text-slate-400">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={acceptedTerms}
              onChange={(e) => {
                setAcceptedTerms(e.target.checked);

                setErrors((prev) => ({
                  ...prev,
                  acceptTerms: "",
                }));
              }}
              className="mt-1 h-4 w-4 rounded-sm accent-[#465FFF]"
            />

            <label htmlFor="acceptTerms" className="flex-1 cursor-pointer">
              <span className="font-semibold">Accept Terms and Conditions</span>
              <br />
              By clicking <strong>Make Deposit</strong>, you agree that you have read and accepted
              the Terms and Conditions and Privacy Policy of Novotrend Ltd.
            </label>
          </div>

          {errors.acceptTerms && <p className="mt-2 text-sm text-red-500">{errors.acceptTerms}</p>}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
          <button
            type="button"
            onClick={onBack}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Processing..." : "Deposit"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
