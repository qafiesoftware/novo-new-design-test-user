import { z } from "zod";

const baseSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)), { message: "Invalid amount" })
    .refine((val) => parseFloat(val) > 0, { message: "Amount must be greater than 0" }),

  note: z.string().optional(),

  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),

  termsAccepted: z.literal(true, {
    message: "You must accept Terms and Conditions",
  }),
});

// MT5 → Wallet
export const mt5ToWalletSchema = baseSchema.extend({
  mt5accountselect: z.string().min(1, "Please select an MT5 account"),
});

// Wallet → MT5
export const walletToMT5Schema = baseSchema.extend({
  mt5accountselect: z.string().min(1, "Please select an MT5 account"),
});

export const mt5ToMT5Schema = baseSchema
  .extend({
    senderid: z.string().min(1, "Please select a From account"),
    receiverid: z.string().min(1, "Please select a To account"), // ← change
  })
  .refine(
    (data) => data.senderid !== data.receiverid, // ← change
    { message: "From and To accounts cannot be the same", path: ["receiverid"] }
  );

export type MT5ToWalletSchema = z.infer<typeof mt5ToWalletSchema>;
export type WalletToMT5Schema = z.infer<typeof walletToMT5Schema>;
export type MT5ToMT5Schema = z.infer<typeof mt5ToMT5Schema>;
