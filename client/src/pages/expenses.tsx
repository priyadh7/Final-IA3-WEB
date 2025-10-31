import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import type { Expense } from "@shared/schema";
import { ExpenseTable } from "@/components/expense-table";
import { ExpenseDialog } from "@/components/expense-dialog";

export default function Expenses() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const { data: expenses, isLoading } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingExpense(null);
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Expenses</h1>
          <p className="text-muted-foreground">
            Manage and track all your expenses
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} data-testid="button-add-expense">
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseTable
            expenses={expenses || []}
            isLoading={isLoading}
            onEdit={handleEdit}
          />
        </CardContent>
      </Card>

      <ExpenseDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        expense={editingExpense}
      />
    </div>
  );
}
