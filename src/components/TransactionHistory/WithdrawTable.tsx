// import { Transaction } from "@/features/crm/transaction-history/types/transaction-history.types";

// const WithdrawTable = ({ rows }: { rows: Transaction[] }) => (
//   <>
//     {rows.length === 0 ? (
//       <tr>
//         <td colSpan={9} className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
//           No withdrawal transactions found
//         </td>
//       </tr>
//     ) : (
//       rows.map((t, index) => (
//         <tr
//           key={t.id}
//           className="divide-x text-center transition hover:bg-blue-50/50 dark:hover:bg-gray-800/50"
//         >
//           <td className="px-4 py-3">{index + 1}</td>
//           <td className="px-4 py-3 whitespace-nowrap">{t.date ?? "-"}</td>
//           <td className="px-4 py-3 whitespace-nowrap">{t.amount ?? "-"}</td>
//           <td className="px-4 py-3">{t.withdraw_type ?? "-"}</td>
//           <td className="px-4 py-3">{t.withdraw_type_details ?? "-"}</td>
//           <td className="px-4 py-3 whitespace-nowrap">
//             <span
//               className={`rounded-full px-3 py-1 text-xs ${
//                 t.status === "Pending"
//                   ? "bg-[#F4F3FF] text-[#5925DC]"
//                   : t.status === "Approved"
//                     ? "bg-[#ECFDF3] text-[#027A48]"
//                     : "bg-[#FEF3F2] text-[#B42318]"
//               }`}
//             >
//               {t.status}
//             </span>
//           </td>
//           <td className="px-4 py-3">{t.remark ?? "-"}</td>
//         </tr>
//       ))
//     )}
//   </>
// );

// export default WithdrawTable;

import { Transaction } from "@/features/crm/transaction-history/types/transaction-history.types";

interface WithdrawTableProps {
  rows: Transaction[];
  currentPage: number;
  rowsPerPage: number;
}

const WithdrawTable = ({ rows, currentPage, rowsPerPage }: WithdrawTableProps) => (
  <>
    {rows.length === 0 ? (
      <tr>
        <td colSpan={9} className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No withdrawal transactions found
        </td>
      </tr>
    ) : (
      rows.map((t, index) => (
        <tr
          key={t.id}
          className="divide-x text-center transition hover:bg-blue-50/50 dark:hover:bg-gray-800/50"
        >
          {/* ✅ Sr No fix */}
          <td className="px-4 py-3">{(currentPage - 1) * rowsPerPage + index + 1}</td>
          <td className="px-4 py-3 whitespace-nowrap">{t.date ?? "-"}</td>
          <td className="px-4 py-3 whitespace-nowrap">{t.amount ?? "-"}</td>
          <td className="px-4 py-3">{t.withdraw_type ?? "-"}</td>
          <td className="px-4 py-3">{t.withdraw_type_details ?? "-"}</td>
          <td className="px-4 py-3 whitespace-nowrap">
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
          <td className="px-4 py-3">{t.remark ?? "-"}</td>
        </tr>
      ))
    )}
  </>
);

export default WithdrawTable;
