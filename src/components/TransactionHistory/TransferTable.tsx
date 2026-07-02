// import { Transaction } from "@/features/crm/transaction-history/types/transaction-history.types";

// const TransferTable = ({ rows }: { rows: Transaction[] }) => (
//   <>
//     {rows.length === 0 ? (
//       <tr>
//         <td colSpan={10} className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
//           No transfer transactions found
//         </td>
//       </tr>
//     ) : (
//       rows.map((t, index) => (
//         <tr
//           key={t.id}
//           className="divide-x text-center transition hover:bg-blue-50/50 dark:hover:bg-gray-800/50"
//         >
//           <td className="px-4 py-3">{index + 1}</td>
//           <td className="px-4 py-3 whitespace-nowrap">{t.date}</td>
//           <td className="px-4 py-3">{t.debit || "-"}</td>
//           <td className="px-4 py-3">{t.from ?? "-"}</td>
//           <td className="px-4 py-3">{t.to ?? "-"}</td>
//           <td className="px-4 py-3">{t.note ?? "-"}</td>
//         </tr>
//       ))
//     )}
//   </>
// );

// export default TransferTable;

import { Transaction } from "@/features/crm/transaction-history/types/transaction-history.types";

interface TransferTableProps {
  rows: Transaction[];
  currentPage: number;
  rowsPerPage: number;
}

const TransferTable = ({ rows, currentPage, rowsPerPage }: TransferTableProps) => (
  <>
    {rows.length === 0 ? (
      <tr>
        <td colSpan={10} className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No transfer transactions found
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
          <td className="px-4 py-3 whitespace-nowrap">{t.date}</td>
          <td className="px-4 py-3">{t.debit || "-"}</td>
          <td className="px-4 py-3">{t.from ?? "-"}</td>
          <td className="px-4 py-3">{t.to ?? "-"}</td>
          <td className="px-4 py-3">{t.note ?? "-"}</td>
        </tr>
      ))
    )}
  </>
);

export default TransferTable;
