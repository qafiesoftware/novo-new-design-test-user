import ResetPassword from "@/components/auth/ResetPassword";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ResetPassword Page |  - Novotrend CRM",
  description: "Future of global trading Dashboard Template",
};

export default function resetPassword() {
  return (
    <Suspense fallback={null}>
      <ResetPassword />
    </Suspense>
  );
}
