import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchSupportCategories,
  createSupportTicket,
  fetchSupportTickets,
  fetchTicketDetail,
  submitChatRemark,
} from "../api/team-support.api";
import { SubmitRemarkPayload, SubmitTicketPayload } from "../types/team-support.types";

//  Query Keys
export const SUPPORT_KEYS = {
  categories: ["support", "categories"] as const,
  tickets: ["support", "tickets"] as const,
  detail: (id: string) => ["support", "detail", id] as const,
};

//  Categories

export function useSupportCategories() {
  return useQuery({
    queryKey: SUPPORT_KEYS.categories,
    queryFn: fetchSupportCategories,
    staleTime: 5 * 60 * 1000, // 5 min — categories change rarely
  });
}

// Ticket list

export function useSupportTickets() {
  return useQuery({
    queryKey: SUPPORT_KEYS.tickets,
    queryFn: fetchSupportTickets,
  });
}

// Create ticket

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitTicketPayload) => createSupportTicket(payload),
    onSuccess: (data) => {
      if (data.status === 200) {
        // refetch ticket list after successful creation
        queryClient.invalidateQueries({ queryKey: SUPPORT_KEYS.tickets });
      }
    },
  });
}

export function useSupportDetail(
  ticketId: string | null,
  options?: { refetchInterval?: number; refetchIntervalInBackground?: boolean }
) {
  return useQuery({
    queryKey: SUPPORT_KEYS.detail(ticketId ?? ""),
    queryFn: async () => {
      if (!ticketId) return null;
      const data = await fetchTicketDetail(ticketId);
      return data ?? null;
    },
    enabled: !!ticketId,
    refetchInterval: options?.refetchInterval ?? 8000,
    refetchIntervalInBackground: options?.refetchIntervalInBackground ?? false,
  });
}

// Submit chat remark
export function useSubmitRemark(ticketId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitRemarkPayload) => submitChatRemark(payload),
    onSuccess: (data) => {
      if (data.status === 200 && ticketId) {
        queryClient.invalidateQueries({ queryKey: SUPPORT_KEYS.detail(ticketId) });
      }
    },
  });
}