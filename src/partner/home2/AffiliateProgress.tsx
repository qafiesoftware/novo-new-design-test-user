"use client";

import { useState } from "react";
import { PartnerDashboardResponse } from "@/features/partner/dashboard/types/dashboard.types";
import { motion } from "framer-motion";
import { FiLink, FiClock } from "react-icons/fi";
import { PiCopyBold, PiShareNetworkBold, PiCodeBlockBold } from "react-icons/pi";

// Props Types
interface AffiliateProgressProps {
  progress: number;
  referrals: number;
  clicks: number;
  rate: number;
  inviteLink: string;
  secondaryProgress?: number;
  data: PartnerDashboardResponse;
}

// Component
export default function AffiliateProgress({ progress, inviteLink, data }: AffiliateProgressProps) {
  // First progress (Trading Lots)

  const achieved = parseFloat(String(data?.royaltyinfo?.lotachieve)) || 0;
  const required = parseFloat(String(data?.royaltyinfo?.lotrequired)) || 1;
  const progressPercent = Math.min((achieved / required) * 100, 100);

  // Second progress (Active Clients)
  const secondaryAchieved = parseFloat(String(data?.royaltyinfo?.levelachieve_client)) || 0;
  const secondaryRequired = parseFloat(String(data?.royaltyinfo?.levelrequired_client)) || 1;
  const secondaryPercent = Math.min((secondaryAchieved / secondaryRequired) * 100, 100);

  // Partner Code
  const partnerLinkCode = data?.user_code || "";

  // Toggle State
  const [partnerView, setPartnerView] = useState<"link" | "code">("link");

  // Toast State
  const [toastMessage, setToastMessage] = useState("");

  // Current Display Value
  const currentValue =
    partnerView === "link" ? `${inviteLink}/${partnerLinkCode}` : partnerLinkCode;

  // Copy Function
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentValue);

      setToastMessage(
        `${partnerView === "link" ? "Partner Link" : "Partner Code"} copied successfully`
      );

      setTimeout(() => {
        setToastMessage("");
      }, 2500);
    } catch (error) {
      console.error(error);

      setToastMessage("Failed to copy");

      setTimeout(() => {
        setToastMessage("");
      }, 2500);
    }
  };

  // Share Function
  const handleShare = async () => {
    const shareValue = `${inviteLink}/${partnerLinkCode}`;

    try {
      // Native Share
      if (navigator.share) {
        await navigator.share({
          title: "Partner Referral",
          text:
            partnerView === "link"
              ? "Join using my partner link"
              : `Use my partner code: ${partnerLinkCode}`,
          url: shareValue,
        });

        return;
      }

      // Fallback Copy
      await navigator.clipboard.writeText(shareValue);

      setToastMessage("Link copied for sharing");

      setTimeout(() => {
        setToastMessage("");
      }, 2500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="w-full space-y-6 rounded-2xl border bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Title */}
        <div className="flex justify-between">
          <p className="font-medium text-gray-700 dark:text-white/90">
            Loyalty Qualification Progress
          </p>

          <p className="inline-flex items-center gap-1 rounded-xl bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 shadow">
            <FiClock className="mr-1" />
            {data?.remaining_days} days left
          </p>
        </div>

        <p className="-mt-3 text-sm text-gray-500 dark:text-white/90">
          {100 - progress} more referrals to unlock your next bonus!
        </p>

        {/* Circles Section */}
        <div className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:justify-around">
          {/* Progress 1 */}
          <div className="relative flex h-44 w-44 flex-col items-center justify-center">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 36 36">
              {/* Background Circle */}
              <path
                d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="4"
              />

              {/* Progress Circle */}
              {progressPercent > 0 && (
                <motion.path
                  d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="100"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{
                    strokeDashoffset: 100 - progressPercent,
                  }}
                  transition={{ duration: 1 }}
                />
              )}
            </svg>

            {/* Center Content */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center dark:text-white/90">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white/90">
                {data?.royaltyinfo?.lotachieve || 0}
              </p>

              <span className="text-sm text-gray-500 dark:text-white/90">
                of {data?.royaltyinfo?.lotrequired || 0}
              </span>
            </div>
          </div>

          <p className="mt-4 text-center font-medium text-gray-600 dark:text-white/90">
            Trading Lots
          </p>

          {/* Progress 2 */}
          <div className="relative flex h-44 w-44 flex-col items-center justify-center">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 36 36">
              {/* Background Circle */}
              <path
                d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="4"
              />

              {/* Progress Circle */}
              {secondaryPercent > 0 && (
                <motion.path
                  d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="100"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{
                    strokeDashoffset: 100 - secondaryPercent,
                  }}
                  transition={{ duration: 1 }}
                />
              )}
            </svg>

            {/* Center Content */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center dark:text-white/90">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white/90">
                {data?.royaltyinfo?.levelachieve_client ?? "-"}
              </p>

              <span className="text-sm text-gray-500 dark:text-white/90">
                of {data?.royaltyinfo?.levelrequired_client ?? "-"}
              </span>
            </div>
          </div>

          <p className="mt-4 text-center font-medium text-gray-600 dark:text-white/90">
            Active Clients
          </p>
        </div>

        {/* Invite Link / Code Section */}
        <div className="w-full overflow-hidden rounded-xl border bg-gray-50 p-2 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex w-full items-center gap-2 overflow-hidden dark:text-white/90">
            {/* Partner Link Toggle */}
            <button
              onClick={() => setPartnerView("link")}
              className={`group relative rounded-lg p-1 transition ${
                partnerView === "link"
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <FiLink className="text-xl" />

              <span className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition group-hover:opacity-100 dark:text-white/90">
                Partner Link
              </span>
            </button>

            {/* Partner Code Toggle */}
            <button
              onClick={() => setPartnerView("code")}
              className={`group relative shrink-0 rounded-lg p-1 transition ${
                partnerView === "code"
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <PiCodeBlockBold className="text-xl" />

              <span className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition group-hover:opacity-100">
                Partner Code
              </span>
            </button>

            {/* Input */}
            <input
              readOnly
              value={currentValue}
              className="min-w-0 flex-1 overflow-hidden bg-transparent text-sm text-ellipsis whitespace-nowrap text-gray-600 outline-none dark:text-white/90"
            />

            {/* Copy Button */}
            <div className="group relative">
              <button
                onClick={handleCopy}
                className="rounded-xl py-2 text-xl text-indigo-600 transition hover:scale-105"
              >
                <PiCopyBold />
              </button>

              <span className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition group-hover:opacity-100">
                Copy
              </span>
            </div>

            {/* Share Button */}
            <div className="group relative">
              <button
                onClick={handleShare}
                className="rounded-xl py-2 text-xl text-indigo-600 transition hover:scale-105"
              >
                <PiShareNetworkBold />
              </button>

              <span className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition group-hover:opacity-100">
                Share
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed right-5 bottom-5 z-50">
          <div className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
            {toastMessage}
          </div>
        </div>
      )}
    </>
  );
}
