import { Metadata } from "next";
import React from "react";
import AccountMain from "../../../../components/accountcards/AccountMain";

export const metadata: Metadata = {
  title: "NovoTrade || Account",
  description: "This is Novo-Trade",
  // other metadata
};

export default function Alerts() {
  return (
    <div>
      <div>
        <AccountMain />
      </div>
    </div>
  );
}
