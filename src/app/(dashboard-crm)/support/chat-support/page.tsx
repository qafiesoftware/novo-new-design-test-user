import SupportChat from "@/components/support/SupportChat";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Novotrend CRM",
  description: "Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function Query() {
  return (
    <div>
      <SupportChat />
    </div>
  );
}
