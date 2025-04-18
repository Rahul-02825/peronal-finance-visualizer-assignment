"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Particles from "@/components/ui/Particles";
import { useTransactions } from "@/lib/hooks/useTransactions"; // Assuming you have a hook for transactions
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";

const CATEGORIES = ["Food", "Transport", "Utilities", "Entertainment", "Health", "Other"];

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Record<string, number>>({
    Food: 5000,
    Transport: 2000,
    Utilities: 3000,
    Entertainment: 2500,
    Health: 1500,
    Other: 1000,
  });

  const { transactions } = useTransactions(); // Assuming this hook gives you the transactions

  // Calculate total expenses per category
  const categoryExpenses = useMemo(() => {
    const expenses: Record<string, number> = {};

    transactions.forEach((item) => {
      if (CATEGORIES.includes(item.category)) {
        expenses[item.category] = (expenses[item.category] || 0) + item.amount;
      }
    });

    return expenses;
  }, [transactions]);

  // Calculate total expenses per month
  const monthlyExpenses = useMemo(() => {
    const expenses: Record<string, number> = {};

    transactions.forEach((item) => {
      const month = new Date(item.date).toLocaleString("default", { month: "long", year: "numeric" });
      expenses[month] = (expenses[month] || 0) + item.amount;
    });

    return expenses;
  }, [transactions]);

  const handleChange = (category: string, value: number) => {
    setBudgets((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleReset = () => {
    setBudgets({
      Food: 5000,
      Transport: 2000,
      Utilities: 3000,
      Entertainment: 2500,
      Health: 1500,
      Other: 1000,
    });
  };

  const budgetVsExpenseData = CATEGORIES.map((category) => ({
    category,
    budget: budgets[category],
    expense: categoryExpenses[category] || 0,
  }));

  const monthlyExpenseData = Object.entries(monthlyExpenses).map(([month, expense]) => ({
    month,
    expense,
  }));

  const pieChartData = CATEGORIES.map((category) => ({
    category,
    expense: categoryExpenses[category] || 0,
  }));

  return (
    <div className="relative min-h-screen w-full bg-black text-white">
      <Navbar />
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

      <div className="relative z-10 pt-24 px-6 space-y-15">
        <h1 className="text-3xl font-bold mb-6">Manage Category Budgets</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <Card key={cat} className="bg-black">
              <CardHeader>
                <CardTitle className="text-white">{cat}</CardTitle>
              </CardHeader>
              <CardContent>
                <label className="block text-sm mb-2 text-white border-amber-100">Monthly Budget (₹):</label>
                <input
                  type="number"
                  value={budgets[cat]}
                  onChange={(e) => handleChange(cat, +e.target.value)}
                  className="w-full bg-black  border-black text-white borderrounded px-3 py-2"
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={handleReset}>
            Reset to Default
          </Button>
          <Button variant="default" onClick={() => alert("Budgets Saved!")}>
            Save Budgets
          </Button>
        </div>

        {/* Budget vs Expense Chart */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Budget vs Expense</h2>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetVsExpenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="budget" fill="#82ca9d" />
                <Bar dataKey="expense" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Expense Bar Chart */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Monthly Expense</h2>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyExpenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="expense" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category-wise Expense Pie Chart */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Category-wise Expense Distribution</h2>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="expense"
                  nameKey="category"
                  outerRadius={150}
                  fill="#8884d8"
                  label
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#82ca9d", "#8884d8", "#a4de6c", "#d0ed57", "#f4a261", "#e76f51"][index]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Budget Summary</h2>
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <table className="w-full text-left table-auto">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-2 border-r border-gray-700">Category</th>
                  <th className="px-4 py-2">Budget (₹)</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.map((cat) => (
                  <tr key={cat} className="border-t border-gray-700">
                    <td className="px-4 py-2 border-r border-gray-700">{cat}</td>
                    <td className="px-4 py-2">{budgets[cat]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>  
  );
}
