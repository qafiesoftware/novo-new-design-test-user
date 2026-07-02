"use client";

import { useCountries } from "@/features/auth/register/hooks/register.hooks";
import { Country } from "@/features/auth/register/types/register.types";
import { useState } from "react";

interface Props {
  value: Country | null;
  onChange: (country: Country) => void;
}

export default function CountryDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: countriesData, isLoading } = useCountries();

  const allCountries = countriesData?.data?.response ?? [];

  const filtered = allCountries.filter((c) =>
    c.country_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      {/* Selected Button */}
      <button
        onClick={() => setOpen(!open)}
        type="button"
        className="flex w-full items-center justify-between rounded-md border bg-white px-4 py-2.5 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
      >
        <span className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200">
          {value ? value.country_name : "Select Country"}
        </span>
        <svg width="14" viewBox="0 0 24 24" className="fill-gray-500 dark:fill-gray-400">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-[1000] mt-1 max-h-80 w-full overflow-auto rounded bg-white p-2 shadow dark:bg-slate-800 dark:shadow-slate-900 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-400 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-track]:bg-transparent">
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2 w-full rounded border bg-gray-50 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-gray-200 dark:placeholder:text-slate-400"
          />

          {isLoading ? (
            <p className="px-3 py-2 text-sm text-gray-400 dark:text-slate-400">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="px-3 py-2 text-sm text-gray-400 dark:text-slate-400">No country found</p>
          ) : (
            filtered.map((c) => (
              <div
                key={c.country_id}
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                  setSearch("");
                }}
                className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-700"
              >
                <span>{c.country_name}</span>
                <span className="ml-auto text-xs text-gray-400 dark:text-slate-400">
                  +{c.country_code}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
