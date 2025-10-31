import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertBudgetSchema, type InsertBudget, type Budget, categories } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface BudgetDialogProps {
  open: boolean;
  onClose: () => void;
  budget?: Budget | null;
}

export function BudgetDialog({ open, onClose, budget }: BudgetDialogProps) {
  const { toast } = useToast();
  const isEditing = !!budget;

  const form = useForm<InsertBudget>({
    resolver: zodResolver(insertBudgetSchema),
    defaultValues: {
      category: "Other",
      amount: 0,
      month: new Date(),
    },
  });

  useEffect(() => {
    if (budget) {
      form.reset({
        category: budget.category as any,
        amount: budget.amount,
        month: new Date(budget.month),
      });
    } else {
      form.reset({
        category: "Other",
        amount: 0,
        month: new Date(),
      });
    }
  }, [budget, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: InsertBudget) => {
      if (isEditing) {
        return await apiRequest("PUT", `/api/budgets/${budget.id}`, data);
      } else {
        return await apiRequest("POST", "/api/budgets", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      toast({
        title: isEditing ? "Budget updated" : "Budget added",
        description: isEditing
          ? "Your budget has been updated successfully."
          : "Your budget has been added successfully.",
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} budget`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBudget) => {
    saveMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Budget" : "Add New Budget"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the budget details below." : "Set a monthly budget for a category."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Budget Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="500.00"
                      data-testid="input-amount"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Month</FormLabel>
                  <FormControl>
                    <Input
                      type="month"
                      data-testid="input-month"
                      value={format(field.value, "yyyy-MM")}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
                Cancel
              </Button>
              <Button type="submit" disabled={saveMutation.isPending} data-testid="button-save">
                {saveMutation.isPending ? "Saving..." : isEditing ? "Update" : "Add Budget"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
