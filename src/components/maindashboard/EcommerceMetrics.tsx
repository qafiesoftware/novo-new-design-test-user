"use client";
import React from "react";
// import Badge from "../ui/badge/Badge";
// import { ArrowDownIcon, ArrowUpIcon } from "@/icons";
import { FaWallet } from "react-icons/fa";
import { FaBalanceScale } from "react-icons/fa";
import { PiHandWithdrawFill } from "react-icons/pi";
import { PiHandDepositFill } from "react-icons/pi";
import { useUserBalanceData } from "@/features/crm/dashboard/hooks/dashboard.hooks";

export const EcommerceMetrics = () => {
  const { user } = useUserBalanceData();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div
        className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
        style={{
          height: "215px",
          backgroundImage: "url('/images/background/Debit.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "scroll",
          borderRadius: "12px",
        }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <FaWallet className="size-6 text-gray-400 dark:text-white/90" />
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-white dark:text-gray-400">Wallet Balance</span>
            <h4
              className="text-title-sm mt-2 font-semibold text-white"
              style={{ marginTop: "31px" }}
            >
              $ {user?.balance}
            </h4>
          </div>
          {/* <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div
        className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
        style={{ height: "215px" }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <FaBalanceScale className="size-6 text-gray-400 dark:text-white/90" />
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">MT5 Balance</span>
            <h4
              className="text-title-sm mt-2 font-semibold text-gray-800 dark:text-white/90"
              style={{ marginTop: "31px" }}
            >
              $ {user?.mt5accbal}
            </h4>
          </div>

          {/* <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div
        className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
        style={{ height: "215px" }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <PiHandDepositFill className="size-7 text-gray-400 dark:text-white/90" />
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Deposits</span>
            <h4
              className="text-title-sm mt-2 font-semibold text-gray-800 dark:text-white/90"
              style={{ marginTop: "31px" }}
            >
              $ {user?.debitbal}
            </h4>
          </div>

          {/* <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div
        className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
        style={{ height: "215px" }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <PiHandWithdrawFill className="size-7 text-gray-400 dark:text-white/90" />
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Withdraws</span>
            <h4
              className="text-title-sm mt-2 font-semibold text-gray-800 dark:text-white/90"
              style={{ marginTop: "31px" }}
            >
              $ {user?.totalwithdraw}
            </h4>
          </div>

          {/* <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
