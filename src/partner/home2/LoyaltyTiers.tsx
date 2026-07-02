"use client";

import React, { useRef, useEffect, useState } from "react";
import { CheckCircle2, Lock, Loader2 } from "lucide-react";
import {
  PartnerDashboardResponse,
  RewardLevel,
} from "@/features/partner/dashboard/types/dashboard.types";

type LoyaltyTiersProps = {
  data?: PartnerDashboardResponse;
  isLoading: boolean;
};

export default function LoyaltyTiers({ data, isLoading }: LoyaltyTiersProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mounted, setMounted] = useState(false);
  const [lineStyle, setLineStyle] = useState({ left: 0, totalWidth: 0, activeWidth: 0 });

  const rewardlist = data?.rewardlist ?? [];
  const currentLevel = data?.running_level ?? 1;

  const levels = rewardlist.map((r: RewardLevel) => ({
    id: Number(r.level),
    title: `${r.name} - Level ${r.level}`,
    accounts: `${r.tot_account} Accounts`,
    lots: `${r.lotsize} Lots`,
    validity: r.time,
    reward: r.reward,
  }));

  // Measure actual circle positions to draw line perfectly
  useEffect(() => {
    if (!mounted || levels.length < 2) return;

    const measure = () => {
      const container = scrollRef.current;
      const firstCircle = circleRefs.current[0];
      const lastCircle = circleRefs.current[levels.length - 1];
      const activeCircle = circleRefs.current[currentLevel - 1];

      if (!container || !firstCircle || !lastCircle) return;

      const containerRect = container.getBoundingClientRect();
      const firstRect = firstCircle.getBoundingClientRect();
      const lastRect = lastCircle.getBoundingClientRect();

      const firstCenter =
        firstRect.left - containerRect.left + container.scrollLeft + firstRect.width / 2;
      const lastCenter =
        lastRect.left - containerRect.left + container.scrollLeft + lastRect.width / 2;

      let activeCenter = firstCenter;
      if (activeCircle) {
        const activeRect = activeCircle.getBoundingClientRect();
        activeCenter =
          activeRect.left - containerRect.left + container.scrollLeft + activeRect.width / 2;
      }

      setLineStyle({
        left: firstCenter,
        totalWidth: lastCenter - firstCenter,
        activeWidth: activeCenter - firstCenter,
      });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [mounted, levels.length, currentLevel]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-white px-3 py-6 md:px-6 md:py-8 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Heading */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-xl font-extrabold text-indigo-600 md:text-3xl dark:text-white/90">
          Qualification Levels
        </h1>
        <p className="text-sm text-gray-600 md:text-base dark:text-white/90">
          You are currently in{" "}
          <span className="font-bold text-indigo-600">
            {data?.royaltyinfo?.royaltyname ?? ""} — Level {currentLevel}
          </span>
        </p>
      </div>

      {/* SCROLL AREA */}
      <div ref={scrollRef} className="no-scrollbar overflow-x-auto scroll-smooth">
        <div className="relative flex items-start gap-4 px-4 pt-12 pb-8 md:gap-6 md:px-6">
          {/* BACKGROUND LINE — first circle center to last circle center */}
          {mounted && lineStyle.totalWidth > 0 && (
            <div
              className="absolute z-0 h-[3px] rounded-full bg-indigo-100"
              style={{
                top: "78px",
                left: lineStyle.left,
                width: lineStyle.totalWidth,
              }}
            />
          )}

          {/* ACTIVE LINE */}
          {mounted && lineStyle.totalWidth > 0 && (
            <div
              className="absolute z-10 h-[3px] rounded-full bg-indigo-500"
              style={{
                top: "46px",
                left: lineStyle.left,
                width: lineStyle.activeWidth,
                transition: "width 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          )}

          {levels.map((level, index) => {
            const isCurrent = level.id === currentLevel;
            const isCompleted = level.id < currentLevel;

            return (
              <div
                key={level.id}
                className="relative z-20 flex flex-col items-center"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`,
                }}
              >
                {/* YOU ARE HERE */}
                {isCurrent && (
                  <div className="absolute -top-7 animate-bounce rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-semibold whitespace-nowrap text-white shadow-lg md:-top-8 md:text-xs">
                    YOU ARE HERE
                  </div>
                )}

                {/* TOP CIRCLE — ref attached here */}
                <div
                  className="relative mb-4"
                  ref={(el) => {
                    circleRefs.current[index] = el;
                  }}
                >
                  {isCurrent && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-indigo-400 opacity-25" />
                  )}
                  <div
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full border-4 text-base font-bold shadow-md transition-transform duration-300 md:h-14 md:w-14 md:text-xl ${
                      isCurrent
                        ? "scale-110 border-indigo-300 bg-indigo-600 text-white"
                        : isCompleted
                          ? "border-indigo-200 bg-indigo-400 text-white"
                          : "border-indigo-100 bg-white text-indigo-300"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="h-5 w-5 md:h-7 md:w-7" /> : level.id}
                  </div>
                </div>

                {/* CARD */}
                <div
                  className={`w-[210px] rounded-2xl border bg-white p-4 transition-all duration-300 hover:-translate-y-1 md:w-[250px] md:p-5 dark:border-gray-800 dark:bg-white/[0.03] ${
                    isCurrent
                      ? "border-indigo-400 shadow-xl shadow-indigo-100"
                      : isCompleted
                        ? "border-indigo-200 shadow-md"
                        : "border-gray-100 shadow-sm"
                  }`}
                >
                  <h2 className="mb-4 text-center text-sm leading-snug font-bold text-indigo-600 md:text-base dark:text-white/90">
                    {level.title}
                  </h2>

                  <div className="space-y-2.5">
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2.5 dark:border-gray-800 dark:bg-white/[0.03]">
                      <p className="mb-1 text-[11px] text-gray-500 dark:text-white/90 dark:text-white/90">Active Accounts Required</p>
                      <h3 className="text-sm font-bold text-indigo-900 md:text-base dark:text-white/90">
                        {level.accounts}
                      </h3>
                    </div>
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2.5 dark:border-gray-800 dark:bg-white/[0.03] ">
                      <p className="mb-1 text-[11px] text-gray-500 dark:text-white/90">Trade Lot Size Required</p>
                      <h3 className="text-sm font-bold text-indigo-900 md:text-base dark:text-white/90">
                        {level.lots}
                      </h3>
                    </div>
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2.5 dark:border-gray-800 dark:bg-white/[0.03]">
                      <p className="mb-1 text-[11px] text-gray-500 dark:text-white/90">Time Validity</p>
                      <h3 className="text-sm font-bold text-indigo-900 md:text-base dark:text-white/90">
                        {level.validity}
                      </h3>
                    </div>
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2.5 dark:border-gray-800 dark:bg-white/[0.03]">
                      <p className="mb-1 text-[11px] text-gray-500 dark:text-white/90">Reward</p>
                      <h3 className="text-sm font-bold text-indigo-900 md:text-base dark:text-white/90">
                        ${level.reward.toLocaleString()}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4">
                    {isCurrent ? (
                      <div className="relative overflow-hidden rounded-xl bg-indigo-600 py-2 text-center text-sm font-bold text-white shadow-md ring-2 ring-indigo-300 ring-offset-1 md:py-2.5 md:text-base">
                        <span className="relative z-10">Current Level</span>
                        <span className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_ease_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      </div>
                    ) : isCompleted ? (
                      <div className="flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-100 py-2 text-sm font-semibold text-indigo-700 md:py-2.5 md:text-base">
                        <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                        Completed
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 rounded-xl bg-gray-100 py-2 text-sm font-medium text-gray-400 md:py-2.5 md:text-base">
                        <Lock className="h-4 w-4" />
                        Locked
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          60%,
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  );
}
