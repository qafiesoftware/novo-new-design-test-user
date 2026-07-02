import LandingHero from "@/components/ui/promotion/LandingHero";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Novotrend Test CRM",
  description: "Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function landing() {
  return (
    <div>
      <div className="landing">
        <LandingHero />
      </div>
    </div>
  );
}
