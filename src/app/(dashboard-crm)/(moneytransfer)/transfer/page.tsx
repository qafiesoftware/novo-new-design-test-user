
import { Metadata } from "next";
import AccountSwitchTabs from "@/components/funds/Moneytransfer/AccountSwitchTabs";

export const metadata: Metadata = {
  title: "Money transfer",
  description:
    "Money Transfer method",
  // other metadata
};

export default function Accounttab() {
  return (
    <div>
      <div>
         <AccountSwitchTabs />
      </div>
    </div>
  );
}
