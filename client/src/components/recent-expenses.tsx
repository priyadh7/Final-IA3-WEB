import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { Expense } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const categoryColors: Record<string, string> = {
  Food: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  Transport: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  Entertainment: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  Utilities: "bg-green-500/10 text-green-700 dark:text-green-400",
  Healthcare: "bg-red-500/10 text-red-700 dark:text-red-400",
  Other: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
};

interface RecentExpensesProps {
  expenses: Expense[];
  isLoading: boolean;
}

export function RecentExpenses({ expenses, isLoading }: RecentExpensesProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded-md">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No expenses yet. Add your first expense to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="flex items-center justify-between p-3 border rounded-md hover-elevate"
          data-testid={`expense-${expense.id}`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium truncate">{expense.title}</p>
              <Badge variant="secondary" className={categoryColors[expense.category]}>
                {expense.category}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {format(new Date(expense.date), "MMM dd, yyyy")}
            </p>
          </div>
          <div className="font-mono font-semibold text-lg ml-4">
            ₹{expense.amount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
