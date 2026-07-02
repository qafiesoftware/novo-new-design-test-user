import Image from "next/image";
import { Transaction } from "@/features/crm/transaction-history/types/transaction-history.types";

interface DepositTableProps {
  rows: Transaction[];
  currentPage: number;
  rowsPerPage: number;
}

const DepositTable = ({ rows, currentPage, rowsPerPage }: DepositTableProps) => (
  <>
    {rows.length === 0 ? (
      <tr>
        <td colSpan={10} className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No deposit transactions found
        </td>
      </tr>
    ) : (
      rows.map((t, index) => (
        <tr
          key={t.id}
          className="divide-x text-center transition hover:bg-blue-50/50 dark:hover:bg-gray-800/50"
        >
          {/* Sr No fix */}
          <td className="px-4 py-3">{(currentPage - 1) * rowsPerPage + index + 1}</td>
          <td className="px-4 py-3 whitespace-nowrap">{t.date}</td>
          <td className="px-4 py-3">{t.amount ?? "-"}</td>
          <td className="px-4 py-3">
            <span className="rounded-full border border-green-200 bg-green-100 px-3 py-[3px] text-xs font-semibold text-green-700">
              {t.payment_type ?? "-"}
            </span>
          </td>
          {/* <td className="flex items-center justify-center px-4 py-3">
            {t.req_image ? (
              <Image
                src={t.req_image}
                className="h-10 w-10 cursor-pointer rounded"
                onClick={() => window.open(t.req_image, "_blank")}
                height={40}
                width={40}
                alt="Receipt"
              />
            ) : (
              "-"
            )}
          </td> */}
          <td className="flex items-center justify-center px-4 py-3">
            {t.req_image ? (
              t.req_image.toLowerCase().endsWith(".pdf") ? (
                // PDF icon
                <div
                  onClick={() => window.open(t.req_image, "_blank")}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded border border-red-200 bg-red-50"
                  title="View PDF"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8.5 17h-1v-5h1.5c.8 0 1.5.7 1.5 1.5S9.8 15 9 15h-.5v2zm4 0h-1.5v-5H13c1.1 0 2 .9 2 2s-.9 3-2.5 3zm4-3.5h-1V17h-1v-5h2v1.5z" />
                  </svg>
                </div>
              ) : (
                // Image preview
                <Image
                  src={t.req_image}
                  className="h-10 w-10 cursor-pointer rounded"
                  onClick={() => window.open(t.req_image, "_blank")}
                  height={40}
                  width={40}
                  alt="Receipt"
                />
              )
            ) : (
              "-"
            )}
          </td>
          <td className="px-4 py-3">{t.note || "-"}</td>
          <td className="px-4 py-3">
            <span
              className={`rounded-full px-3 py-1 text-xs ${
                t.status === "Pending"
                  ? "bg-[#F4F3FF] text-[#5925DC]"
                  : t.status === "Approved"
                    ? "bg-[#ECFDF3] text-[#027A48]"
                    : "bg-[#FEF3F2] text-[#B42318]"
              }`}
            >
              {t.status}
            </span>
          </td>
          <td className="px-4 py-3">{t.req_remark ?? "-"}</td>
        </tr>
      ))
    )}
  </>
);

export default DepositTable;
