"use client";
import React from "react";

export default function RecentOrders() {
  const tableData = [
    {
      id: 1,
      symbol: "EURUSD",
      type: "Buy",
      openTime: "2025-11-10 14:23",
      closeTime: "2025-11-10 15:40",
      lots: "1.20",
      openPrice: "1.08760",
      closePrice: "1.09040",
      volume: "1500",
      profit: "+$540.00",
      orderId: "ORD784512",
      mt5Id: "MT51247",
      commission: "$-15.00",
      swap: "$2.00",
    },
    {
      id: 2,
      symbol: "XAUUSD",
      type: "Sell",
      openTime: "2025-11-11 10:02",
      closeTime: "2025-11-11 12:15",
      lots: "0.80",
      openPrice: "2390.50",
      closePrice: "2382.70",
      volume: "800",
      profit: "+$624.00",
      orderId: "ORD784515",
      mt5Id: "MT51250",
      commission: "$-12.00",
      swap: "$1.50",
    },
    {
      id: 3,
      symbol: "GBPJPY",
      type: "Buy",
      openTime: "2025-11-09 09:30",
      closeTime: "2025-11-09 14:15",
      lots: "0.50",
      openPrice: "187.20",
      closePrice: "188.40",
      volume: "500",
      profit: "+$600.00",
      orderId: "ORD784518",
      mt5Id: "MT51253",
      commission: "$-10.00",
      swap: "$1.00",
    },
  ];

  return (
    <div className="w-full p-4 sm:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md transition-all">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Trading History
        </h2>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition">
            Filter
          </button>
          <button className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition">
            See all
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="min-w-full text-sm">
          {/* Table Head */}
          <thead className="bg-gray-100 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300">
            <tr>
              {[
                "Symbol",
                "Type",
                "Opening Time",
                "Closing Time",
                "Lots",
                "Open Price",
                "Close Price",
                "Volume",
                "Profit",
                "Order ID",
                "MT5 ID",
                "Commission",
                "Swap Charge",
              ].map((head) => (
                <th
                  key={head}
                  className="px-4 py-3  font-medium whitespace-nowrap hover:bg-gray-50 dark:hover:bg-gray-800 transition divide-x divide-gray-200 dark:divide-gray-700 text-center"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {tableData.map((item) => (
              <tr
                key={item.id}
                className=" divide-x divide-gray-200 dark:divide-gray-700 text-center"
              >
                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                  {item.symbol}
                </td>
                <td
                  className={`px-4 py-3 font-medium ${
                    item.type === "Buy"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {item.type}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {item.openTime}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {item.closeTime}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {item.lots}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {item.openPrice}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {item.closePrice}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {item.volume}
                </td>
                <td
                  className={`px-4 py-3 font-medium ${
                    item.profit.startsWith("+")
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {item.profit}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {item.orderId}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {item.mt5Id}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {item.commission}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {item.swap}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
