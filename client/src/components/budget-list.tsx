import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import type { Budget } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import type { Expense } from "@shared/schema";

interface BudgetListProps {
  budgets: Budget[];
  isLoading: boolean;
  onEdit: (budget: Budget) => void;
}

export function BudgetList({ budgets, isLoading, onEdit }: BudgetListProps) {
  const { toast } = useToast();

  const { data: expenses = [] } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/budgets/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      toast({
        title: "Budget deleted",
        description: "The budget has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete budget",
        variant: "destructive",
      });
    },
  });

  const calculateSpent = (budget: Budget) => {
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
    return spent;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No budgets set yet. Add your first budget to start tracking!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {budgets.map((budget) => {
        const spent = calculateSpent(budget);
        const percentage = (spent / budget.amount) * 100;
        const isOverBudget = spent > budget.amount;

        return (
          <div
            key={budget.id}
            className="border rounded-lg p-4 space-y-3"
            data-testid={`budget-${budget.id}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{budget.category}</h3>
                  <Badge variant={isOverBudget ? "destructive" : "secondary"}>
                    {format(new Date(budget.month), "MMM yyyy")}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Budget: <span className="font-mono font-semibold">₹{budget.amount.toFixed(2)}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(budget)}
                  data-testid={`button-edit-${budget.id}`}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMutation.mutate(budget.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-${budget.id}`}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-mono font-semibold" data-testid={`text-spent-${budget.id}`}>
                  ₹{spent.toFixed(2)} spent
                </span>
                <span className={isOverBudget ? "text-destructive font-semibold" : "text-muted-foreground"}>
                  {percentage.toFixed(0)}%
                </span>
              </div>
              <Progress
                value={Math.min(percentage, 100)}
                className={isOverBudget ? "bg-destructive/20" : ""}
              />
              <p className="text-xs text-muted-foreground">
                {isOverBudget
                  ? `₹${(spent - budget.amount).toFixed(2)} over budget`
                  : `₹${(budget.amount - spent).toFixed(2)} remaining`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
