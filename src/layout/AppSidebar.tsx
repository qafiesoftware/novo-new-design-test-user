"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSidebar } from "../context/SidebarContext";
import {
  ChevronDownIcon,
  FaArrowTrendUp,
  FaClock,
  FaHeadset,
  FaHouseChimney,
  FaMoneyBillTransfer,
  FaSackDollar,
  FaUserPen,
  FaUserPlus,
  HorizontaLDots,
  PiChartBar,
  PiChartLineUpBold,
  PiChartPieSliceBold,
  PiChartPolar,
  PiPercentBold,
  FaUserGroup,
} from "../icons";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
  }[];
  target?: string;
  action?: "OPEN_PARTNER_MODAL";
};

interface AppSidebarProps {
  isIB: number | string;
  onBecomePartnerClick?: () => void;
  isIBLoading?: boolean;
}

/* PARTNER MENU */
const partnerMenu: NavItem[] = [
  {
    icon: <FaHouseChimney size={20} />,
    name: "Dashboard",
    path: "/partners/partner",
  },
  {
    icon: <PiChartLineUpBold size={20} />,
    name: "Reports",
    subItems: [
      { name: "Clients", path: "/partners/clients" },
      { name: "Client Accounts", path: "/partners/clientaccount" },
      // { name: "Client Transaction", path: "/partners/clienttransaction" },
      { name: "Reward history", path: "/partners/rewards" },
    ],
  },
  {
    icon: <PiPercentBold size={20} />,
    name: "Rebates",
    subItems: [{ name: "Clients History", path: "/partners/rebates" }],
  },
  {
    icon: <PiChartPieSliceBold size={20} />,
    name: "IB Commission",
    subItems: [{ name: "Withdraw", path: "/partners/ib" }],
  },
  {
    icon: <FaHeadset size={20} />,
    name: "Partner Support",
    subItems: [{ name: "Support", path: "/partners/partnersupport" }],
  },
];

const AppSidebar: React.FC<AppSidebarProps> = ({
  isIB,
  onBecomePartnerClick,
  isIBLoading = false,
}) => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();

  const pathname = usePathname();

  /* USER MENU */
  const userMenu: NavItem[] = [
    {
      icon: <FaHouseChimney size={20} />,
      name: "Dashboard",
      path: "/",
    },
    {
      icon: <FaUserPlus size={20} />,
      name: "Account",
      path: "/account",
    },
    {
      name: "Funds",
      icon: <FaSackDollar size={20} />,
      subItems: [
        { name: "Deposit Funds", path: "/deposit" },
        { name: "Withdraw Funds", path: "/withdraws" },
        { name: "Add Bank Account", path: "/newaccount" },
      ],
    },
    {
      icon: <FaMoneyBillTransfer size={20} />,
      name: "Money Transfer",
      path: "/transfer",
    },
    {
      icon: <FaClock size={20} />,
      name: "Transaction History",
      path: "/transaction-history",
    },
    {
      icon: <PiChartBar size={20} />,
      name: "Trading History",
      path: "/trading-history",
    },
    {
      icon: <PiChartPolar size={20} />,
      name: "Trading Platforms",
      path: "/trading-platform",
    },
    {
      icon: <FaArrowTrendUp size={20} />,
      name: "Social Trading",
      path: "https://socialtrading.novotrend.co:8085/portal/",
      target: "_blank",
    },
    {
      icon: <FaHeadset size={20} />,
      name: "Team Support",
      subItems: [
        { name: "Query Support", path: "/support/query" },
        // { name: "Chat Support", path: "/support/chat-support" },
        { name: "All Query", path: "/support/querystatus" },
      ],
    },
    {
      icon: <FaUserPen size={20} />,
      name: "Profile",
      subItems: [
        {
          name: "Personal Profile",
          path: "/user-profile",
        },
      ],
    },
    ...(isIBLoading
      ? []
      : Number(isIB) === 0
        ? [
            {
              icon: <FaUserGroup size={20} />,
              name: "Become A Partner",
              action: "OPEN_PARTNER_MODAL",
            } as NavItem,
          ]
        : []),
  ];

  const role: "user" | "partner" = pathname.startsWith("/partners") ? "partner" : "user";

  const menuToRender = role === "partner" ? partnerMenu : userMenu;

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  /* SUBMENU LOGIC */
  const [openSubmenu, setOpenSubmenu] = useState<{
    index: number;
  } | null>(null);

  const subMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) => (prev?.index === index ? null : { index }));
  };

  useEffect(() => {
    const updated: Record<number, number> = {};
    Object.entries(subMenuRefs.current).forEach(([key, el]) => {
      if (el) {
        updated[Number(key)] = el.scrollHeight;
      }
    });
  }, [openSubmenu]);

  useEffect(() => {
    let foundIndex: number | null = null;
    menuToRender.forEach((nav, index) => {
      const match = nav.subItems?.some((sub) => isActive(sub.path));

      if (match) {
        foundIndex = index;
      }
    });

    if (foundIndex === null) return;

    setOpenSubmenu((prev) => (prev?.index === foundIndex ? prev : { index: foundIndex! }));
  }, [pathname]);

  const renderMenu = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => {
        const hasActiveChild = nav.subItems?.some((sub) => isActive(sub.path)) ?? false;

        return (
          <li key={nav.name}>
            {nav.action === "OPEN_PARTNER_MODAL" ? (
              <button onClick={onBecomePartnerClick} className="menu-item menu-item-inactive">
                <span>{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </button>
            ) : nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index)}
                className={`menu-item group ${
                  openSubmenu?.index === index || hasActiveChild
                    ? "menu-item-active"
                    : "menu-item-inactive"
                }`}
                type="button"
              >
                <span>{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <>
                    <span className="menu-item-text">{nav.name}</span>
                    <span
                      className={`ml-auto transition-transform duration-300 ${
                        openSubmenu?.index === index ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      <ChevronDownIcon />
                    </span>
                  </>
                )}
              </button>
            ) : nav.path ? (
              nav.target === "_blank" ? (
                <a
                  href={nav.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`menu-item ${
                    isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
                >
                  <span>{nav.icon}</span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </a>
              ) : (
                <Link
                  href={nav.path}
                  className={`menu-item ${
                    isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
                >
                  <span>{nav.icon}</span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            ) : null}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[index] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu?.index === index
                      ? `${subMenuRefs.current[index]?.scrollHeight ?? 0}px`
                      : "0px",
                }}
              >
                <ul className="mt-2 ml-9 space-y-1">
                  {nav.subItems.map((sub) => (
                    <li key={sub.name}>
                      <Link
                        href={sub.path}
                        className={`menu-dropdown-item ${
                          isActive(sub.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        }`}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed top-0 left-0 z-50 mt-16 flex h-screen flex-col border-r bg-white px-5 transition-all duration-300 lg:mt-0 dark:bg-gray-900 ${
        isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"
      } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => {
        if (!isExpanded) {
          setIsHovered(false);
        }
      }}
    >
      {/* LOGO */}
      <div className="py-8">
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/darkmode.png"
                alt="Logo"
                width={231}
                height={66}
              />

              <Image
                className="hidden dark:block"
                src="/images/logo/lightmode.png"
                alt="Logo"
                width={231}
                height={66}
              />
            </>
          ) : (
            <Image src="/images/logo/faviconslg.png" alt="Logo" width={40} height={40} />
          )}
        </Link>
      </div>

      {/* MENU */}
      <div className="flex flex-col overflow-y-auto dark:text-white">
        <nav className="mb-6">
          <h2 className="mb-4 text-xs text-gray-400 uppercase">
            {isExpanded || isHovered || isMobileOpen ? "" : <HorizontaLDots />}
          </h2>

          {renderMenu(menuToRender)}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
