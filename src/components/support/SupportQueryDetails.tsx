"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useSupportTickets } from "@/features/crm/team-support/hooks/team-support.hooks";
import { SupportTicket } from "@/features/crm/team-support/types/team-support.types";

export default function SupportQueryDetails() {
  const { data: tickets = [], isLoading } = useSupportTickets();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Open" | "Closed">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ROWS = 5;

  // Filter
  const filtered = tickets.filter(
    (t) =>
      (filter === "All" || t.s_status === filter) &&
      (t.ticket_name.toLowerCase().includes(search.toLowerCase()) ||
        t.s_question.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS));
  const currentRows = filtered.slice((currentPage - 1) * ROWS, currentPage * ROWS);

  return (
    <div className="bg-gray-50 p-6 transition-colors duration-300 dark:bg-gray-900">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg transition-all dark:border-gray-700 dark:bg-gray-800">
        {/* Header + Controls */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Support Queries
          </h2>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <input
              type="text"
              placeholder="Search by ticket name or question..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#6951fa] focus:outline-none sm:w-72 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-200 dark:placeholder-gray-400"
            />
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as typeof filter);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-[#6951fa] focus:outline-none dark:border-gray-600 dark:bg-slate-800 dark:text-gray-200"
            >
              <option value="All">All</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full rounded-lg border border-gray-300 text-sm dark:border-gray-600">
            <thead>
              <tr className="bg-gray-100 text-center text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                {["ID", "Date", "Ticket", "Question", "File", "Status", "Details"].map((h) => (
                  <th
                    key={h}
                    className="border border-gray-300 p-3 font-medium dark:border-gray-600"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="dark:text-gray-300">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-indigo-500" />
                  </td>
                </tr>
              ) : currentRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 13h6m-6 4h6M9 9h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                        />
                      </svg>
                      <p className="text-sm font-medium">No tickets found</p>
                      <p className="text-xs text-gray-400">
                        You {"don't"} have any support tickets yet.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentRows.map((t: SupportTicket, i: number) => (
                  <tr
                    key={t.ticket_id}
                    className="text-center transition hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="border border-gray-300 p-3 dark:border-gray-700">
                      {(currentPage - 1) * ROWS + i + 1}
                    </td>
                    <td className="border border-gray-300 p-3 whitespace-nowrap dark:border-gray-700">
                      {t.s_date}
                    </td>
                    <td className="border border-gray-300 p-3 font-medium dark:border-gray-700">
                      {t.ticket_name}
                    </td>
                    <td className="border border-gray-300 p-3 dark:border-gray-700">
                      {t.s_question}
                    </td>
                    <td className="border border-gray-300 p-3 dark:border-gray-700">
                      {t.s_file_name ? (
                        <a href={t.s_file_name} target="_blank" rel="noopener noreferrer">
                          <Image
                            src={t.s_file_name}
                            alt="attachment"
                            width={40}
                            height={40}
                            className="mx-auto rounded-md border border-gray-300 object-cover dark:border-gray-600"
                          />
                        </a>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">NA</span>
                      )}
                    </td>
                    <td className="border border-gray-300 p-3 dark:border-gray-700">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          t.s_status === "Open"
                            ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                        }`}
                      >
                        {t.s_status}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-3 dark:border-gray-700">
                      <Link
                        href={`query/${t.ticket_id}`}
                        className="rounded-lg bg-[#465FFF] px-4 py-1.5 text-sm text-white transition hover:bg-[#6951fa]"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-3 flex justify-end gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="rounded px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-40 dark:text-gray-200"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`rounded px-3 py-1 text-sm ${
                    currentPage === i + 1
                      ? "bg-[#465FFF] text-white"
                      : "hover:bg-gray-100 dark:text-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="rounded px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-40 dark:text-gray-200"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
