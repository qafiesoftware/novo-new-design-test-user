import { z } from "zod";

export const submitTicketSchema = z.object({
  category: z.string().min(1, "Please select a support type"),
  question: z.string().min(5, "Question must be at least 5 characters"),
});

export const submitRemarkSchema = z.object({
  remakrusers: z.string().min(1, "Message cannot be empty"),
});

export type SubmitTicketSchema = z.infer<typeof submitTicketSchema>;
export type SubmitRemarkSchema = z.infer<typeof submitRemarkSchema>;