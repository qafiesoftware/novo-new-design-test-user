
import { Metadata } from "next";
import NewAccount from "@/components/funds/newaccount/NewAccount"


export const metadata: Metadata = {
  title: "New Account",
  description:
    "deposit",
//   other metadata
};

export default function MyAccount() {
  return (
    <div>
      <div>
        <NewAccount/>
      </div>
    </div>
  );
}
