import React from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/maindashboard/DashboardClient";

export const metadata: Metadata = {
  title: "Novotrend CRM",
  description: "Future of global trading",
};

export default async function Ecommerce() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value || cookieStore.get("userToken")?.value;

  if (!token) {
    redirect("/sign-in");
  }

  return (
    <>
      <div className="">
        <div className="">
          {/* <EcommerceMetrics /> */}
          <DashboardClient />
          {/* Not using */}
          {/* <div className="col-span-12 py-5 xl:col-span-12">
            <DemographicCard />
          </div> */}
        </div>
      </div>
    </>
  );
}
