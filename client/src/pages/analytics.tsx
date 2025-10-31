import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MonthlyTrendsChart } from "@/components/charts/monthly-trends-chart";
import { CategoryPieChart } from "@/components/charts/category-pie-chart";
import { BudgetComparisonChart } from "@/components/charts/budget-comparison-chart";
import { TrendingUp, PieChart, Target } from "lucide-react";

interface AnalyticsData {
  totalSpent: number;
  topCategory: string;
  averageExpense: number;
}

export default function Analytics() {
  const { data: analytics } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics/summary"],
  });

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">
          Gain insights into your spending patterns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              ₹{analytics?.averageExpense.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.topCategory || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Most spending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analyzed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              ₹{analytics?.totalSpent.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending Trends</CardTitle>
          <CardDescription>
            Track your spending patterns over the past 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MonthlyTrendsChart />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>
              See where your money goes by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryPieChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget vs Actual</CardTitle>
            <CardDescription>
              Compare your spending against budgets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetComparisonChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
