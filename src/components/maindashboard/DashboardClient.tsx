"use client";

import { useState } from "react";

import { EcommerceMetrics } from "@/components/maindashboard/EcommerceMetrics";
import MonthlyTarget from "@/components/maindashboard/MonthlyTarget";
import MonthlySalesChart from "@/components/maindashboard/MonthlySalesChart";
import StatisticsChart from "@/components/maindashboard/StatisticsChart";
import MyAccount from "@/components/accountcards/MyAccount";

export default function DashboardClient() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      {/* Revenue Chart */}
      <div className="col-span-12 xl:col-span-5">
        <StatisticsChart selectedSymbol={selectedSymbol} />
      </div>

      {/* Trading Volume Chart */}
      <div className="col-span-12 xl:col-span-7">
        <MonthlySalesChart selectedSymbol={selectedSymbol} onSymbolChange={setSelectedSymbol} />
      </div>

      <div className="col-span-12 xl:col-span-12">
        <MyAccount />
      </div>
    </div>
  );
}
