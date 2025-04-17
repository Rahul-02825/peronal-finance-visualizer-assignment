// types/transaction.ts
export interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: "income" | "expense";
    date: string;
  }
  