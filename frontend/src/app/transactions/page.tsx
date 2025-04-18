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
import { Loader2 } from "lucide-react";

export default function Home() {
  const { transactions, isLoading, deleteTransaction } = useTransactions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

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
      setIsDeleting(id);
      deleteTransaction.mutate(id, {
        onSuccess: () => {
          toast.success("Deleted successfully");
          setIsDeleting(null);
        },
        onError: () => {
          toast.error("Failed to delete transaction");
          setIsDeleting(null);
        },
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
      <div className="relative z-10 grid grid-rows-[auto_1fr_auto] min-h-screen pb-20 sm:p-20">
        <main className="flex flex-col gap-8 row-start-2 w-full">
          <div className="w-full flex justify-start">
            <Button className="bg-green-400 mx-5" onClick={handleAddClick}>Add Transaction</Button>
            <ExpenseChart transactions={transactions} />
          </div>

          <div className="w-full max-h-[500px] overflow-y-auto border rounded-lg p-4 backdrop-blur-md">
            <h2 className="text-xl font-semibold mb-4 text-left text-white">Recent Transactions</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
                <span className="ml-2 text-white">Loading transactions...</span>
              </div>
            ) : transactions.length > 0 ? (
              <ul className="space-y-4">
                {transactions.map((transaction) => (
                  <li
                    key={transaction._id}
                    className="p-4 border text-white rounded-md flex justify-between items-start gap-2"
                  >
                    <div className="text-left">
                      <p className="text-lg font-medium">{transaction.description}</p>
                      <p>₹{transaction.amount}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400">Category: {transaction.category}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleEditClick(transaction)}
                        disabled={isDeleting === transaction._id}
                      >
                        Update
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDeleteClick(transaction._id)}
                        disabled={isDeleting === transaction._id}
                      >
                        {isDeleting === transaction._id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            Deleting...
                          </>
                        ) : "Delete"}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-left text-white">No transactions found.</p>
            )}
          </div>
        </main>

        <TransactionFormDialog open={dialogOpen} setOpen={setDialogOpen} transaction={editingTransaction} />
      </div>
    </div>
  );
}