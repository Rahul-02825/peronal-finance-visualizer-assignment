"use client";

import { useState } from "react";
import { useTransactions } from "@/lib/hooks/useTransactions";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const CATEGORIES = ["Food", "Transport", "Utilities", "Entertainment", "Health", "Other"];
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1", "#a4de6c"];

function getMonthName(dateStr: string) {
  return new Date(dateStr).toLocaleString("default", { month: "short" });
}

export default function Dashboard() {
  const { transactions } = useTransactions();
  const [selectedCategory, setSelectedCategory] = useState<string>("Food");

  const monthlyTotals: Record<string, number> = {};
  const categoryTotals: Record<string, number> = {};

  transactions.forEach((tx) => {
    const month = getMonthName(tx.date);
    monthlyTotals[month] = (monthlyTotals[month] || 0) + tx.amount;

    if (CATEGORIES.includes(tx.category)) {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
    }
  });

  const barData = Object.entries(monthlyTotals).map(([month, total]) => ({
    month,
    total,
  }));

  const pieData = CATEGORIES.map((cat) => ({
    name: cat,
    value: categoryTotals[cat] || 0,
  }));

  const filteredPieData = pieData.filter((item) => item.name === selectedCategory);

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Monthly Expense Bar Chart */}
      <div className="w-full h-96">
        <h2 className="text-xl mb-2">Monthly Expenses</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart for Selected Category */}
      <div className="w-full h-96 space-y-4">
        <h2 className="text-xl">Category Stats</h2>
        <Select onValueChange={(val) => setSelectedCategory(val)} defaultValue="Food">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={filteredPieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {filteredPieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[CATEGORIES.indexOf(entry.name)]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
