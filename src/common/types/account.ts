export type Account = {
  id: string;
  name: string;
  category: "Deposit" | "Crypto" | "Coming Soon";
  subtype: "cash" | "bank" | "crypto" | "coming";
  status?: string;
  balance: string;
  currency: string;
  fees: string;
  limits: string;
  lastActivity: string;
  icon: string;
  network?: "BEP20" | "TRC20" | "ETH20" | "MATIC20";
};