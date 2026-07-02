// "use client";

// import { ApexOptions } from "apexcharts";
// import dynamic from "next/dynamic";
// import { useMemo } from "react";
// import { Loader2 } from "lucide-react";
// import { StatisticsItem } from "@/features/crm/dashboard/types/dashboard.types";
// import { useAffiliateProgress } from "@/features/partner/reports/hooks/reports.hooks";

// const ReactApexChart = dynamic(() => import("react-apexcharts"), {
//   ssr: false,
// });

// type StatisticsChartProps = {
//   selectedSymbol: string;
// };

// export default function StatisticsChart({ selectedSymbol }: StatisticsChartProps) {
//   const { data, isLoading } = useAffiliateProgress({
//     symbol: selectedSymbol,
//   });

//   const statistics = useMemo<StatisticsItem[]>(() => {
//     return data?.statistics ?? [];
//   }, [data?.statistics]);

//   const categories = useMemo(() => {
//     return statistics.map((item) => {
//       const [month, year] = item.month.split("-");
//       return `${month} ${year.slice(-2)}`;
//     });
//   }, [statistics]);

//   const revenueSeries = useMemo(() => {
//     return statistics.map((item) => Math.abs(Number(item.profit || 0)));
//   }, [statistics]);

//   const options: ApexOptions = {
//     legend: {
//       show: false,
//     },
//     colors: ["#465FFF"],

//     chart: {
//       fontFamily: "Outfit, sans-serif",
//       height: 310,
//       type: "area",
//       toolbar: {
//         show: false,
//       },
//       zoom: {
//         enabled: false,
//       },
//     },

//     stroke: {
//       curve: "smooth",
//       width: 3,
//     },

//     fill: {
//       type: "gradient",
//       gradient: {
//         shadeIntensity: 1,
//         opacityFrom: 0.45,
//         opacityTo: 0.05,
//         stops: [0, 90, 100],
//       },
//     },

//     markers: {
//       size: 4,
//       strokeColors: "#fff",
//       strokeWidth: 2,
//       hover: {
//         size: 6,
//       },
//     },

//     grid: {
//       xaxis: {
//         lines: {
//           show: false,
//         },
//       },
//       yaxis: {
//         lines: {
//           show: true,
//         },
//       },
//     },

//     dataLabels: {
//       enabled: false,
//     },

//     tooltip: {
//       y: {
//         formatter: (val: number) => `Revenue: $${val.toFixed(2)}`,
//       },
//     },

//     xaxis: {
//       categories,
//       axisBorder: {
//         show: false,
//       },
//       axisTicks: {
//         show: false,
//       },
//     },

//     yaxis: {
//       min: 0,
//       max: 1000,
//       tickAmount: 5,
//       labels: {
//         formatter: (val) => `$${Math.round(val)}`,
//       },
//     },

//     // responsive breakpoints
//     responsive: [
//       {
//         breakpoint: 640,
//         options: {
//           chart: { height: 220 },
//           xaxis: {
//             labels: {
//               rotate: -45,
//               style: { fontSize: "10px" },
//             },
//           },
//           yaxis: {
//             labels: {
//               formatter: (v: number) => `$${Math.round(v)}`,
//             },
//           },
//           markers: { size: 3 },
//         },
//       },
//     ],

//     noData: {
//       text: "No revenue data available",
//       align: "center",
//       verticalAlign: "middle",
//       style: {
//         color: "#6B7280",
//         fontSize: "14px",
//       },
//     },
//   };

//   const series = [
//     {
//       name: "Revenue",
//       data: revenueSeries,
//     },
//   ];

//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-9 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]">
//       <div className="mb-6">
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
//           Monthly Revenue Trend
//         </h3>
//         <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//           Revenue performance over the last 12 months
//         </p>
//       </div>

//       {/* overflow-hidden, min-width hataya */}
//       <div className="w-full overflow-hidden">
//         <div className="w-full">
//           {isLoading ? (
//             <div className="flex h-[310px] items-center justify-center">
//               <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
//             </div>
//           ) : (
//             <ReactApexChart options={options} series={series} type="area" height={310} width="100%" />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useMemo, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { StatisticsItem } from "@/features/crm/dashboard/types/dashboard.types";
import { useAffiliateProgress } from "@/features/partner/reports/hooks/reports.hooks";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type StatisticsChartProps = {
  selectedSymbol: string;
};

export default function StatisticsChart({ selectedSymbol }: StatisticsChartProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const { data, isLoading } = useAffiliateProgress({ symbol: selectedSymbol });

  const statistics = useMemo<StatisticsItem[]>(() => data?.statistics ?? [], [data?.statistics]);

  const categories = useMemo(() => {
    return statistics.map((item) => {
      const [month, year] = item.month.split("-");
      return `${month} ${year.slice(-2)}`;
    });
  }, [statistics]);

  const revenueSeries = useMemo(() => {
    return statistics.map((item) => Math.abs(Number(item.profit || 0)));
  }, [statistics]);

  const axisLabelColor = isDark ? "#9CA3AF" : "#6B7280";
  const gridColor = isDark ? "#374151" : "#E5E7EB";

  const options: ApexOptions = {
    legend: { show: false },
    colors: ["#465FFF"],

    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
    },

    stroke: { curve: "smooth", width: 3 },

    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },

    markers: {
      size: 4,
      strokeColors: isDark ? "#1f2937" : "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },

    grid: {
      borderColor: gridColor,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },

    dataLabels: { enabled: false },

    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val: number) => `Revenue: $${val.toFixed(2)}`,
      },
    },

    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: axisLabelColor,
          fontSize: "12px",
        },
      },
    },

    yaxis: {
      min: 0,
      max: 1000,
      tickAmount: 5,
      labels: {
        formatter: (val) => `$${Math.round(val)}`,
        style: {
          colors: axisLabelColor,
          fontSize: "12px",
        },
      },
    },

    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: { height: 220 },
          xaxis: {
            labels: {
              rotate: -45,
              style: { fontSize: "10px", colors: axisLabelColor },
            },
          },
          yaxis: {
            labels: {
              formatter: (v: number) => `$${Math.round(v)}`,
              style: { colors: axisLabelColor },
            },
          },
          markers: { size: 3 },
        },
      },
    ],

    noData: {
      text: "No revenue data available",
      align: "center",
      verticalAlign: "middle",
      style: {
        color: axisLabelColor,
        fontSize: "14px",
      },
    },
  };

  const series = [{ name: "Revenue", data: revenueSeries }];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-9 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Revenue Trend
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Revenue performance over the last 12 months
        </p>
      </div>

      <div className="w-full overflow-hidden">
        <div className="w-full">
          {isLoading ? (
            <div className="flex h-[310px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : (
            <ReactApexChart
              key={`${selectedSymbol}-${isDark}`}
              options={options}
              series={series}
              type="area"
              height={310}
              width="100%"
            />
          )}
        </div>
      </div>
    </div>
  );
}