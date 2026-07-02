"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { DurationType } from "@/features/crm/dashboard/types/dashboard.types";
import { useAffiliateProgress } from "@/features/partner/reports/hooks/reports.hooks";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LEVEL_COLORS = [
  "#465FFF",
  "#00C49F",
  "#F59E0B",
  "#b47474",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
];

export default function AffiliateProgress() {
  const [duration] = useState<DurationType>("monthly");
  const { data, isLoading } = useAffiliateProgress({ duration });

  const progressNew = data?.affiliate_progress_new?.data ?? [];
  const totalCommSum = parseFloat(String(data?.affiliate_progress_new?.total_comm_sum ?? "0"));

  // Series — percentage of each level from total_comm_sum
  const series = progressNew.map((p) =>
    totalCommSum > 0
      ? parseFloat(((parseFloat(String(p.user_comm)) / totalCommSum) * 100).toFixed(2))
      : 0
  );

  const labels = progressNew.map((p) => `Level ${p.level}`);
  const colors = progressNew.map((_, i) => LEVEL_COLORS[i % LEVEL_COLORS.length]);

  const options: ApexOptions = {
    chart: {
      type: "pie",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    labels,
    colors,
    stroke: { width: 0 },
    legend: {
      show: false, // show data
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
      style: {
        fontSize: "13px",
        fontWeight: "600",
        colors: ["#fff"],
      },
      dropShadow: { enabled: false },
    },
    tooltip: {
      enabled: true,
      y: {
        title: {
          formatter: () => "",
        },
        formatter: (_val, { seriesIndex }) => {
          const item = progressNew[seriesIndex];
          return `Level ${item?.level} — Commission: $${item?.user_comm}`;
        },
      },
    },
    responsive: [
      { breakpoint: 1024, options: { chart: { height: 320 } } },
      { breakpoint: 640, options: { chart: { height: 280 } } },
    ],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="shadow-default rounded-2xl bg-white px-5 pt-5 pb-8 sm:px-6 sm:pt-6 dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Affiliate Progress Status
            </h3>
            <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
              How Close Are You to Your Monthly Goals?
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-6">
          {isLoading ? (
            <div className="flex h-[316px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : series.length === 0 ? (
            <div className="flex h-[316px] items-center justify-center text-sm text-gray-400">
              No data available
            </div>
          ) : (
            <>
              <div className="mx-auto max-w-[420px] sm:max-w-[460px]">
                <ReactApexChart options={options} series={series} type="pie" height={255} />
              </div>

              {/* Custom legend — level wise commission */}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {/* {progressNew.map((p, i) => (
                
                  <div
                    key={p.level}
                    className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: LEVEL_COLORS[i % LEVEL_COLORS.length] }}
                    />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      Level {p.level}
                    </span>
                    <span className="text-xs font-semibold text-gray-800 dark:text-white">
                      ${p.user_comm}
                    </span>
                  </div>
                ))} */}

                {/* Total */}
                <div className="flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 dark:border-indigo-800 dark:bg-indigo-900/20">
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-300">
                    Total Commission:
                  </span>
                  <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-200">
                    ${totalCommSum.toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
