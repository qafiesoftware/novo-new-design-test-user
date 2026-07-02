import { z } from "zod";

export const bankWithdrawSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)), { message: "Invalid amount" })
    .refine((val) => parseFloat(val) > 0, { message: "Amount must be greater than 0" }),

  remark: z.string().optional(),

  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must be numeric"),
});

export type BankWithdrawSchema = z.infer<typeof bankWithdrawSchema>;

// CASH withdrawal schema

export const cashWithdrawSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)), { message: "Invalid amount" })
    .refine((val) => parseFloat(val) > 0, { message: "Amount must be greater than 0" }),

  remark: z.string().optional(),

  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),

  termsAccepted: z.literal(true, {
    message: "You must accept Terms and Conditions",
  }),
});

export type CashWithdrawSchema = z.infer<typeof cashWithdrawSchema>;

// CRYPTO withdrawal schema

export const cryptoWithdrawSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)), { message: "Invalid amount" })
    .refine((val) => parseFloat(val) > 0, { message: "Amount must be greater than 0" }),

  walletaddress: z
    .string()
    .min(1, "Wallet address is required")
    .min(10, "Please enter a valid wallet address"),

  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),

  termsAccepted: z.literal(true, {
    message: "You must accept Terms and Conditions",
  }),
});

export type CryptoWithdrawSchema = z.infer<typeof cryptoWithdrawSchema>;

// Chain display meta
export const CHAIN_META: Record<string, { label: string; icon: string }> = {
  bsc: { label: "BSC (BEP20)", icon: "🟡" },
  tron: { label: "Tron (TRC20)", icon: "🔴" },
  eth: { label: "Ethereum (ERC20)", icon: "🔷" },
  polygon: { label: "Polygon (MATIC)", icon: "🟣" },
};
