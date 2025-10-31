import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { Budget, Expense } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export function BudgetComparisonChart() {
  const { data: budgets = [], isLoading: budgetsLoading } = useQuery<Budget[]>({
    queryKey: ["/api/budgets"],
  });

  const { data: expenses = [], isLoading: expensesLoading } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });

  const isLoading = budgetsLoading || expensesLoading;

  const chartData = budgets.map((budget) => {
    const budgetMonth = new Date(budget.month);
    const spent = expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expense.category === budget.category &&
          expenseDate.getMonth() === budgetMonth.getMonth() &&
          expenseDate.getFullYear() === budgetMonth.getFullYear()
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      category: budget.category,
      budget: budget.amount,
      spent: spent,
    };
  });

  if (isLoading) {
    return <Skeleton className="h-80 w-full" />;
  }

  if (chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        <p>No budgets set. Add budgets to see comparison.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="category"
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
          formatter={(value: number) => `₹${value.toFixed(2)}`}
        />
        <Legend />
        <Bar dataKey="budget" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="spent" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
