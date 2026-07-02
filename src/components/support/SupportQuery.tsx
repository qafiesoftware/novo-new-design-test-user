"use client";

import React, { useState, useRef, useEffect } from "react";
import { Paperclip, X, Send, Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  useCreateTicket,
  useSupportCategories,
} from "@/features/crm/team-support/hooks/team-support.hooks";
import { submitTicketSchema } from "@/features/crm/team-support/schemas/team-support.schemas";

const CONTACT_INFO = [
  {
    href: "mailto:support@novotrend.co",
    label: "support@novotrend.co",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        width="16"
        height="16"
        viewBox="0 0 479.058 479.058"
      >
        <path d="M434.146 59.882H44.912C20.146 59.882 0 80.028 0 104.794v269.47c0 24.766 20.146 44.912 44.912 44.912h389.234c24.766 0 44.912-20.146 44.912-44.912v-269.47c0-24.766-20.146-44.912-44.912-44.912zm0 29.941c2.034 0 3.969.422 5.738 1.159L239.529 264.631 39.173 90.982a14.902 14.902 0 0 1 5.738-1.159zm0 299.411H44.912c-8.26 0-14.971-6.71-14.971-14.971V122.615l199.778 173.141c2.822 2.441 6.316 3.655 9.81 3.655s6.988-1.213 9.81-3.655l199.778-173.141v251.649c-.001 8.26-6.711 14.97-14.971 14.97z" />
      </svg>
    ),
  },
  {
    href: "tel:+447472339580",
    label: "+44 7472 339580",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        width="16"
        height="16"
        viewBox="0 0 482.6 482.6"
      >
        <path d="M98.339 320.8c47.6 56.9 104.9 101.7 170.3 133.4 24.9 11.8 58.2 25.8 95.3 28.2 2.3.1 4.5.2 6.8.2 24.9 0 44.9-8.6 61.2-26.3.1-.1.3-.3.4-.5 5.8-7 12.4-13.3 19.3-20 4.7-4.5 9.5-9.2 14.1-14 21.3-22.2 21.3-50.4-.2-71.9l-60.1-60.1c-10.2-10.6-22.4-16.2-35.2-16.2-12.8 0-25.1 5.6-35.6 16.1l-35.8 35.8c-3.3-1.9-6.7-3.6-9.9-5.2-4-2-7.7-3.9-11-6-32.6-20.7-62.2-47.7-90.5-82.4-14.3-18.1-23.9-33.3-30.6-48.8 9.4-8.5 18.2-17.4 26.7-26.1 3-3.1 6.1-6.2 9.2-9.3 10.8-10.8 16.6-23.3 16.6-36s-5.7-25.2-16.6-36l-29.8-29.8c-3.5-3.5-6.8-6.9-10.2-10.4-6.6-6.8-13.5-13.8-20.3-20.1-10.3-10.1-22.4-15.4-35.2-15.4-12.7 0-24.9 5.3-35.6 15.5l-37.4 37.4c-13.6 13.6-21.3 30.1-22.9 49.2-1.9 23.9 2.5 49.3 13.9 80 17.5 47.5 43.9 91.6 83.1 138.7z" />
      </svg>
    ),
  },
  {
    href: null,
    label: "AMAHORO Village Remera Sector, City of Kigali UPI 501, Rwanda",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        width="16"
        height="16"
        viewBox="0 0 368.16 368.16"
      >
        <path d="M184.08 0c-74.992 0-136 61.008-136 136 0 24.688 11.072 51.24 11.536 52.36 3.576 8.488 10.632 21.672 15.72 29.4l93.248 141.288c3.816 5.792 9.464 9.112 15.496 9.112s11.68-3.32 15.496-9.104l93.256-141.296c5.096-7.728 12.144-20.912 15.72-29.4.464-1.112 11.528-27.664 11.528-52.36 0-74.992-61.008-136-136-136zM293.8 182.152c-3.192 7.608-9.76 19.872-14.328 26.8l-93.256 141.296c-1.84 2.792-2.424 2.792-4.264 0L88.696 208.952c-4.568-6.928-11.136-19.2-14.328-26.808-.136-.328-10.288-24.768-10.288-46.144 0-66.168 53.832-120 120-120s120 53.832 120 120c0 21.408-10.176 45.912-10.28 46.152z" />
        <path d="M184.08 64.008c-39.704 0-72 32.304-72 72s32.296 72 72 72 72-32.304 72-72-32.296-72-72-72zm0 128c-30.872 0-56-25.12-56-56s25.128-56 56-56 56 25.12 56 56-25.128 56-56 56z" />
      </svg>
    ),
  },
];

const SOCIALS = [
  {
    href: "https://www.facebook.com/novotrendforex",
    label: "Facebook",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={18}
        height={18}
        className="fill-slate-900"
        viewBox="0 0 24 24"
      >
        <path d="M6.812 13.937H9.33v9.312c0 .414.335.75.75.75l4.007.001a.75.75 0 0 0 .75-.75v-9.312h2.387a.75.75 0 0 0 .744-.657l.498-4a.75.75 0 0 0-.744-.843h-2.885c.113-2.471-.435-3.202 1.172-3.202 1.088-.13 2.804.421 2.804-.75V.909a.75.75 0 0 0-.648-.743A26.926 26.926 0 0 0 15.071 0c-7.01 0-5.567 7.772-5.74 8.437H6.812a.75.75 0 0 0-.75.75v4c0 .414.336.75.75.75zm.75-3.999h2.518a.75.75 0 0 0 .75-.75V6.037c0-2.883 1.545-4.536 4.24-4.536.878 0 1.686.043 2.242.087v2.149c-.402.205-3.976-.884-3.976 2.697v2.755c0 .414.336.75.75.75h2.786l-.312 2.5h-2.474a.75.75 0 0 0-.75.75V22.5h-2.505v-9.312a.75.75 0 0 0-.75-.75H7.562z" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/company/novotrendforex",
    label: "LinkedIn",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-[18px] w-[18px] fill-slate-900"
        viewBox="0 0 511 512"
      >
        <path d="M111.898 160.664H15.5c-8.285 0-15 6.719-15 15V497c0 8.285 6.715 15 15 15h96.398c8.286 0 15-6.715 15-15V175.664c0-8.281-6.714-15-15-15zM96.898 482H30.5V190.664h66.398zM63.703 0C28.852 0 .5 28.352.5 63.195c0 34.852 28.352 63.2 63.203 63.2 34.848 0 63.195-28.352 63.195-63.2C126.898 28.352 98.551 0 63.703 0zm0 96.395c-18.308 0-33.203-14.891-33.203-33.2C30.5 44.891 45.395 30 63.703 30c18.305 0 33.195 14.89 33.195 33.195 0 18.309-14.89 33.2-33.195 33.2zm289.207 62.148c-22.8 0-45.273 5.496-65.398 15.777-.684-7.652-7.11-13.656-14.942-13.656h-96.406c-8.281 0-15 6.719-15 15V497c0 8.285 6.719 15 15 15h96.406c8.285 0 15-6.715 15-15V320.266c0-22.735 18.5-41.23 41.235-41.23 22.734 0 41.226 18.495 41.226 41.23V497c0 8.285 6.719 15 15 15h96.403c8.285 0 15-6.715 15-15V302.066c0-79.14-64.383-143.523-143.524-143.523zM466.434 482h-66.399V320.266c0-39.278-31.953-71.23-71.226-71.23-39.282 0-71.239 31.952-71.239 71.23V482h-66.402V190.664h66.402v11.082c0 5.77 3.309 11.027 8.512 13.524a15.01 15.01 0 0 0 15.875-1.82c20.313-16.294 44.852-24.907 70.953-24.907 62.598 0 113.524 50.926 113.524 113.523z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/novotrendforex",
    label: "Instagram",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-[18px] w-[18px] fill-slate-900"
        viewBox="0 0 24 24"
      >
        <path d="M12 9.3a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Zm0-1.8a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm5.85-.225a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0ZM12 4.8c-2.227 0-2.59.006-3.626.052-.706.034-1.18.128-1.618.299a2.59 2.59 0 0 0-.972.633 2.601 2.601 0 0 0-.634.972c-.17.44-.265.913-.298 1.618C4.805 9.367 4.8 9.714 4.8 12c0 2.227.006 2.59.052 3.626.034.705.128 1.18.298 1.617.153.392.333.674.632.972.303.303.585.484.972.633.445.172.918.267 1.62.3.993.047 1.34.052 3.626.052 2.227 0 2.59-.006 3.626-.052.704-.034 1.178-.128 1.617-.298.39-.152.674-.333.972-.632.304-.303.485-.585.634-.972.171-.444.266-.918.299-1.62.047-.993.052-1.34.052-3.626 0-2.227-.006-2.59-.052-3.626-.034-.704-.128-1.18-.299-1.618a2.619 2.619 0 0 0-.633-.972 2.595 2.595 0 0 0-.972-.634c-.44-.17-.914-.265-1.618-.298-.993-.047-1.34-.052-3.626-.052ZM12 3c2.445 0 2.75.009 3.71.054.958.045 1.61.195 2.185.419A4.388 4.388 0 0 1 19.49 4.51c.457.45.812.994 1.038 1.595.222.573.373 1.227.418 2.185.042.96.054 1.265.054 3.71 0 2.445-.009 2.75-.054 3.71-.045.958-.196 1.61-.419 2.185a4.395 4.395 0 0 1-1.037 1.595 4.44 4.44 0 0 1-1.595 1.038c-.573.222-1.227.373-2.185.418-.96.042-1.265.054-3.71.054-2.445 0-2.75-.009-3.71-.054-.958-.045-1.61-.196-2.185-.419A4.402 4.402 0 0 1 4.51 19.49a4.414 4.414 0 0 1-1.037-1.595c-.224-.573-.374-1.227-.419-2.185C3.012 14.75 3 14.445 3 12c0-2.445.009-2.75.054-3.71s.195-1.61.419-2.185A4.392 4.392 0 0 1 4.51 4.51c.45-.458.994-.812 1.595-1.037.574-.224 1.226-.374 2.185-.419C9.25 3.012 9.555 3 12 3Z" />
      </svg>
    ),
  },
  {
    href: "https://t.me/novotrendofficial",
    label: "Telegram",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={18}
        height={18}
        className="fill-slate-900"
        viewBox="0 0 24 24"
      >
        <path d="M9.04 15.38l-.39 4.06c.56 0 .8-.24 1.08-.52l2.6-2.48 5.38 3.93c.99.55 1.7.26 1.97-.91l3.57-16.73.001-.001c.32-1.5-.54-2.08-1.5-1.72L1.4 9.28c-1.45.56-1.43 1.37-.25 1.73l5.88 1.84 13.66-8.61c.64-.42 1.23-.19.75.23" />
      </svg>
    ),
  },
  {
    href: "https://x.com/NovotrendForex",
    label: "X",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={18}
        height={18}
        className="fill-slate-900"
        viewBox="0 0 24 24"
      >
        <path d="M3 3h4.5l4.2 6.1L17.5 3H21l-7.6 8.7L21 21h-4.5l-4.7-6.8L6.5 21H3l8.2-9.4L3 3z" />
      </svg>
    ),
  },
];

export default function SupportQuery() {
  const { data: categories = [], isLoading: categoriesLoading } = useSupportCategories();
  const createTicket = useCreateTicket();

  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (createTicket.isSuccess && createTicket.data?.status === 200) {
      setCategory("");
      setQuestion("");
      setFile(null);
      setPreview("");
      setFieldErrors({});
      setTimeout(() => createTicket.reset(), 3000);
    }
  }, [createTicket.isSuccess, createTicket.data]);

  const handleFile = (f: File | null) => {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return;
    setFile(f);
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const result = submitTicketSchema.safeParse({ category, question });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        errors[i.path[0] as string] = i.message;
      });
      setFieldErrors(errors);
      return;
    }

    const selectedCat = categories.find((c) => c.s_category === category);
    if (!selectedCat) return;

    createTicket.mutate({
      sup_mst_id: selectedCat.s_mast_id,
      s_question: question,
      s_file_name: file ?? undefined,
    });
  };

  const isSubmitting = createTicket.isPending;
  const isSuccess = createTicket.isSuccess && createTicket.data?.status === 200;
  const isError =
    createTicket.isError || (createTicket.isSuccess && createTicket.data?.status !== 200);
  const successMessage = createTicket.data?.result ?? "";
  const errorMessage = createTicket.isError
    ? "Something went wrong. Please try again."
    : (createTicket.data?.result ?? "");

  return (
    <div className="mx-auto max-w-5xl bg-white p-4 max-lg:max-w-3xl dark:bg-slate-900">
      {/* Header */}
      <div className="px-6 text-left">
        <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
          Need Assistance? {"We've"} Got Your Back
        </h2>
        <p className="mt-4 text-[15px] text-slate-600 dark:text-slate-400">
          Our expert support team is available 24/7 to resolve your issues, answer questions, and
          guide you at every step of your trading journey.
        </p>
      </div>

      <div className="mt-12 grid items-stretch rounded-lg p-2 [box-shadow:0_2px_10px_-3px_rgba(115,120,131,0.6)] lg:grid-cols-5">
        {/* Left: Contact Info */}
        <div className="relative overflow-hidden rounded-lg bg-indigo-800 p-6 max-lg:order-1 max-lg:mt-12 lg:col-span-2">
          <h3 className="text-[24px] font-medium text-white">Contact Information</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-300">
            Have some big idea or brand to develop and need help?
          </p>

          <ul className="relative z-50 mt-16 space-y-8">
            {CONTACT_INFO.map(({ href, label, icon }) => (
              <li key={label} className="flex items-start gap-4 text-slate-200 hover:text-white">
                <span className="mt-0.5 shrink-0">{icon}</span>
                {href ? (
                  <a href={href} className="text-[15px] leading-snug">
                    {label}
                  </a>
                ) : (
                  <span className="text-[15px] leading-snug">{label}</span>
                )}
              </li>
            ))}
          </ul>

          <ul className="relative z-50 mt-16 flex flex-wrap gap-x-5 gap-y-4">
            {SOCIALS.map(({ href, label, icon }) => (
              <li
                key={label}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 hover:bg-white"
              >
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  {icon}
                </a>
              </li>
            ))}
          </ul>

          <div className="absolute -right-24 -bottom-24 h-60 w-60 rounded-full bg-teal-500 opacity-60" />
        </div>

        {/* Right: Form */}
        <div className="px-4 py-6 sm:px-8 lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Success */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  {successMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {isError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Support Type */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-gray-200">
                Select Support Type <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setFieldErrors((p) => ({ ...p, category: "" }));
                }}
                className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-slate-800 dark:text-gray-200 ${fieldErrors.category ? "border-red-400" : "border-slate-300"}`}
              >
                <option value="">{categoriesLoading ? "Loading..." : "Select support type"}</option>
                {categories.map((cat) => (
                  <option key={cat.s_mast_id} value={cat.s_category}>
                    {cat.s_category}
                  </option>
                ))}
              </select>
              {fieldErrors.category && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.category}</p>
              )}
            </div>

            {/* Question */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-gray-200">
                Write Message <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  setFieldErrors((p) => ({ ...p, question: "" }));
                }}
                placeholder="Describe your issue in detail..."
                className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-200 dark:placeholder:text-slate-500 ${fieldErrors.question ? "border-red-400" : "border-slate-300"}`}
              />
              {fieldErrors.question && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.question}</p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-gray-200">
                Attach File{" "}
                <span className="text-xs font-normal text-slate-400 dark:text-slate-500">
                  (Max 5MB)
                </span>
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFile(e.dataTransfer.files[0]);
                }}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-5 text-center transition ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
                    : "border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-gray-700 dark:bg-slate-800 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/40"
                }`}
              >
                <Upload className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">
                    Click to upload
                  </span>{" "}
                  or drag & drop
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  PNG, JPG, PDF up to 5MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
              {file && (
                <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-slate-800">
                  <div className="flex min-w-0 items-center gap-2">
                    <Paperclip className="h-4 w-4 shrink-0 text-indigo-500" />
                    <span className="truncate text-xs text-slate-700 dark:text-gray-200">
                      {file.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreview("");
                    }}
                    className="ml-2 shrink-0 rounded-full p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-3 h-32 w-32 rounded-lg border object-cover dark:border-gray-700"
                />
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end border-t border-slate-100 pt-4 dark:border-slate-700">
              <button
                type="submit"
                disabled={isSubmitting || !category || !question}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 max-lg:w-full max-lg:justify-center"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isSubmitting ? "Submitting..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
