import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Expense } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export function MonthlyTrendsChart() {
  const { data: expenses = [], isLoading } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });

  const monthlyData = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const monthYear = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    
    if (!acc[monthYear]) {
      acc[monthYear] = { month: monthYear, amount: 0 };
    }
    acc[monthYear].amount += expense.amount;
    
    return acc;
  }, {} as Record<string, { month: string; amount: number }>);

  const chartData = Object.values(monthlyData)
    .sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(-6);

  if (isLoading) {
    return <Skeleton className="h-80 w-full" />;
  }

  if (chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        <p>No data available. Start adding expenses to see trends.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="month"
          className="text-xs"
          tick={{ fill: "hsl(var(--muted-foreground))" }}
        />
        <YAxis
          className="text-xs"
          tick={{ fill: "hsl(var(--muted-foreground))" }}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.375rem",
          }}
          formatter={(value: number) => [`₹${value.toFixed(2)}`, "Amount"]}
        />
        <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
