"use client";

import Image from "next/image";
import commissionimg from "../../../public/images/grid-image/comission1.png";
import React, { useState } from "react";
import { X } from "lucide-react";

// Props Types
interface CommissionCardProps {
  amount: number | string;
}

const partnerLevels = [
  {
    level: "Level - 1",
    percentage: "15%",
  },
  {
    level: "Level - 2",
    percentage: "10%",
  },
  {
    level: "Level - 3",
    percentage: "5%",
  },
  {
    level: "Level - 4",
    percentage: "3%",
  },
  {
    level: "Level - 5",
    percentage: "2%",
  },
];

export default function CommissionCard({ amount }: CommissionCardProps) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="flex h-full w-full flex-col justify-between rounded-2xl border p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6 gap-4">
          {/* Left vector image */}
          <div className="flex flex-shrink-0 items-center justify-center">
            <Image src={commissionimg} alt="Commission" className="h-45 w-45 object-contain" />
          </div>

          {/* Text section */}
          <div>
            <p className="text-center font-medium text-gray-600 dark:text-white/90">
              Total Commission{" "}
            </p>

            <h2 className="mt-2 text-center text-3xl font-semibold dark:text-white/90">
              ${amount}
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpenModal(true)}
          className="mt-auto w-full rounded-xl bg-indigo-500 py-3 font-medium text-white transition hover:bg-indigo-600 dark:text-white/90"
        >
          Partner Levels
        </button>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4 dark:bg-black/60">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl dark:bg-slate-800">
            {/* Close Button */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-5 right-5 rounded-full bg-gray-100 p-2 text-gray-500 transition hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
            >
              <X size={18} />
            </button>

            {/* Modal Heading */}
            <div className="mb-8 rounded-xl border border-indigo-200 bg-indigo-50 px-6 py-4 text-center dark:border-indigo-800 dark:bg-indigo-950/50">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Partner Levels</h2>
            </div>

            {/* Levels List */}
            <div className="space-y-5">
              {partnerLevels.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 transition hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-slate-700 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/30"
                >
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      {item.level}
                    </p>
                  </div>

                  <div className="rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                    {item.percentage}
                  </div>
                </div>
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setOpenModal(false)}
              className="mt-8 w-full rounded-xl bg-indigo-500 py-3 font-semibold text-white transition hover:bg-indigo-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
