import SupportQueryDetails from "@/components/support/SupportQueryDetails";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Novotrend Test CRM",
  description: "Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function Query() {
  return (
    <div>
      <SupportQueryDetails />
    </div>
  );
}
