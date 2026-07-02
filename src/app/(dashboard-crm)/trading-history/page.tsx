
import TradingHistory from "@/components/TradingHistory/TradingHistory";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Trading History",
  description:
    "This is Trading History page",
  // other metadata
};

export default function Alerts() {
  return (
    <div>
      <div>
        <TradingHistory />
      </div>
    </div>
  );
}
