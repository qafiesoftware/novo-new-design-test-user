


import SupportPartner from "@/partner/support/PartnerContact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Novo-Trade || Partners || Clients",
  description:
    "Partners Clients Page for Novo-Trade CRM Application",
  // other metadata
};

export default function support() {
  return (
    <div>
        <SupportPartner />
    </div>

  )
}