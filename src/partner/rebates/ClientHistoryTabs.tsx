"use client";
import { useState } from "react";
import ClientTable from "./ClientTable";
import HistoryTable from "./HistoryTable";

export default function ClientHistoryTabs() {
  const [activeTab, setActiveTab] = useState<"client" | "history">("client");

  return (
    <div className="w-full space-y-6">
      {/* Title */}
      {/* <div className="py-6">
        <h1 className="text-2xl font-semibold dark:text-white">Rebates History</h1>
        <p className="text-sm text-gray-500">The report is updated once in 2 hours...</p>
      </div> */}
      {/* Tabs */}
      <div className="flex gap-6 border-b">
        {["client", "history"].map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab as "client" | "history")}
            className={`pb-3 text-sm font-semibold transition ${
              activeTab === tab
                ? "border-b-2 border-[#465FFF] text-[#465FFF]"
                : "text-gray-500 hover:text-[#465FFF]"
            }`}
          >
            {tab === "client" ? "Client" : "History"}
          </button>
        ))}
      </div>
      {/* Dynamic Table */}
      {activeTab === "client" ? <ClientTable /> : <HistoryTable />}
    </div>
  );
}
