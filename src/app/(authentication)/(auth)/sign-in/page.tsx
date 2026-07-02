import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Novotrend Test CRM",
  description: "Future of global trading Dashboard Template",
};

export default function SignIn() {
  return <SignInForm />;
}
