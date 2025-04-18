"use client";
import { useState } from "react";
import { useTransactions } from "@/lib/hooks/useTransactions";
import { Button } from "@/components/ui/button";
import TransactionFormDialog from "@/components/TransactionForm";
import { Transaction } from "@/types/transaction";
import { useToast } from "@/components/ui/toast";
import Navbar from "@/components/Navbar";
import ExpenseChart from "@/components/ExpenseChart";
import Particles from "@/components/ui/Particles";

export default function Home() {
  const { transactions, deleteTransaction } = useTransactions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);

  const handleAddClick = () => {
    setEditingTransaction(undefined);
    setDialogOpen(true);
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this transaction?");
    if (confirmed) {
      deleteTransaction.mutate(id, {
        onSuccess: () => toast.success("deleted successfully"),
        onError: () => toast.success("failure in deletion"),
      });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "#8884d8"]}
          particleCount={100}
          particleSpread={10}
          speed={0.2}
          particleBaseSize={80}
          moveParticlesOnHover
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <Navbar />
      <div className="relative z-10 grid grid-rows-[auto_1fr_auto] min-h-screen  pb-20  sm:p-20">
        <main className="flex flex-col gap-8 row-start-2 w-full">
          <div className="w-full flex justify-start">
            <Button  className="bg-green-400 mx-5" onClick={handleAddClick}>Add Transaction</Button>
            <ExpenseChart transactions={transactions} />
          </div>

          <div className="w-full max-h-[500px] overflow-y-auto border rounded-lg p-4 backdrop-blur-md">
            <h2 className="text-xl font-semibold mb-4 text-left text-white">Recent Transactions</h2>
            <ul className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <li
                    key={transaction._id}
                    className="p-4 border text-white  rounded-md flex justify-between items-start gap-2"
                  >
                    <div className="text-left">
                      <p className="text-lg font-medium">{transaction.description}</p>
                      <p>₹{transaction.amount}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" onClick={() => handleEditClick(transaction)}>
                        Update
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(transaction._id)}>
                        Delete
                      </Button>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-left">No transactions found.</p>
              )}
            </ul>
          </div>
        </main>

        <TransactionFormDialog open={dialogOpen} setOpen={setDialogOpen} transaction={editingTransaction} />
      </div>
    </div>
  );
}