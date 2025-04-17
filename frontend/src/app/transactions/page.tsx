"use client";
import { useState } from "react";
import { useTransactions } from "@/lib/hooks/useTransactions";
import { Button } from "@/components/ui/button";
import TransactionFormDialog from "@/components/TransactionForm";
import { Transaction } from "@/types/transaction";
import { useToast } from "@/components/ui/toast";
import Navbar from "@/components/Navbar";
import ExpenseChart from "@/components/ExpenseChart"

export default function Home() {
  const { transactions, deleteTransaction } = useTransactions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const [showStats, setShowStats] = useState(false);

  const [editingTransaction, setEditingTransaction] = useState<
    Transaction | undefined
  >(undefined);

  const handleAddClick = () => {
    setEditingTransaction(undefined);
    setDialogOpen(true);
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    console.log(id);
    const confirmed = confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (confirmed) {
      deleteTransaction.mutate(id, {
        onSuccess: () => toast.success("deleted successfully"),
        onError: () => toast.success("failure in deletion"),
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full sm:w-3/4">
          <Button onClick={handleAddClick}>Add Transaction</Button>
          <ExpenseChart transactions={transactions} />

          <div className="mt-8 w-full max-h-[400px] overflow-y-auto border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Current Transactions</h2>
            <ul className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <li
                    key={transaction._id}
                    className="p-4 border border-gray-200 rounded-md flex justify-between items-start gap-2"
                  >
                    <div>
                      <p className="text-lg font-medium">
                        {transaction.description}
                      </p>
                      <p>₹{transaction.amount}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEditClick(transaction)}
                      >
                        Update
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteClick(transaction._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))
              ) : (
                <p>No transactions found.</p>
              )}
            </ul>
          </div>
        </main>

        <TransactionFormDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          transaction={editingTransaction}
        />
      </div>
    </div>
  );
}
