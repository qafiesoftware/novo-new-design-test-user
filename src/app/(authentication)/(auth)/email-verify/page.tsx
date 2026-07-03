import { Metadata } from "next";
import EmailVerificationOTP from "@/components/auth/EmailVerificationOTP";

export const metadata: Metadata = {
  title: "Novotrend CRM - EmailVerification Page",
  description: "Future of global trading Dashboard Template",
};

export default function EmailVerify() {
  return <EmailVerificationOTP />;
}
