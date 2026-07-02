"use client";

import React, { useEffect, useState, useRef } from "react";
import { Upload } from "lucide-react";
import Image from "next/image";
import IdCard from "../../../../public/images/cards/dummy.webp";

import FormMessage from "@/common/UI/FormMessage";
import {
  useAddUserBank,
  useGetUserBankDetails,
} from "@/features/crm/funds/add-bank-account/hooks/add-bank-account.hook";
import {
  BankAccountFormData,
  bankAccountSchema,
} from "@/features/crm/funds/add-bank-account/schemas/add-bank-account.schemas";

interface FormErrors {
  bankname?: string;
  accname?: string;
  accno?: string;
  ifsc?: string;
  iban_number?: string;
  bankaddress?: string;
}

export default function NewAccount() {
  const [preview, setPreview] = useState<string | null>(IdCard.src);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bankStatus, setBankStatus] = useState("Not Submit");
  const [isEdited, setIsEdited] = useState(false);

  const [formData, setFormData] = useState<BankAccountFormData>({
    bankname: "",
    accname: "",
    accno: "",
    ifsc: "",
    iban_number: "",
    bankaddress: "",
  });

  // Original data snapshot for dirty check
  const originalData = useRef<BankAccountFormData>({
    bankname: "",
    accname: "",
    accno: "",
    ifsc: "",
    iban_number: "",
    bankaddress: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const { bankDetails, isLoading, refetch } = useGetUserBankDetails();
  const { mutate: addUserBank, isPending, message } = useAddUserBank();

  useEffect(() => {
    if (bankDetails) {
      const populated: BankAccountFormData = {
        bankname: bankDetails.bankname || "",
        accname: bankDetails.accholder || "",
        accno: bankDetails.accno || "",
        ifsc: bankDetails.ifsc || "",
        iban_number: bankDetails.iban || "",
        bankaddress: bankDetails.kyc_bank_address || "",
      };

      setFormData(populated);
      originalData.current = populated;

      if (bankDetails.image) {
        setPreview(bankDetails.image);
      }

      setBankStatus(bankDetails.status || "Not Submit");
      setIsEdited(false);
    }
  }, [bankDetails]);

  // Dirty check — compare current formData with original snapshot
  useEffect(() => {
    const isDirty = (Object.keys(formData) as (keyof BankAccountFormData)[]).some(
      (key) => formData[key] !== originalData.current[key]
    );

    setIsEdited(isDirty || selectedFile !== null);
  }, [formData, selectedFile]);

  const validateForm = (): boolean => {
    const result = bankAccountSchema.safeParse({
      ...formData,
      ifsc: formData.ifsc.toUpperCase(),
    });

    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: FormErrors = {};
    const flattened = result.error.flatten().fieldErrors;

    (Object.keys(flattened) as (keyof FormErrors)[]).forEach((field) => {
      const msgs = flattened[field];
      if (msgs && msgs.length > 0) {
        fieldErrors[field] = msgs[0];
      }
    });

    setErrors(fieldErrors);
    return false;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let finalValue = value;

    if (name === "accname") {
      finalValue = value.replace(/[^A-Za-z ]/g, "");
    }

    if (name === "bankname") {
      finalValue = value.replace(/[0-9]/g, "");
    }

    if (name === "accno") {
      finalValue = value.replace(/[^0-9]/g, "");
    }

    if (name === "ifsc") {
      finalValue = value.toUpperCase();
    }

    if (name === "iban_number") {
      finalValue = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    addUserBank(
      {
        ...formData,
        ifsc: formData.ifsc.toUpperCase(),
        kyc_bank_image: selectedFile,
        status: "Pending",
      },
      {
        onSuccess: () => {
          refetch();
          setIsEdited(false);
          originalData.current = { ...formData, ifsc: formData.ifsc.toUpperCase() };
        },
      }
    );
  };

  // Field config for clean rendering
  const fields: {
    name: keyof BankAccountFormData;
    label: string;
    placeholder: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
    pattern?: string;
  }[] = [
    {
      name: "bankname",
      label: "Bank Name",
      inputMode: "text",
      placeholder: "e.g. HDFC Bank",
    },
    {
      name: "accname",
      label: "Account Holder Name",
      inputMode: "text",
      placeholder: "e.g. Rahul Sharma",
    },
    {
      name: "accno",
      label: "Account Number",
      placeholder: "e.g. 123456789",
      inputMode: "numeric",
      pattern: "[0-9]*",
    },
    {
      name: "ifsc",
      label: "IFSC Code",
      placeholder: "e.g. HDFC0001234",
    },
    {
      name: "iban_number",
      label: "IBAN Number",
      placeholder: "e.g. IN00HDFC0001234567890",
    },
    {
      name: "bankaddress",
      label: "Bank Address",
      placeholder: "e.g. 12, MG Road, Bengaluru - 560001",
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-xl md:p-10 dark:border-slate-700 dark:bg-slate-900">
        {/* Header */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
              Add New Bank Account
            </h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Enter your bank details carefully and upload your proof below.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Status:
              <span
                className={`ml-2 font-semibold ${
                  bankStatus?.toLowerCase() === "approved"
                    ? "text-green-500"
                    : bankStatus?.toLowerCase() === "pending"
                      ? "text-yellow-500"
                      : bankStatus?.toLowerCase() === "rejected"
                        ? "text-red-500"
                        : "text-gray-500"
                }`}
              >
                {isLoading ? "Loading..." : bankStatus}
              </span>
            </p>
          </div>
        </div>

        {/* Message */}
        {message && <FormMessage message={message} />}

        <br />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid Inputs */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {fields.map(({ name, label, placeholder, inputMode, pattern }) => (
              <div key={name} className="flex flex-col gap-1">
                <label
                  htmlFor={name}
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  {label}
                  {name !== "iban_number" && <span className="ml-1 text-red-500">*</span>}
                </label>
                <input
                  id={name}
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  inputMode={inputMode}
                  pattern={pattern}
                  autoComplete="off"
                  className={`w-full rounded-lg border bg-transparent px-4 py-3 text-sm transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                    errors[name]
                      ? "border-red-400 focus:ring-red-400"
                      : "border-slate-300 dark:border-slate-600"
                  } dark:text-white dark:placeholder-slate-500`}
                />
                {errors[name] && <p className="mt-0.5 text-xs text-red-500">{errors[name]}</p>}
              </div>
            ))}
          </div>

          {/* Upload */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Bank Proof Image
            </label>
            <div className="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 transition-colors hover:border-indigo-400 hover:bg-indigo-50/30 dark:border-slate-600 dark:bg-slate-800">
              <label className="flex cursor-pointer flex-col items-center gap-3">
                <Upload className="h-6 w-6 text-indigo-600" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {selectedFile ? selectedFile.name : "Click to upload (JPG, JPEG, PNG — max 2MB)"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {/* Preview */}
          {preview && (
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="relative h-56 w-full sm:h-64">
                <Image
                  src={preview}
                  alt="Bank Proof Preview"
                  fill
                  className="rounded-xl object-contain"
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isPending || !isEdited}
              className={`rounded-lg px-8 py-3 text-sm font-semibold text-white transition-all ${
                isPending || !isEdited
                  ? "cursor-not-allowed bg-indigo-300 dark:bg-indigo-800"
                  : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
              }`}
            >
              {isPending ? "Processing..." : "Add Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
