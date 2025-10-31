import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertExpenseSchema, type InsertExpense, type Expense, categories } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  expense?: Expense | null;
}

export function ExpenseDialog({ open, onClose, expense }: ExpenseDialogProps) {
  const { toast } = useToast();
  const isEditing = !!expense;

  const form = useForm<InsertExpense>({
    resolver: zodResolver(insertExpenseSchema),
    defaultValues: {
      title: "",
      amount: 0,
      category: "Other",
      description: "",
      date: new Date(),
      tags: [],
    },
  });

  useEffect(() => {
    if (expense) {
      form.reset({
        title: expense.title,
        amount: expense.amount,
        category: expense.category as any,
        description: expense.description || "",
        date: new Date(expense.date),
        tags: expense.tags || [],
      });
    } else {
      form.reset({
        title: "",
        amount: 0,
        category: "Other",
        description: "",
        date: new Date(),
        tags: [],
      });
    }
  }, [expense, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: InsertExpense) => {
      if (isEditing) {
        return await apiRequest("PUT", `/api/expenses/${expense.id}`, data);
      } else {
        return await apiRequest("POST", "/api/expenses", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/expenses/stats/summary"] });
      toast({
        title: isEditing ? "Expense updated" : "Expense added",
        description: isEditing
          ? "Your expense has been updated successfully."
          : "Your expense has been added successfully.",
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} expense`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertExpense) => {
    saveMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Expense" : "Add New Expense"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the expense details below." : "Fill in the details for your new expense."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Grocery shopping" data-testid="input-title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
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
            </div>

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      data-testid="input-date"
                      value={format(field.value, "yyyy-MM-dd")}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add additional details..."
                      className="resize-none"
                      rows={3}
                      data-testid="input-description"
                      {...field}
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
                {saveMutation.isPending ? "Saving..." : isEditing ? "Update" : "Add Expense"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
