import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { Expense } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function CategoryPieChart() {
  const { data: expenses = [], isLoading } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });

  const categoryData = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = { name: expense.category, value: 0 };
    }
    acc[expense.category].value += expense.amount;
    return acc;
  }, {} as Record<string, { name: string; value: number }>);

  const chartData = Object.values(categoryData).sort((a, b) => b.value - a.value);

  if (isLoading) {
    return <Skeleton className="h-80 w-full" />;
  }

  if (chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        <p>No data available. Start adding expenses to see category breakdown.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.375rem",
          }}
          formatter={(value: number) => `₹${value.toFixed(2)}`}
        />
        <Legend
          wrapperStyle={{
            fontSize: "0.875rem",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
