import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter your email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;