"use client";
import { useState } from "react";
import { DateRange } from "react-date-range";
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";

export default function DateRangePickerInput() {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  return (
    <div className="relative">
      {/* Input-like display */}
      <div
        onClick={() => setOpen(!open)}
        className="border rounded-lg text-sm px-4 py-2 w-72 cursor-pointer bg-white flex items-center justify-between"
      >
        <span>
          {range[0].startDate.toLocaleDateString()} —{" "}
          {range[0].endDate.toLocaleDateString()}
        </span>
        <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Calendar dropdown */}
      {open && (
        <div className="absolute mt-2 shadow-lg bg-white rounded-xl z-50 p-2">
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={2}
            direction="horizontal"
          />

          <div className="flex justify-end px-3 pb-3">
            <button
              onClick={() => setOpen(false)}
              className="text-sm bg-[#465FFF] px-4 py-2 rounded-md text-white hover:bg-[#3b50e8]"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
