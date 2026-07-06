"use client";

import CommissionCard from "./CommissionCard";
import AffiliateProgress from "./AffiliateProgress";
import PieChartComponent from "./affiliateprogress/PieChartComponent";
import { usePartnerDashboard } from "@/features/partner/dashboard/hooks/dashboard.hooks";
import LoayaltyTiers from "./LoyaltyTiers";

export default function DashboardHome2() {
  const { data, isLoading } = usePartnerDashboard();

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-3 dark:border-gray-800 dark:bg-white/[0.03]">
          <CommissionCard amount={data?.total_ib_commission} />
        </div>
        <div className="md:col-span-6">
          <AffiliateProgress
            progress={88}
            referrals={84}
            clicks={1203}
            rate={7}
            inviteLink="https://novo-new-design-test-user.vercel.app/sign-up"
            data={data}
            isLoading={isLoading}
          />
        </div>
        <div className="md:col-span-3">
          <div className="space-y-6 rounded-2xl border p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
            <PieChartComponent
              totalLots={data?.royaltyinfo?.total_lots}
              activeLevel={data?.active_clients}
            />
          </div>
        </div>
      </div>

      {/* Qualification Levels */}
      <LoayaltyTiers data={data} isLoading={isLoading} />
    </div>
  );
}
