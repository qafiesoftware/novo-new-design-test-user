import { Metadata } from "next";
import TransactionHistory from "@/components/TransactionHistory/TransactionHistory";

export const metadata: Metadata = {
  title: "TransactionHistory",
  description: "TransactionHistory",
  // other metadata
};

export default function Trans() {
  return (
    <div>
      <div>
        <TransactionHistory />
      </div>
    </div>
  );
}
