"use client";

import { useTransactions } from "@/lib/hooks/useTransactions";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Transaction } from "@/types/transaction";

const transactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export default function TransactionForm({ transaction }: { transaction?: Transaction }) {
  const { addTransaction, updateTransaction } = useTransactions();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction
      ? { description: transaction.description, amount: transaction.amount }
      : { description: "", amount: 0 },
  });

  const onSubmit = async (data: TransactionFormData) => {
    const date = new Date().toISOString();

    const transactionData = {
      ...data,
      date,
    };

    console.log(transactionData);

    if (transaction) {
      updateTransaction.mutate({ ...transaction, ...transactionData });
      toast.success("Transaction updated!");
    } else {
      addTransaction.mutate(transactionData);
      toast.success("Transaction added!");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register("description")}
        placeholder="Description"
        className="w-full"
      />
      {errors.description && (
        <p className="text-red-500">{errors.description.message}</p>
      )}

      <Input
        {...register("amount", { valueAsNumber: true })}
        placeholder="Amount"
        type="number"
        className="w-full"
      />
      {errors.amount && <p className="text-red-500">{errors.amount.message}</p>}

      <Button type="submit" className="w-full">Submit</Button>
    </form>
  );
}
