"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import {
  Paperclip,
  Send,
  Loader2,
  AlertCircle,
  ArrowLeft,
  FileText,
  CheckCheck,
  Lock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  useSupportDetail,
  useSubmitRemark,
} from "@/features/crm/team-support/hooks/team-support.hooks";
import type { ChatMessage } from "@/features/crm/team-support/types/team-support.types";
import InitialsAvatar from "../ui/avtar/InitialsAvatarChat";

// Motion variants
const msgVariants: Variants = {
  hiddenLeft: { opacity: 0, x: -16, scale: 0.97 },
  hiddenRight: { opacity: 0, x: 16, scale: 0.97 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
};

// Helpers
function getTime(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split(" ");
  return parts[1] ?? "";
}

function getDateLabel(dateStr: string): string {
  if (!dateStr) return "";
  return dateStr.split(" ")[0] ?? "";
}

function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url);
}

// Component
export default function SupportChat() {
  const router = useRouter();
  const params = useParams();
  const ticketId = (params?.ID as string) ?? null;

  // Auto-polling every 8s
  const { data: ticketDetails, isLoading } = useSupportDetail(ticketId, {
    refetchInterval: 8000,
    refetchIntervalInBackground: false,
  });

  const submitRemark = useSubmitRemark(ticketId);

  const [remark, setRemark] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [ticketExpanded, setTicketExpanded] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevMsgCount = useRef<number>(0);

  // Scroll to bottom only when new messages arrive
  useEffect(() => {
    const msgs = ticketDetails?.details_list ?? [];
    if (msgs.length !== prevMsgCount.current) {
      prevMsgCount.current = msgs.length;
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }
  }, [ticketDetails?.details_list]);

  // Reset after send
  useEffect(() => {
    if (submitRemark.isSuccess && submitRemark.data?.status === 200) {
      setRemark("");
      setFile(null);
      setFileName("");
      submitRemark.reset();
    }
  }, [submitRemark.isSuccess, submitRemark.data]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remark.trim() || !ticketId) return;
    submitRemark.mutate({
      sudelid: ticketId,
      remakrusers: remark,
      s_file_name: file ?? undefined,
    });
  };

  const handleFile = (f: File | null) => {
    setFile(f);
    setFileName(f?.name ?? "");
  };

  // Derived
  const isClosed = ticketDetails?.s_status === "Closed";
  const isSending = submitRemark.isPending;

  const chatMessages: ChatMessage[] = ticketDetails?.details_list?.slice().reverse() ?? [];

  const adminName = chatMessages.find((m) => m.chatstatus !== "UserChat")?.user_name ?? "Support";

  const sendError = submitRemark.isError
    ? "Something went wrong. Please try again."
    : submitRemark.data?.status !== 200 && submitRemark.data?.result
      ? submitRemark.data.result
      : "";

  // Group messages by date for dividers
  const messageGroups: { date: string; msgs: ChatMessage[] }[] = [];
  chatMessages.forEach((msg) => {
    const d = getDateLabel(msg.s_date);
    const last = messageGroups[messageGroups.length - 1];
    if (!last || last.date !== d) {
      messageGroups.push({ date: d, msgs: [msg] });
    } else {
      last.msgs.push(msg);
    }
  });

  // Render
  return (
    <div className="flex h-[calc(100vh-110px)] flex-col bg-[#e5ddd5] dark:bg-[#0d1117]">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 bg-[#3963ab] px-4 py-3 dark:bg-[#1a2f2b]">
        <button
          onClick={() => router.back()}
          className="shrink-0 rounded-full p-1.5 text-white/80 transition hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {isLoading ? (
          <div className="h-9 w-9 animate-pulse rounded-full bg-white/20" />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#128C7E] text-sm font-medium text-white">
            {adminName?.[0]?.toUpperCase() ?? "S"}
          </div>
        )}

        <div className="min-w-0 flex-1">
          {isLoading ? (
            <>
              <div className="mb-1 h-3.5 w-32 animate-pulse rounded bg-white/20" />
              <div className="h-2.5 w-20 animate-pulse rounded bg-white/20" />
            </>
          ) : (
            <>
              <p className="truncate text-sm font-medium text-white">{adminName}</p>
              <p className="text-[11px] text-white/70">
                Ticket #{ticketId}
                {ticketDetails?.s_status && (
                  <span
                    className={
                      ticketDetails.s_status === "Open" ? "text-green-300" : "text-red-300"
                    }
                  >
                    {" "}
                    · {ticketDetails.s_status}
                  </span>
                )}
              </p>
            </>
          )}
        </div>

        {/* Live polling indicator */}
        {/* <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60" />
          <span className="text-[10px] text-white/60">Auto-updating</span>
        </div> */}
      </div>

      {/* ── Collapsible ticket info strip ── */}
      {!isLoading && ticketDetails && (
        <div className="border-b border-[#c8e6c9] bg-[#e8f5e9] dark:border-[#2d4a30] dark:bg-[#1b2b1e]">
          <button
            onClick={() => setTicketExpanded((p) => !p)}
            className="flex w-full items-center gap-2 px-4 py-2 text-left"
          >
            <span className="rounded-full bg-[#25D366] px-2.5 py-0.5 text-[11px] font-medium text-white">
              {ticketDetails.s_status}
            </span>
            <span className="flex-1 truncate text-[11px] text-gray-600 dark:text-gray-400">
              {ticketDetails.s_question}
            </span>
            <span className="shrink-0 text-[11px] text-gray-400">{ticketDetails.s_date}</span>
            {ticketExpanded ? (
              <ChevronUp className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            )}
          </button>

          {ticketExpanded && (
            <div className="border-t border-[#c8e6c9] px-4 py-3 dark:border-[#2d4a30]">
              <div className="grid grid-cols-2 gap-y-2 text-[11px]">
                <span className="text-gray-500 dark:text-gray-400">Ticket name</span>
                <span className="text-right text-gray-800 dark:text-gray-200">
                  {ticketDetails.ticket_name}
                </span>
                <span className="text-gray-500 dark:text-gray-400">Question</span>
                <span className="text-right text-gray-800 dark:text-gray-200">
                  {ticketDetails.s_question}
                </span>
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <span className="text-right">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      ticketDetails.s_status === "Open"
                        ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                    }`}
                  >
                    {ticketDetails.s_status}
                  </span>
                </span>
                <span className="text-gray-500 dark:text-gray-400">Date</span>
                <span className="text-right text-gray-800 dark:text-gray-200">
                  {ticketDetails.s_date}
                </span>
                {ticketDetails.s_file_name && (
                  <>
                    <span className="text-gray-500 dark:text-gray-400">Attachment</span>
                    <span className="text-right">
                      <a
                        href={ticketDetails.s_file_name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#075E54] underline dark:text-green-400"
                      >
                        View file
                      </a>
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chat messages */}
      <div
        ref={chatRef}
        className="flex-1 space-y-1 overflow-y-auto px-3 py-4 dark:[background-color:#0d1117]"
        style={{
          scrollbarWidth: "thin",
          backgroundColor: "#efeae2",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='412' height='412' viewBox='0 0 412 412'%3E%3Cg opacity='0.03'%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='%23000' stroke-width='1'/%3E%3Ccircle cx='150' cy='50' r='30' fill='none' stroke='%23000' stroke-width='1'/%3E%3Ccircle cx='250' cy='50' r='30' fill='none' stroke='%23000' stroke-width='1'/%3E%3Ccircle cx='350' cy='50' r='30' fill='none' stroke='%23000' stroke-width='1'/%3E%3Ccircle cx='50' cy='150' r='30' fill='none' stroke='%23000' stroke-width='1'/%3E%3Ccircle cx='150' cy='150' r='30' fill='none' stroke='%23000' stroke-width='1'/%3E%3Ccircle cx='250' cy='150' r='30' fill='none' stroke='%23000' stroke-width='1'/%3E%3Ccircle cx='350' cy='150' r='30' fill='none' stroke='%23000' stroke-width='1'/%3E%3Ccircle cx='50' cy='250' r='30' fill='none' stroke='%23000' stroke-width='1'/%3E%3Ccircle cx='150' cy='250' r='30' fill='none' stroke='%23000' stroke-width='1'/%3E%3Ccircle cx='250' cy='250' r='30' fill='none' stroke='%23000' stroke-width='1'/%3E%3Ccircle cx='350' cy='250' r='30' fill='none' stroke='%23000' stroke-width='1'/%3E%3Ccircle cx='50' cy='350' r='30' fill='none' stroke='%23000' stroke-width='1'/%3E%3Ccircle cx='150' cy='350' r='30' fill='none' stroke='%23000' stroke-width='1'/%3E%3Ccircle cx='250' cy='350' r='30' fill='none' stroke='%23000' stroke-width='1'/%3E%3Ccircle cx='350' cy='350' r='30' fill='none' stroke='%23000' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      >
        {isLoading ? (
          <div className="space-y-4 px-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex items-end gap-2 ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`h-7 w-7 rounded-full bg-white/30 dark:bg-white/10 ${i % 2 === 0 ? "order-last" : ""}`}
                />
                <div className="h-10 w-48 animate-pulse rounded-xl bg-white/50 dark:bg-white/10" />
              </div>
            ))}
          </div>
        ) : chatMessages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/40 dark:bg-white/10">
              <Send className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messageGroups.map(({ date, msgs }) => (
            <div key={date}>
              {/* Date divider */}
              {date && (
                <div className="my-3 flex items-center justify-center">
                  <span className="rounded-full bg-white/70 px-3 py-0.5 text-[11px] text-gray-500 shadow-sm dark:bg-slate-800 dark:text-gray-400">
                    {date}
                  </span>
                </div>
              )}

              {msgs.map((msg: ChatMessage, idx: number) => {
                const isUser = msg.chatstatus === "UserChat";
                const time = getTime(msg.s_date);
                // const isFirst = idx === 0 || msgs[idx - 1]?.chatstatus !== msg.chatstatus;
                const isLast =
                  idx === msgs.length - 1 || msgs[idx + 1]?.chatstatus !== msg.chatstatus;

                return (
                  <motion.div
                    key={idx}
                    variants={msgVariants}
                    initial={isUser ? "hiddenRight" : "hiddenLeft"}
                    animate="visible"
                    className={`flex items-end gap-1.5 ${isUser ? "justify-end" : "justify-start"} ${
                      isLast ? "mb-2" : "mb-0.5"
                    }`}
                  >
                    {/* Admin avatar — only on last of group */}
                    {!isUser && (
                      <div className="flex w-7 shrink-0 items-end">
                        {isLast ? (
                          <InitialsAvatar name={msg.user_name ?? "Admin"} size={28} />
                        ) : null}
                      </div>
                    )}

                    <div
                      className={`flex max-w-[75%] flex-col ${isUser ? "items-end" : "items-start"}`}
                    >
                      {/* Bubble */}
                      <div
                        className={`relative px-3.5 py-2 text-sm leading-relaxed shadow-sm ${
                          isUser
                            ? "rounded-2xl rounded-br-sm bg-[#dcf8c6] text-gray-900 dark:bg-[#005c4b] dark:text-gray-100"
                            : "rounded-2xl rounded-bl-sm bg-white text-gray-900 dark:bg-[#1e2a35] dark:text-gray-100"
                        }`}
                      >
                        {/* Attachment */}
                        {msg.supp_del_file_name && (
                          <div className="mb-1.5">
                            {isImageUrl(msg.supp_del_file_name) ? (
                              <a
                                href={msg.supp_del_file_name}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Image
                                  src={msg.supp_del_file_name}
                                  alt="attachment"
                                  width={200}
                                  height={140}
                                  className="rounded-xl object-cover"
                                />
                              </a>
                            ) : (
                              <a
                                href={msg.supp_del_file_name}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs hover:bg-gray-100 dark:border-gray-600 dark:bg-slate-700"
                              >
                                <FileText className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                                <span className="truncate text-gray-600 dark:text-gray-300">
                                  View attachment
                                </span>
                              </a>
                            )}
                          </div>
                        )}

                        {/* Text + Time inline — WhatsApp style */}
                        {msg.sup_del_remak && (
                          <p className="text-left leading-snug break-words">
                            {msg.sup_del_remak}
                            <span className="invisible inline-block w-16 text-[10px]">&nbsp;</span>
                          </p>
                        )}

                        {/* Time + tick — bottom right */}
                        <div className="absolute right-2.5 bottom-1.5 flex items-center gap-0.5">
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">
                            {time}
                          </span>
                          {isUser && <CheckCheck className="h-3 w-3 text-[#53bdeb]" />}
                        </div>
                      </div>
                    </div>

                    {/* User avatar — only on last of group */}
                    {isUser && (
                      <div className="flex w-7 shrink-0 items-end">
                        {isLast ? <InitialsAvatar name={msg.user_name ?? "You"} size={28} /> : null}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Input bar */}
      {!isClosed ? (
        <form
          onSubmit={handleSend}
          className="border-t border-gray-200 bg-[#f0f0f0] px-3 py-2 dark:border-slate-700 dark:bg-[#1a1a2e]"
        >
          {/* Send error */}
          {sendError && (
            <div className="mb-2 flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 text-xs text-red-500 dark:bg-red-900/20">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {sendError}
            </div>
          )}

          {/* File preview */}
          {fileName && (
            <div className="mb-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-300">
              <Paperclip className="h-3.5 w-3.5 shrink-0 text-[#25D366]" />
              <span className="flex-1 truncate">{fileName}</span>
              <button
                type="button"
                onClick={() => handleFile(null)}
                className="ml-auto shrink-0 text-gray-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Attach */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0 text-gray-500 transition hover:text-[#075E54] dark:text-gray-400 dark:hover:text-green-400"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />

            {/* Text input */}
            <div className="flex flex-1 items-center rounded-full bg-white px-4 py-2 dark:bg-[#2a2a3e]">
              <input
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Type a message…"
                autoComplete="off"
                className="flex-1 border-none bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none dark:text-white dark:placeholder-gray-500"
              />
            </div>

            {/* Send */}
            <button
              type="submit"
              disabled={isSending || !remark.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3949AB] text-white transition hover:bg-[#3949AB] disabled:opacity-50 dark:bg-[#128C7E] dark:hover:bg-[#0d7a6e]"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-center gap-2 border-t border-gray-200 bg-[#f0f0f0] px-6 py-4 text-sm text-gray-500 dark:border-slate-700 dark:bg-[#1a1a2e] dark:text-gray-400">
          <Lock className="h-3.5 w-3.5" />
          This ticket is closed. No further messages can be sent.
        </div>
      )}
    </div>
  );
}
