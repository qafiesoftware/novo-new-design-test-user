import { Metadata } from "next";
import UserProfile from "@/components/userprofile/UserProfile";

export const metadata: Metadata = {
  title: "TransactionHistory",
  description: "TransactionHistory",
  // other metadata
};

export default function profile() {
  return (
    <div>
      <div>
        <UserProfile />
      </div>
    </div>
  );
}
