

import ClientAccounts from "@/partner/reports/ClientAccounts";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Novo-Trade || Partners || Clients",
  description:
    "Partners Clients Page for Novo-Trade CRM Application",
  // other metadata
};

export default function Account() {
  return (
    <div>
      <ClientAccounts />
    </div>

  );
}


