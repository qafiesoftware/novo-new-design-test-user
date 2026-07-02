import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password at least 8 characters"),
    confirmpassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;