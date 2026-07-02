import { Metadata } from "next";
import DepositFund from "../../../../components/funds/deposit/DepositFund";

export const metadata: Metadata = {
  title: "fund",
  description: "deposit",
  // other metadata
};

export default function Deposit() {
  return (
    <div>
      <div>
        <DepositFund />
      </div>
    </div>
  );
}
