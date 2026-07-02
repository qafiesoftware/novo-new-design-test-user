import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Novotrend Test CRM",
  description: "SignUp Page  Dashboard Template",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
