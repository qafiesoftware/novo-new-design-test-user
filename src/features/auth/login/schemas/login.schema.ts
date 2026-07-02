import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter your email address"),
  password: z.string().min(1, "Please enter your password"),
});

export type LoginFormData = z.infer<typeof loginSchema>;