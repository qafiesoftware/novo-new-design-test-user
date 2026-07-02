import { z } from "zod";

export const registerSchema = z.object({
  first_name: z.string().min(3, "First name must be at least 3 characters"),
  last_name: z.string().min(3, "Last name must be at least 3 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  country_id: z.string().min(1, "Please select a country"),
  mobileno: z
    .string()
    .trim()
    .refine((val) => /^\d{10,12}$/.test(val), {
      message: "Enter a valid mobile number (8–12 digits)",
    }),

  partnercode: z
    .string()
    .trim()
    .refine((val) => val === "" || /^\d+$/.test(val), {
      message: "Partner code must contain only numbers",
    })
    .optional(),

  inputchecked: z.boolean().refine((val) => val === true, {
    message: "Please accept the terms",
  }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;