"use client"

import Image from "next/image";
import TransactionForm from "@/components/TransactionForm"; // Import your TransactionForm
import { useTransactions } from "@/lib/hooks/useTransactions"; // Import the hook for transactions

export default function Home() {
  const { transactions, addTransaction } = useTransactions(); // Use the hook to get transactions and add a new one

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {/* Add TransactionForm to allow adding new transactions */}
        <TransactionForm /> {/* No `transaction` prop passed here for a new transaction */}

        {/* Example of displaying current transactions */}
        <div className="mt-8 w-full sm:w-3/4">
          <h2 className="text-xl font-semibold">Current Transactions</h2>
          <ul className="space-y-4">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <li key={transaction.id} className="p-4 border border-gray-200 rounded-md">
                  <p className="text-lg font-medium">{transaction.title}</p>
                  <p>{transaction.type === "income" ? "+" : "-"} ${transaction.amount}</p>
                  <p>{new Date(transaction.date).toLocaleDateString()}</p>
                </li>
              ))
            ) : (
              <p>No transactions found.</p>
            )}
          </ul>
        </div>
      </main>

      
    </div>
  );
}
