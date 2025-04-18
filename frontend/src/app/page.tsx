"use client";

import { useState, useMemo } from "react";
import { useTransactions } from "@/lib/hooks/useTransactions";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Particles from "@/components/ui/Particles";
import Navbar from "@/components/Navbar";

const CATEGORIES = [
  "Food",
  "Transport",
  "Utilities",
  "Entertainment",
  "Health",
  "Other",
];

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#8dd1e1",
  "#a4de6c",
];

function getMonthName(dateStr: string) {
  return new Date(dateStr).toLocaleString("default", { month: "short" });
}

export default function Dashboard() {
  const { transactions } = useTransactions();
  const [selectedCategory, setSelectedCategory] = useState<string>("Food");

  const { monthlyTotals, categoryTotals, totalExpenses } = useMemo(() => {
    const monthly: Record<string, number> = {};
    const category: Record<string, number> = {};
    let total = 0;

    transactions.forEach((item) => {
      const month = getMonthName(item.date);
      monthly[month] = (monthly[month] || 0) + item.amount;

      if (CATEGORIES.includes(item.category)) {
        category[item.category] = (category[item.category] || 0) + item.amount;
      }

      total += item.amount;
    });

    return {
      monthlyTotals: monthly,
      categoryTotals: category,
      totalExpenses: total,
    };
  }, [transactions]);

  const barData = Object.entries(monthlyTotals).map(([month, total]) => ({
    month,
    total,
  }));

  const pieData = CATEGORIES.map((cat) => ({
    name: cat,
    value: categoryTotals[cat] || 0,
  }));

  const filteredCategoryAmount = categoryTotals[selectedCategory] || 0;

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black text-white">
      <Navbar />
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <div className="relative z-10 p-6 space-y-8 pt-24">
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-sky-200  ">
            <CardHeader>
              <CardTitle>Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                ₹ {totalExpenses.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-sky-200  ">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedCategory} Expenses</CardTitle>
                <Select
                  onValueChange={(val) => setSelectedCategory(val)}
                  defaultValue={selectedCategory}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                ₹ {filteredCategoryAmount.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="w-full h-96">
            <h2 className="text-xl mb-2 font-medium">Monthly Expenses</h2>
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

          {/* Pie Chart */}
          <div className="w-full h-96">
            <h2 className="text-xl font-medium mb-4">Category Stats</h2>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
