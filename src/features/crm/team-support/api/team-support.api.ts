import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/endpoints";
import {
  SubmitRemarkPayload,
  SubmitTicketPayload,
  SupportCategory,
  SupportTicket,
  SupportTicketDetail,
} from "../types/team-support.types";

// ── Fetch categories
export async function fetchSupportCategories(): Promise<SupportCategory[]> {
  const res = await api.post<{ data: { status: number; response: SupportCategory[] } }>(
    API_ENDPOINTS.CRM.GET_SUPPORT_TICKET
  );
  return res.data.data.response ?? [];
}

// ── Fetch ticket list
export async function fetchSupportTickets(): Promise<SupportTicket[]> {
  const res = await api.post<{ data: { status: number; response: SupportTicket[] } }>(
    API_ENDPOINTS.CRM.OPEN_SUPPORT_TICKET_LIST,
    { type: "all" }
  );
  return res.data.data.response ?? [];
}

// ── Submit new ticket
export async function createSupportTicket(
  payload: SubmitTicketPayload
): Promise<{ status: number; result: string }> {
  const formData = new FormData();
  formData.append("sup_mst_id", payload.sup_mst_id);
  formData.append("s_question", payload.s_question);
  if (payload.s_file_name) formData.append("s_file_name", payload.s_file_name);

  const res = await api.post<{ data: { status: number; result: string } }>(
    API_ENDPOINTS.CRM.CREATE_SUPPORT_TICKET,
    formData
  );
  return res.data.data;
}

export async function fetchTicketDetail(ticketId: string): Promise<SupportTicketDetail | null> {
  const res = await api.post<{
    data: { status: number; response: SupportTicketDetail[] | SupportTicketDetail };
  }>(API_ENDPOINTS.CRM.OPEN_SUPPORT_TICKET_DETAILS, { sudelid: ticketId });

  const data = res.data.data;
  if (!data || data.status !== 200) return null;

  const raw = data.response;
  // old code: response is array → take first element
  const detail = Array.isArray(raw) ? raw[0] : raw;
  return detail ?? null;
}

// ── Submit chat remark
export async function submitChatRemark(
  payload: SubmitRemarkPayload
): Promise<{ status: number; result: string }> {
  const formData = new FormData();
  formData.append("sudelid", payload.sudelid);
  formData.append("remakrusers", payload.remakrusers);
  if (payload.s_file_name) formData.append("s_file_name", payload.s_file_name);

  const res = await api.post<{ data: { status: number; result: string } }>(
    API_ENDPOINTS.CRM.ADD_REMARK_CREATE_SUPPORT_TICKET,
    formData
  );
  return res.data.data;
}
