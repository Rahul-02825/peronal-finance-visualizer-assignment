"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/transaction";

function getMonthName(dateStr: string) {
  return new Date(dateStr).toLocaleString("default", { month: "short" });
}

export default function ExpenseChart({ transactions }: { transactions: Transaction[] }) {
  const monthlyTotals: Record<string, number> = {};

  transactions.forEach((tx) => {
    const month = getMonthName(tx.date);
    monthlyTotals[month] = (monthlyTotals[month] || 0) + tx.amount;
  });

  const data = Object.entries(monthlyTotals).map(([month, total]) => ({
    month,
    total,
  }));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-purple-600 text-white">
          Show Stats
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Monthly Expense Stats</DialogTitle>
        </DialogHeader>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
