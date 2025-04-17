// components/TransactionFormDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTransactions } from "@/lib/hooks/useTransactions";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Transaction } from "@/types/transaction";
import { useEffect } from "react";

const transactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export default function TransactionFormDialog({
  open,
  setOpen,
  transaction,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  transaction?: Transaction;
}) {
  const { addTransaction, updateTransaction } = useTransactions();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      amount: 0,
    },
  });

  useEffect(() => {
    if (transaction) {
      reset({
        description: transaction.description,
        amount: transaction.amount,
      });
    }
  }, [transaction, reset]);

  const onSubmit = async (data: TransactionFormData) => {
    const date = new Date().toISOString();

    const transactionData = {
      ...data,
      date,
      type: "expense", // or set from UI later
    };

    if (transaction) {
      updateTransaction.mutate({ ...transaction, ...transactionData });
      toast.success("Transaction updated!");
    } else {
      addTransaction.mutate(transactionData);
      toast.success("Transaction added!");
    }

    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{transaction ? "Edit" : "Add"} Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <Input {...register("description")} placeholder="Description" />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}

          <Input
            {...register("amount", { valueAsNumber: true })}
            type="number"
            placeholder="Amount"
          />
          {errors.amount && (
            <p className="text-red-500">{errors.amount.message}</p>
          )}

          <Button type="submit" className="w-full">
            {transaction ? "Update" : "Add"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
