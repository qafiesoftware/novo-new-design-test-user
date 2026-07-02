"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type PremiumPieChartProps = {
  totalLots?: number;
  activeLevel?: number;
};

export default function PremiumPieChart({ totalLots = 0, activeLevel = 0 }: PremiumPieChartProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const tradingLots = parseFloat(String(totalLots)) || 0;
  const activeClients = parseFloat(String(activeLevel)) || 0;
  const isNoData = tradingLots === 0 && activeClients === 0;
  const series = isNoData ? [1] : [tradingLots, activeClients];

  const labelColor = isDark ? "#e2e8f0" : "#374151";

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "pie",
      toolbar: { show: false },
    },
    labels: isNoData ? ["No Data"] : ["Trading Lots", "Active Client"],
    colors: isNoData ? ["#E5E7EB"] : ["#0088FE", "#00C49F"],
    legend: {
      position: "bottom",
      fontSize: "13px",
      fontWeight: 500,
      height: 50,
      labels: {
        colors: [labelColor, labelColor],
      },
    },
    plotOptions: {
      pie: { expandOnClick: false },
    },
    stroke: {
      width: 0,
      colors: ["#ffffff"],
    },
    dataLabels: {
      enabled: !isNoData,
      formatter: (val: number) => `${val.toFixed(0)}%`,
      style: {
        fontSize: "14px",
        fontWeight: "600",
        colors: ["#fff"],
      },
      dropShadow: { enabled: false },
    },
    tooltip: { enabled: !isNoData },
    states: {
      hover: { filter: { type: "none" } },
    },
  };

  return (
    <div className="h-[340px]">
      <div className="mb-2">
        <h2 className="text-left font-medium text-gray-700 dark:text-white/90">
          Affiliate Progress Status
        </h2>
      </div>

      <div className="relative flex flex-1 items-center justify-center">
        <div className="h-[290px] w-full dark:text-white/90">
          <ReactApexChart
            key={`${tradingLots}-${activeClients}-${isDark}`}
            options={options}
            series={series}
            type="pie"
            width="100%"
            height="100%"
          />
        </div>

        {isNoData && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-gray-500 dark:text-slate-400">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
}