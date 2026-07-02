"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload } from "lucide-react";
import { z } from "zod";
import { useGetBankDetails } from "@/features/crm/funds/deposit-funds/hooks/deposit-funds.hooks";
import { useDepositFundsAddWalletBalance } from "@/features/crm/funds/deposit-funds/hooks/deposit-funds.hooks";
import type { Account } from "@/common/types/account";
import { depositFundsSchema } from "@/features/crm/funds/deposit-funds/schemas/deposit-funds.schemas";
import FormMessage from "@/common/UI/FormMessage";
import { useUserBalanceData } from "@/features/crm/dashboard/hooks/dashboard.hooks";

interface BankDepositFormProps {
  onBack: () => void;
  account?: Account;
}
interface FormDataType {
  amount: string;
  transactionId: string;
  remarks: string;
  receipt: File | null;
}
interface FormErrors {
  amount?: string;
  transactionId?: string;
  remarks?: string;
  receipt?: string;
  acceptTerms?: string;
}

export default function BankDepositForm({ onBack }: BankDepositFormProps) {
  const { bankDetails, isLoading } = useGetBankDetails();
  const { user } = useUserBalanceData();
  const { mutate: depositFunds, isPending, message } = useDepositFundsAddWalletBalance();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    amount: "",
    transactionId: "",
    remarks: "",
    receipt: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    try {
      depositFundsSchema.parse({
        amount: formData.amount,
        transactionId: formData.transactionId,
        remarks: formData.remarks,
        receipt: formData.receipt,
      });

      if (!acceptedTerms) {
        setErrors((prev) => ({
          ...prev,
          acceptTerms: "Please accept Terms and Conditions",
        }));
        return false;
      }

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: FormErrors = {};

        error.issues.forEach((err) => {
          const fieldName = err.path[0] as keyof FormErrors;

          if (fieldName && !fieldErrors[fieldName]) {
            fieldErrors[fieldName] = err.message;
          }
        });

        if (!acceptedTerms) {
          fieldErrors.acceptTerms = "Please accept Terms and Conditions";
        }
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const resetForm = () => {
    setFormData({
      amount: "",
      transactionId: "",
      remarks: "",
      receipt: null,
    });

    setAcceptedTerms(false);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) return;

    const payload = {
      amount: formData.amount,
      req_transaction_id: formData.transactionId,
      remark: formData.remarks,
      deposit_type: "Bank Transfer",
      receipt: formData.receipt,
    };

    depositFunds(payload, {
      onSuccess: (response) => {
        if (response?.data?.status === 200) {
          resetForm();
        }
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="max-h-[calc(100vh-110px)] overflow-y-auto rounded-2xl bg-white p-5 shadow-md sm:p-6 dark:bg-slate-800"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl dark:text-white">
            Bank Transfer Deposit
          </h2>

          <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            Deposit your funds via bank transfer
          </p>
        </div>

        <button
          onClick={onBack}
          className="self-start rounded-full p-2 transition hover:bg-slate-100 sm:self-auto dark:hover:bg-slate-700"
          title="Back"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </button>
      </div>

      {/* Wallet & Method */}
      <div className="mb-6 space-y-3 text-sm sm:flex sm:items-center sm:justify-between sm:space-y-0">
        <p className="text-slate-700 dark:text-slate-300">
          <span className="font-semibold">Current Wallet Balance:</span> $ {user?.balance}
        </p>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <div className="flex-1 sm:flex-none">
            <label className="mb-1 block text-xs text-slate-500 dark:text-slate-400">
              Payment Method
            </label>

            <select
              className="w-full rounded-md border border-slate-300 bg-transparent px-10 py-3 text-slate-800 dark:border-slate-700 dark:text-white"
              value="Bank Transfer"
              disabled
            >
              <option>Bank Transfer</option>
            </select>
          </div>

          <div className="flex-1 sm:flex-none">
            <label className="mb-1 block text-xs text-slate-500 dark:text-slate-400">
              Currency
            </label>

            <select
              className="w-full rounded-md border border-slate-300 bg-transparent px-10 py-3 text-slate-800 dark:border-slate-700 dark:text-white"
              value="USD"
              disabled
            >
              <option>USD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="mb-6 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
        <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
          Bank Details
        </h3>
        {isLoading ? (
          <div className="text-sm text-slate-500 dark:text-slate-400">Loading bank details...</div>
        ) : (bankDetails?.length ?? 0) > 0 ? (
          bankDetails?.map((bank) => (
            <div
              key={bank.id}
              className="grid grid-cols-1 gap-3 border-b border-slate-200 pb-4 text-sm last:border-0 last:pb-0 sm:grid-cols-2 dark:border-slate-700"
            >
              <p className="font-medium text-slate-600 dark:text-slate-300">
                Bank Name: <span className="font-normal">{bank.bankname || "-"}</span>
              </p>

              <p className="font-medium text-slate-600 dark:text-slate-300">
                Account Holder: <span className="font-normal">{bank.accname || "-"}</span>
              </p>

              <p className="font-medium text-slate-600 dark:text-slate-300">
                Account Number: <span className="font-normal">{bank.accno || "-"}</span>
              </p>

              <p className="font-medium text-slate-600 dark:text-slate-300">
                IFSC Code/SWIFT Code: <span className="font-normal">{bank.ifsc || "-"}</span>
              </p>

              <p className="font-medium text-slate-600 sm:col-span-2 dark:text-slate-300">
                IBAN Number: <span className="font-normal">{bank.iban_number || "-"}</span>
              </p>
            </div>
          ))
        ) : (
          <div className="text-sm text-slate-500 dark:text-slate-400">No bank details found</div>
        )}
      </div>

      {/* Deposit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount + Transaction ID */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Amount */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              min="0"
              step="0.01"
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              className="hide-number-spinner w-full rounded-lg border border-slate-300 bg-transparent px-4 py-3 text-slate-800 dark:border-slate-700 dark:text-white"
            />

            {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
          </div>

          {/* Transaction ID */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Transaction ID
            </label>

            <input
              type="text"
              name="transactionId"
              value={formData.transactionId}
              onChange={handleChange}
              placeholder="Enter transaction ID"
              className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-3 text-slate-800 dark:border-slate-700 dark:text-white"
            />

            {errors.transactionId && (
              <p className="mt-1 text-sm text-red-500">{errors.transactionId}</p>
            )}
          </div>
        </div>

        {/* Remarks + Receipt */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
              className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-3 text-slate-800 dark:border-slate-700 dark:text-white"
            />

            {errors.remarks && <p className="mt-1 text-sm text-red-500">{errors.remarks}</p>}
          </div>

          {/* Receipt */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Receipt
            </label>

            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-slate-300 px-4 py-3 transition hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Upload className="h-4 w-4" />

                <span className="truncate">
                  {formData.receipt ? formData.receipt.name : "Upload receipt"}
                </span>
              </div>

              <input
                type="file"
                name="receipt"
                onChange={handleChange}
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
              />
            </label>

            {errors.receipt && <p className="mt-1 text-sm text-red-500">{errors.receipt}</p>}
          </div>
        </div>

        {message && <FormMessage message={message} />}

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
              className="mt-1 h-4 w-4 accent-[#465FFF]"
            />

            <label htmlFor="acceptTerms" className="flex-1 cursor-pointer">
              <span className="font-semibold">Accept Terms and Conditions</span>
              <br />
              By clicking <strong>Make Deposit</strong>, you agree to the Terms and Conditions of
              Novotrend Ltd.
            </label>
          </div>

          {errors.acceptTerms && <p className="mt-2 text-sm text-red-500">{errors.acceptTerms}</p>}
        </div>
        {/* Buttons */}
        <div className="flex flex-col justify-end gap-3 border-t border-slate-200 pt-4 sm:flex-row dark:border-slate-700">
          <button
            type="button"
            onClick={onBack}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!acceptedTerms || isPending}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Processing..." : "Deposit"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
