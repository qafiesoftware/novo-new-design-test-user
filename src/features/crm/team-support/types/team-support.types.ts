export type SupportStatus = "idle" | "loading" | "error";
export type SubmitStatus = "idle" | "submitting" | "success" | "error";

// Category (from API)
export interface SupportCategory {
  s_mast_id: string;
  s_category: string;
}

//  Ticket list item
export interface SupportTicket {
  ticket_id: string;
  ticket_name: string;
  s_question: string;
  s_file_name: string | null;
  s_status: "Open" | "Closed";
  s_date: string;
  sr_no: number;
}

//  Ticket detail (single ticket info)
export interface SupportTicketDetail {
  sr_no: number;
  ticket_name: string;
  s_question: string;
  s_file_name: string | null;
  s_status: "Open" | "Closed";
  s_date: string;
  details_list: ChatMessage[]; // chat messages
}

//  Chat message
export interface ChatMessage {
  chatstatus: "UserChat" | "AdminChat";
  sup_del_remak: string; // message text
  supp_del_file_name: string | null; // attachment in message
  s_date: string; // "DD-MM-YYYY HH:mm:ss"
  user_name: string;
  user_img: string; // admin avatar
  s_file_name?: string; // user avatar
}

//  Hook states
export interface UseSupportReturn {
  categories: SupportCategory[];
  tickets: SupportTicket[];
  fetchStatus: SupportStatus;
  submitStatus: SubmitStatus;
  errorMessage: string;
  successMessage: string;
  fetchCategories: () => Promise<void>;
  fetchTickets: () => Promise<void>;
  submitTicket: (payload: SubmitTicketPayload) => Promise<void>;
  resetSubmit: () => void;
}

export interface UseSupportDetailReturn {
  ticketDetails: SupportTicketDetail | null;
  fetchStatus: SupportStatus;
  submitStatus: SubmitStatus;
  errorMessage: string;
  fetchDetail: (ticketId: string) => Promise<void>;
  submitRemark: (payload: SubmitRemarkPayload) => Promise<void>;
  resetSubmit: () => void;
}

// Payloads
export interface SubmitTicketPayload {
  sup_mst_id: string;
  s_question: string;
  s_file_name?: File;
}

export interface SubmitRemarkPayload {
  sudelid: string;
  remakrusers: string;
  s_file_name?: File;
}