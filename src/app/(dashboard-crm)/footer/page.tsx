
import Footer from "@/components/footer/Footer";
import { Metadata } from "next";



export const metadata: Metadata = {
  title: "CashDepositForm",
  description:
    "deposit",
  // other metadata
};

export default function DashboardFooter() {
  return (
    <div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
