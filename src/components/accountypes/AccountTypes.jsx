"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FormInModal from "../example/ModalExample/FormInModal";
import { useAccountListGroup } from "@/features/crm/account/hooks/account.hooks";

export default function PlanCarousel() {
  const { user, isLoading } = useAccountListGroup();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = user ?? [];

  const cardsPerView = 3;
  const lastIndex = Math.max(plans.length - cardsPerView, 0);

  const next = () => setCurrentIndex((prev) => (prev < lastIndex ? prev + 1 : 0));
  const prev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : lastIndex));

  const openModal = (plan) => {
    setSelectedPlan(plan);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedPlan(null);
  };

  const visiblePlans = plans.slice(currentIndex, currentIndex + cardsPerView);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="border-brand-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-6xl py-6 text-center">
        <h2 className="mb-2 text-3xl font-semibold text-slate-900 dark:text-white">
          Open Your Trading Account
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Choose from Standard, Pro, Business, ECN, Cent or Demo accounts — tailored to your trading
          strategy.
        </p>
      </div>

      <div className="relative w-full">
        {!isOpen && (
          <button
            onClick={prev}
            className="absolute top-1/2 left-0 z-20 -translate-y-1/2 rounded-full bg-white p-2 shadow-md dark:bg-white/10"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {plans.length === 0 ? (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            No account types found.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 px-12 sm:grid-cols-2 lg:grid-cols-3">
            {visiblePlans.map((plan) => (
              <div
                key={plan.groupid}
                className="rounded-2xl border border-gray-300 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg dark:bg-white/[0.03]"
              >
                <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
                  {plan.groupname}
                </h3>

                <p className="text-[15px] text-slate-600 dark:text-slate-400">
                  Commission : {plan.commission}
                </p>

                <div className="mt-6">
                  <h3 className="text-3xl font-semibold text-slate-900 dark:text-white">
                    {plan?.min_deposit} Min deposit
                  </h3>
                </div>

                <div className="mt-6">
                  <h4 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                    Includes
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-center text-[15px] font-medium text-slate-600 dark:text-slate-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        className="mr-3 fill-green-500"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" />
                      </svg>
                      Min spread : {plan?.min_spread}
                    </li>
                    <li className="flex items-center text-[15px] font-medium text-slate-600 dark:text-slate-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        className="mr-3 fill-green-500"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" />
                      </svg>
                      Max leverage : {plan.leverage}
                    </li>
                  </ul>

                  <button
                    onClick={() => openModal(plan)}
                    type="button"
                    className="mt-8 w-full rounded-md bg-indigo-600 px-4 py-2.5 text-[15px] font-medium text-white hover:bg-indigo-700"
                  >
                    Open Selected Account
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isOpen && (
          <button
            onClick={next}
            className="absolute top-1/2 right-0 z-20 -translate-y-1/2 rounded-full bg-white p-2 shadow-md dark:bg-white/10"
          >
            <ChevronRight size={22} />
          </button>
        )}

        <FormInModal isOpen={isOpen} onClose={closeModal} plan={selectedPlan} />
      </div>
    </>
  );
}
