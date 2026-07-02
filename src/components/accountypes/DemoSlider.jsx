"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FormInModal from "../example/ModalExample/FormInModal";

const plans = [
  {
    name: "Standard",
    desc: "Commission : No Commission",
    price: "$500 / Min deposit",
    features: ["Min spread : 1 Pips", "Max leverage : 200"],
  },
  {
    name: "Pro",
    desc: "Commission : No Commission",
    price: "$1000 / Min deposit",
    tag: "Best Deal",
    features: ["Min spread : 0.9 Pips", "Max leverage : 300"],
  },
  {
    name: "Business",
    desc: "Commission : $5 Per Lot",
    price: "$5000 / Min deposit",
    features: ["Min spread : RAW", "Max leverage : 1000"],
  },
  {
    name: "Ecn",
    desc: "Commission : $5 Per Lot",
    price: "$10000 / Min deposit",
    features: ["Min spread : RAW", "Max leverage : 500"],
  },
  {
    name: "Cent",
    desc: "Commission : No Commission",
    price: "$300 / Min deposit",
    features: ["Min spread : 1.0", "Max leverage : 100"],
  },
  {
    name: "Demo",
    desc: "Commission : No Commission",
    price: "$0 / Min deposit",
    features: ["Min spread : 1.5", "Max leverage : 100"],
  },
];

export default function PlanCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState < boolean > false;
  const [selectedPlan, setSelectedPlan] = useState(null);

  const cardsPerView = 3;
  const lastIndex = plans.length - cardsPerView;

  const next = () => setCurrentIndex((prev) => (prev < lastIndex ? prev + 1 : 0));
  const prev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : lastIndex));

  const openModal = (plan) => {
    setSelectedPlan(plan);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const visiblePlans = plans.slice(currentIndex, currentIndex + cardsPerView);

  return (
    <>
      <div className="mx-auto max-w-6xl py-3 text-center">
        <h2 className="mb-2 text-3xl font-semibold text-slate-900 dark:text-white">
          Open Your Trading Account
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Choose from Standard, Pro, Business , ECN , Cent or Demo accounts — tailored to your
          trading strategy.
        </p>
      </div>
      <div className="relative w-full">
        {/* LEFT BUTTON */}
        {!isOpen && (
          <button
            onClick={prev}
            className="absolute top-1/2 left-0 z-20 -translate-y-1/2 rounded-full bg-white p-2 shadow-md dark:bg-white/10"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {/* CARDS */}
        <div className="grid grid-cols-1 gap-6 px-12 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePlans.map((plan, idx) => (
            <div
              key={idx}
              className={`border ${
                plan.tag ? "border-indigo-600" : "border-gray-300"
              } rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg dark:bg-white/[0.03]`}
            >
              <h3 className="mb-3 flex items-center text-xl font-semibold text-slate-900 dark:text-white">
                {plan.name}
                {plan.tag && (
                  <span className="ml-2 rounded-md bg-indigo-500 px-2 py-1 text-xs font-semibold text-white">
                    {plan.tag}
                  </span>
                )}
              </h3>

              <p className="text-[15px] text-slate-600 dark:text-slate-400">{plan.desc}</p>

              <div className="mt-6">
                <h3 className="text-3xl font-semibold text-slate-900 dark:text-white">
                  {plan.price}
                </h3>
              </div>

              <div className="mt-6">
                <h4 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                  Includes
                </h4>

                <ul className="space-y-3">
                  {plan.features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center text-[15px] font-medium text-slate-600 dark:text-slate-400"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        className="mr-3 fill-green-500"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" />
                      </svg>
                      {f}
                    </li>
                  ))}
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

        {/* RIGHT BUTTON – hide when modal open */}
        {!isOpen && (
          <button
            onClick={next}
            className="absolute top-1/2 right-0 z-20 -translate-y-1/2 rounded-full bg-white p-2 shadow-md dark:bg-white/10"
          >
            <ChevronRight size={22} />
          </button>
        )}
        {/* MODAL OUTSIDE THE SLIDER */}
        <FormInModal isOpen={isOpen} onClose={closeModal} plan={selectedPlan} />
      </div>
    </>
  );
}
