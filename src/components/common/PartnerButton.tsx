"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PartnerButton = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    setIsChecked(savedRole === "partner");
  }, []);

  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);

    // Show tooltip on click also
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 1500);

    if (newValue) {
      localStorage.setItem("role", "partner");
      router.push("/partners/partner");
    } else {
      localStorage.setItem("role", "user");
      router.push("/");
    }
  };

  const tooltipText = isChecked ? "Switch to CRM" : "Switch to Partner";

  return (
    <div className="group relative flex w-fit justify-center">
      {/* Tooltip BOTTOM POSITION */}
      <div
        className={`translate-x--1/2 absolute left-1/2 mt-2 -translate-x-1/2 transform rounded-md px-3 py-1 text-sm whitespace-nowrap shadow-md transition-opacity duration-200 ${showTooltip ? "opacity-100" : "opacity-0 group-hover:opacity-100"} bg-gray-800 text-white dark:bg-gray-200 dark:text-black`}
        style={{ top: "110%" }} // Always bottom
      >
        {tooltipText}
      </div>

      {/* Tooltip bottom arrow */}
      <div
        className={`absolute left-1/2 mt-1 h-0 w-0 -translate-x-1/2 transform transition-opacity duration-200 ${showTooltip ? "opacity-100" : "opacity-0 group-hover:opacity-100"} border-r-8 border-b-8 border-l-8 border-r-transparent border-b-gray-800 border-l-transparent dark:border-b-gray-200`}
        style={{ top: "103%" }}
      />

      {/* Toggle switch */}
      <label className="flex cursor-pointer items-center select-none">
        <div className="relative">
          <input type="checkbox" checked={isChecked} onChange={handleToggle} className="sr-only" />

          <div
            className={`block h-8 w-14 rounded-full transition ${isChecked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`}
          ></div>

          <div
            className={`dot absolute top-1 left-1 h-6 w-6 rounded-full bg-white transition dark:bg-gray-100 ${isChecked ? "translate-x-6" : ""}`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default PartnerButton;
