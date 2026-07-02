
import { Metadata } from "next";
import React from "react";
import AccountTypes from "../../../../components/accountypes/AccountTypes"

export const metadata: Metadata = {
  title: "Account-Types",
  description:
    "Select the Trading account types according to your requirement",
  // other metadata
};

export default function Alerts() {
  return (
    <div>
      <div>
        <AccountTypes />
      </div>
    </div>
  );
}
