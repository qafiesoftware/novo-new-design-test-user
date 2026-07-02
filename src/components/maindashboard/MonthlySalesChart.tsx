// "use client";

// import { ApexOptions } from "apexcharts";
// import dynamic from "next/dynamic";
// import { useMemo, useState } from "react";
// import { Loader2 } from "lucide-react";

// import { MoreDotIcon } from "@/icons";
// import { Dropdown } from "../ui/dropdown/Dropdown";
// import { DropdownItem } from "../ui/dropdown/DropdownItem";

// import { MonthlySalesItem } from "@/features/crm/dashboard/types/dashboard.types";
// import { useAffiliateProgress } from "@/features/partner/reports/hooks/reports.hooks";

// const ReactApexChart = dynamic(() => import("react-apexcharts"), {
//   ssr: false,
// });

// type MonthlySalesChartProps = {
//   selectedSymbol: string;
//   onSymbolChange: (symbol: string) => void;
// };

// export default function MonthlySalesChart({
//   selectedSymbol,
//   onSymbolChange,
// }: MonthlySalesChartProps) {
//   const [isOpen, setIsOpen] = useState(false);

//   const { data, isLoading } = useAffiliateProgress({
//     symbol: selectedSymbol,
//   });

//   const monthlySales = useMemo<MonthlySalesItem[]>(() => {
//     return data?.monthly_sales?.records ?? [];
//   }, [data?.monthly_sales?.records]);

//   const symbols = useMemo(() => {
//     return data?.monthly_sales?.symbols ?? [];
//   }, [data?.monthly_sales?.symbols]);

//   // X Axis Months
//   const categories = useMemo(() => {
//     return monthlySales?.map((item) => {
//       const [month, year] = item.month.split("-");
//       return `${month} ${year.slice(-2)}`;
//     });
//   }, [monthlySales]);

//   // Lotsize Data
//   const seriesData = useMemo(() => {
//     return monthlySales?.map((item) => Math.abs(Number(item.lotsize || 0)));
//   }, [monthlySales]);

//   const dynamicColumnWidth =
//     categories.length <= 2
//       ? "18%"
//       : categories.length <= 4
//         ? "25%"
//         : categories.length <= 6
//           ? "32%"
//           : categories.length <= 10
//             ? "38%"
//             : "45%";

//   const options: ApexOptions = {
//     colors: ["#465FFF"],

//     chart: {
//       fontFamily: "Outfit, sans-serif",
//       type: "bar",
//       height: 360,

//       toolbar: {
//         show: false,
//       },
//     },

//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: dynamicColumnWidth,
//         borderRadius: 5,
//         borderRadiusApplication: "end",
//       },
//     },

//     dataLabels: {
//       enabled: false,
//     },

//     stroke: {
//       show: true,
//       width: 4,
//       colors: ["transparent"],
//     },

//     xaxis: {
//       categories,
//       axisBorder: {
//         show: false,
//       },

//       axisTicks: {
//         show: false,
//       },

//       labels: {
//         rotate: -45,
//         trim: true,

//         style: {
//           fontSize: "11px",
//         },
//       },
//     },

//     legend: {
//       show: true,
//       position: "top",
//       horizontalAlign: "left",
//       fontFamily: "Outfit",
//     },

//     yaxis: {
//       min: 0,
//       max: 500,
//       tickAmount: 5,
//       labels: {
//         formatter: (val) => `${Math.round(val)}`,
//       },
//     },

//     grid: {
//       yaxis: {
//         lines: {
//           show: true,
//         },
//       },
//     },

//     fill: {
//       opacity: 1,
//     },

//     tooltip: {
//       y: {
//         formatter: (val: number) => `Lots: ${val.toFixed(2)}`,
//       },
//     },

//     noData: {
//       text: "No trading volume available",
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
//       name: "Trading Volume",
//       data: seriesData,
//     },
//   ];

//   return (
//     <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]">
//       <div className="mb-4 flex items-center justify-between">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
//             Monthly Trading Volume
//           </h3>

//           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//             Lot size traded across the last 12 months
//           </p>
//         </div>

//         {/* Symbol Filter */}
//         <div className="relative inline-block">
//           <button onClick={() => setIsOpen(!isOpen)} className="dropdown-toggle">
//             <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
//           </button>

//           <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-44 p-2">
//             {symbols.length > 0 && (
//               <>
//                 <p className="mt-2 px-2 py-1 text-xs font-semibold text-gray-400 uppercase">
//                   Symbol
//                 </p>

//                 {symbols.map((symbol) => (
//                   <DropdownItem
//                     key={symbol}
//                     onItemClick={() => {
//                       onSymbolChange(symbol);
//                       setIsOpen(false);
//                     }}
//                     className={`flex w-full rounded-lg text-left font-normal hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/5 dark:hover:text-gray-300 ${
//                       selectedSymbol === symbol
//                         ? "font-medium text-[#465FFF]"
//                         : "text-gray-500 dark:text-gray-400"
//                     }`}
//                   >
//                     {symbol}
//                   </DropdownItem>
//                 ))}
//               </>
//             )}
//           </Dropdown>
//         </div>
//       </div>

//       <div className="custom-scrollbar max-w-full overflow-x-auto">
//         <div className="-ml-5 min-w-[650px] pl-2 xl:min-w-full">
//           {isLoading ? (
//             <div className="flex h-[360px] items-center justify-center">
//               <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
//             </div>
//           ) : (
//             <ReactApexChart options={options} series={series} type="bar" height={354} />
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

import { MoreDotIcon } from "@/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

import { MonthlySalesItem } from "@/features/crm/dashboard/types/dashboard.types";
import { useAffiliateProgress } from "@/features/partner/reports/hooks/reports.hooks";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type MonthlySalesChartProps = {
  selectedSymbol: string;
  onSymbolChange: (symbol: string) => void;
};

export default function MonthlySalesChart({
  selectedSymbol,
  onSymbolChange,
}: MonthlySalesChartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const { data, isLoading } = useAffiliateProgress({ symbol: selectedSymbol });

  const monthlySales = useMemo<MonthlySalesItem[]>(
    () => data?.monthly_sales?.records ?? [],
    [data?.monthly_sales?.records]
  );

  const symbols = useMemo(() => data?.monthly_sales?.symbols ?? [], [data?.monthly_sales?.symbols]);

  const categories = useMemo(() => {
    return monthlySales?.map((item) => {
      const [month, year] = item.month.split("-");
      return `${month} ${year.slice(-2)}`;
    });
  }, [monthlySales]);

  const seriesData = useMemo(() => {
    return monthlySales?.map((item) => Math.abs(Number(item.lotsize || 0)));
  }, [monthlySales]);

  const dynamicColumnWidth =
    categories.length <= 2
      ? "18%"
      : categories.length <= 4
        ? "25%"
        : categories.length <= 6
          ? "32%"
          : categories.length <= 10
            ? "38%"
            : "45%";

  const axisLabelColor = isDark ? "#9CA3AF" : "#6B7280";
  const gridColor = isDark ? "#374151" : "#E5E7EB";

  const options: ApexOptions = {
    colors: ["#465FFF"],

    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 360,
      toolbar: { show: false },
    },

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: dynamicColumnWidth,
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },

    dataLabels: { enabled: false },

    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },

    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        rotate: -45,
        trim: true,
        style: {
          fontSize: "11px",
          colors: axisLabelColor,
        },
      },
    },

    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
      labels: {
        colors: axisLabelColor,
      },
    },

    yaxis: {
      min: 0,
      max: 500,
      tickAmount: 5,
      labels: {
        formatter: (val) => `${Math.round(val)}`,
        style: {
          colors: axisLabelColor,
        },
      },
    },

    grid: {
      borderColor: gridColor,
      yaxis: { lines: { show: true } },
    },

    fill: { opacity: 1 },

    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val: number) => `Lots: ${val.toFixed(2)}`,
      },
    },

    noData: {
      text: "No trading volume available",
      align: "center",
      verticalAlign: "middle",
      style: {
        color: axisLabelColor,
        fontSize: "14px",
      },
    },
  };

  const series = [{ name: "Trading Volume", data: seriesData }];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Monthly Trading Volume
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Lot size traded across the last 12 months
          </p>
        </div>

        {/* Symbol Filter */}
        <div className="relative inline-block">
          <button onClick={() => setIsOpen(!isOpen)} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>

          <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-44 p-2">
            {symbols.length > 0 && (
              <>
                <p className="mt-2 px-2 py-1 text-xs font-semibold text-gray-400 uppercase">
                  Symbol
                </p>
                {symbols.map((symbol) => (
                  <DropdownItem
                    key={symbol}
                    onItemClick={() => {
                      onSymbolChange(symbol);
                      setIsOpen(false);
                    }}
                    className={`flex w-full rounded-lg text-left font-normal hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/5 dark:hover:text-gray-300 ${
                      selectedSymbol === symbol
                        ? "font-medium text-[#465FFF]"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {symbol}
                  </DropdownItem>
                ))}
              </>
            )}
          </Dropdown>
        </div>
      </div>

      <div className="custom-scrollbar max-w-full overflow-x-auto">
        <div className="-ml-5 min-w-[650px] pl-2 xl:min-w-full">
          {isLoading ? (
            <div className="flex h-[360px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : (
            <ReactApexChart
              key={`${selectedSymbol}-${isDark}`}
              options={options}
              series={series}
              type="bar"
              height={354}
            />
          )}
        </div>
      </div>
    </div>
  );
}