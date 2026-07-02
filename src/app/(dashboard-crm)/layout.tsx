"use client";

import DashboardFooter from "@/components/footer/Footer";
import { ReactNode, useState } from "react";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import BecomePartnerModal from "@/components/ui/modal/BecomePartnerModal";
import { useUserBalanceData } from "@/features/crm/dashboard/hooks/dashboard.hooks";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const [openPartnerModal, setOpenPartnerModal] = useState<boolean>(false);

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  const { user, isLoading  } = useUserBalanceData();
  const isIB: number | string = user?.user_activated_for_ib ?? 0;

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar
        isIB={isIB}
        onBecomePartnerClick={() => setOpenPartnerModal(true)}
        isIBLoading={isLoading}
      />
      <Backdrop />
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
        {/* Header */}
        <AppHeader isIB={isIB} />

        {/* MODAL GLOBAL */}
        {openPartnerModal && (
          <BecomePartnerModal
            onClose={() => setOpenPartnerModal(false)}
            onSuccess={() => {
              setOpenPartnerModal(false);
            }}
          />
        )}

        {/* Page Content */}
        <div className="mx-auto max-w-(--breakpoint-2xl) p-4 md:p-6">{children}</div>
        <div className="mx-auto max-w-(--breakpoint-2xl) p-4 md:p-6">
          <DashboardFooter />
        </div>
      </div>
    </div>
  );
}
