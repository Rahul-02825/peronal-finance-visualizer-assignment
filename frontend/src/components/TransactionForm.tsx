"use client"

import { useState } from "react";
import { useTransactions } from "@/lib/hooks/useTransactions";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Transaction } from "@/types/transaction";
const transactionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["income", "expense"]),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export default function TransactionForm({ transaction }: { transaction?: Transaction }) {
  const { addTransaction, updateTransaction } = useTransactions();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction
      ? { title: transaction.title, amount: transaction.amount, type: transaction.type }
      : { title: "", amount: 0, type: "income" },
  });

  const onSubmit = async (data: TransactionFormData) => {
    const date = new Date().toISOString(); 

    const transactionData = {
      ...data,
      date, 
    };

    if (transaction) {
      await updateTransaction.mutate({ ...transaction, ...transactionData });
      toast.success("Transaction updated!");
    } else {
      await addTransaction.mutate(transactionData);
      toast.success("Transaction added!");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register("title")}
        placeholder="Transaction Title"
        className="w-full"
      />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      
      <Input
        {...register("amount", { valueAsNumber: true })}
        placeholder="Amount"
        type="number"
        className="w-full"
      />
      {errors.amount && <p className="text-red-500">{errors.amount.message}</p>}

      <select {...register("type")} className="w-full border p-2">
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <Button type="submit" className="w-full">Submit</Button>
    </form>
  );
}
