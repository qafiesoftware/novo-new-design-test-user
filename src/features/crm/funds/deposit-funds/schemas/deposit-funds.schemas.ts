import { API_ENDPOINTS } from "@/constants/endpoints";
import { z } from "zod";
import { CryptoNetwork } from "../types/deposit-funds.types";

export const depositFundsSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => Number(val) > 0, {
      message: "Amount must be greater than 0",
    }),

  transactionId: z
    .string()
    .min(1, "Transaction ID is required")
    .max(100, "Transaction ID is too long"),

  remarks: z.string().max(500, "Remarks cannot exceed 500 characters").optional().or(z.literal("")),

  receipt: z
    .any()
    .refine((file) => file instanceof File || file === null, {
      message: "Please upload a valid file",
    })
    .refine(
      (file) => {
        if (!file) return true;

        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

        return allowedTypes.includes(file.type);
      },
      {
        message: "Only JPG, PNG, and PDF files are allowed",
      }
    )
    .refine(
      (file) => {
        if (!file) return true;

        const maxSize = 2 * 1024 * 1024; // 2MB
        return file.size <= maxSize;
      },
      {
        message: "File size must be less than 2MB",
      }
    ),
});

export type DepositFundsFormValues = z.infer<typeof depositFundsSchema>;

// Cash Deposit Validation Schema

export const cashDepositSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => Number(val) > 0, {
      message: "Amount must be greater than 0",
    }),

  remark: z.string().min(1, "Remark is required").max(500, "Remark cannot exceed 500 characters"),
});

export type CashDepositFormValues = z.infer<typeof cashDepositSchema>;

// wallet generate schema

export const cryptoDepositSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)), { message: "Invalid amount" }),
  termsAccepted: z.literal(true, {
    message: "You must accept Terms and Conditions",
  }),
});

export type CryptoDepositSchema = z.infer<typeof cryptoDepositSchema>;

export const NETWORK_GENERATE_MAP: Record<CryptoNetwork, string> = {
  BEP20: API_ENDPOINTS.CRM.GENERATE_WALLECT_BINANCE, // apna constant daalo
  TRC20: API_ENDPOINTS.CRM.GENERATE_WALLECT_TRON,
  ETH20: API_ENDPOINTS.CRM.GENERATE_WALLECT_ETHEREUM,
  MATIC20: API_ENDPOINTS.CRM.GENERATE_WALLECT_POLYGON,
};
