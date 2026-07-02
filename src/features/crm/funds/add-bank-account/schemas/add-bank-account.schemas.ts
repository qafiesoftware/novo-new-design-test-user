import { z } from "zod";

export const bankAccountSchema = z.object({
  bankname: z
    .string()
    .min(1, "Bank name is required")
    .min(3, "Bank name must be at least 3 characters"),

  accname: z
    .string()
    .min(1, "Account holder name is required")
    .min(3, "Bank holder name must be at least 3 characters"),

  accno: z
    .string()
    .min(1, "Account number is required")
    .regex(/^\d+$/, "Only digits allowed")
    .min(9, "Account number must be at least 9 digits"),

  ifsc: z
    .string()
    .min(1, "IFSC code is required")
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC format (e.g., HDFC0001234)"),

  iban_number: z
    .union([
      z
        .string()
        .regex(
          /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/,
          "Invalid IBAN format (e.g., GB29NWBK60161331926819)"
        ),
      z.literal(""),
    ])
    .optional(),

  bankaddress: z
    .string()
    .min(1, "Bank address is required")
    .min(15, "Bank address must be at least 15 characters long"),
});

export type BankAccountFormData = z.infer<typeof bankAccountSchema>;
