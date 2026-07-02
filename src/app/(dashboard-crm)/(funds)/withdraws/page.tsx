import WithDrawsFund from "@/components/funds/withdraws/WithDrawsFund";
import { Metadata } from "next";



export const metadata: Metadata = {
  title: "WithDraws Funds",
  description:
    "WithDraws",
};

export default function Withdraws() {
  return (
    <div>
      <div>
         <WithDrawsFund />
      </div>
    </div>
  );
}
