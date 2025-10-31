import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import type { Budget } from "@shared/schema";
import { BudgetDialog } from "@/components/budget-dialog";
import { BudgetList } from "@/components/budget-list";

export default function Budgets() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const { data: budgets, isLoading } = useQuery<Budget[]>({
    queryKey: ["/api/budgets"],
  });

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBudget(null);
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Budgets</h1>
          <p className="text-muted-foreground">
            Set and manage your monthly budgets by category
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} data-testid="button-add-budget">
          <Plus className="w-4 h-4 mr-2" />
          Add Budget
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Budgets</CardTitle>
        </CardHeader>
        <CardContent>
          <BudgetList
            budgets={budgets || []}
            isLoading={isLoading}
            onEdit={handleEdit}
          />
        </CardContent>
      </Card>

      <BudgetDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        budget={editingBudget}
      />
    </div>
  );
}
