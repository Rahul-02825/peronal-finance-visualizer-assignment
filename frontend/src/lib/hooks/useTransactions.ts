import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { Transaction } from "@/types/transaction";

export const useTransactions = () => {
  const queryClient = useQueryClient();

  const { data: transactions = [], ...rest } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await api.get<Transaction[]>("/transactions/getall");
      return res.data;
    },
  });

  const addTransaction = useMutation({
    mutationFn: async (tx: Omit<Transaction, "_id">) => {
      const res = await api.post("/transactions/create", tx);
      console.log(res.data)
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });

  const updateTransaction = useMutation({
    mutationFn: async (tx: Transaction) => {
      const res = await api.put(`/transactions/update/${tx._id}`, tx);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/transactions/delete/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    ...rest,
  };
};
