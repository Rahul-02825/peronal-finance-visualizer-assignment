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
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Transaction } from "@/types/transaction";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const transactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  date: z.date({
    required_error: "Date is required",
  }),
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      amount: 0,
      category: "",
      date: new Date(),
    },
  });

  useEffect(() => {
    if (transaction) {
      reset({
        description: transaction.description,
        amount: transaction.amount,
        category: transaction.category,
        date: new Date(transaction.date),
      });
    } else {
      reset({
        description: "",
        amount: 0,
        category: "",
        date: new Date(),
      });
    }
  }, [transaction, reset, open]);

  const onSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true);
    
    try {
      const transactionData = {
        ...data,
        date: data.date.toISOString(), // Convert Date object to ISO string for backend
      };

      if (transaction) {
        await updateTransaction.mutateAsync(
          { ...transaction, ...transactionData },
          {
            onSuccess: () => {
              toast.success("Transaction updated successfully");
              setOpen(false);
              reset();
            },
            onError: (error) => {
              toast.error("Failed to update transaction");
              console.error(error);
            },
          }
        );
      } else {
        await addTransaction.mutateAsync(
          transactionData,
          {
            onSuccess: () => {
              toast.success("Transaction added successfully");
              setOpen(false);
              reset();
            },
            onError: (error) => {
              toast.error("Failed to add transaction");
              console.error(error);
            },
          }
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isSubmitting) {
        setOpen(isOpen);
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{transaction ? "Edit" : "Add"} Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <Input 
            {...register("description")} 
            placeholder="Description" 
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}

          <Input
            {...register("amount", { valueAsNumber: true })}
            type="number"
            placeholder="Amount"
            disabled={isSubmitting}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount.message}</p>
          )}

          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Food",
                    "Transport",
                    "Utilities",
                    "Entertainment",
                    "Health",
                    "Other",
                  ].map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}

          {/* Date Picker */}
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <div className="flex flex-col space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !field.value ? "text-muted-foreground" : ""
                      }`}
                      disabled={isSubmitting}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={(date:Date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          />
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date.message}</p>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {transaction ? "Updating..." : "Adding..."}
              </>
            ) : (
              transaction ? "Update" : "Add"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}