


import ClientHistoryTabs from "@/partner/rebates/ClientHistoryTabs";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Novo-Trade || Partners || Clients",
  description:
    "Partners Clients Page for Novo-Trade CRM Application",
  // other metadata
};

export default function rebates() {
  return (
    <div>
      <ClientHistoryTabs />
    </div>

  );
}


