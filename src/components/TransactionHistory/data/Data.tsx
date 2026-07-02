export type Transaction = {
  id: number;
  date: string;
  details: string;
  credit: number;
  debit: number;
  balance: number;
  type: "Deposit" | "Withdraw" | "Transfer";
  receipt?: string;
  note?: string;
  remark?: string;
  withdrawType?: string;
  from?: string;
  to?: string;
};

export const transactions: Transaction[] = [
  {
    id: 1,
    date: "2025-10-07 13:22:49",
    details: "Manual Payment Request Accepted",
    credit: 150,
    debit: 0,
    balance: 150,
    type: "Deposit",
    receipt: "/img1.jpg",
    note: "Added",
    remark: "-",
  },
  {
    id: 2,
    date: "2025-10-09 18:05:55",
    details: "Withdraw Request Generated @ 29",
    credit: 0,
    debit: 1,
    balance: 1,
    type: "Withdraw",
    withdrawType: "UPI",
    remark: "-",
  },
  {
    id: 3,
    date: "2025-10-10 12:53:50",
    details: "Transfer to MT5 400026",
    credit: 0,
    debit: 10,
    balance: 0,
    type: "Transfer",
    from: "MT5 400026",
    to: "MT5 400025",
    note: "Internal Transfer",
  },
];
