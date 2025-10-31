import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, IndianRupee, Receipt, Target } from "lucide-react";
import type { Expense } from "@shared/schema";
import { MonthlyTrendsChart } from "@/components/charts/monthly-trends-chart";
import { CategoryPieChart } from "@/components/charts/category-pie-chart";
import { RecentExpenses } from "@/components/recent-expenses";
import { Skeleton } from "@/components/ui/skeleton";

interface ExpenseStats {
  totalSpent: number;
  monthlySpent: number;
  totalExpenses: number;
  averageDaily: number;
  categoryBreakdown: { category: string; amount: number }[];
}

export default function Dashboard() {
  const { data: expenses, isLoading: expensesLoading } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<ExpenseStats>({
    queryKey: ["/api/expenses/stats/summary"],
  });

  const isLoading = expensesLoading || statsLoading;

  const recentExpenses = expenses?.slice(0, 5) || [];

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your expenses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold font-mono" data-testid="text-total-spent">
                  ₹{stats?.totalSpent.toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold font-mono" data-testid="text-monthly-spent">
                  ₹{stats?.monthlySpent.toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Current month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold font-mono" data-testid="text-total-expenses">
                  {stats?.totalExpenses || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Transactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold font-mono" data-testid="text-daily-average">
                  ₹{stats?.averageDaily.toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Per day</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyTrendsChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryPieChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentExpenses expenses={recentExpenses} isLoading={expensesLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
