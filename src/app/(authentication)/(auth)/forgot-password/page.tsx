import { Metadata } from "next";
import ForgetPassword from "@/components/auth/ForgetPassword";

export const metadata: Metadata = {
  title: "ForgotPassword |  - Novotrend Test CRM",
  description: "Future of global trading Dashboard Template",
};

export default function forgotPassowrd() {
  return <ForgetPassword />;
}