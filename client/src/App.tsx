import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthGuard } from "@/components/auth-provider";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Expenses from "@/pages/expenses";
import Analytics from "@/pages/analytics";
import Budgets from "@/pages/budgets";
import NotFound from "@/pages/not-found";

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between px-4 py-2 border-b bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
          </header>
          <main className="flex-1 overflow-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      <Route path="/dashboard">
        <AuthenticatedLayout>
          <Dashboard />
        </AuthenticatedLayout>
      </Route>
      
      <Route path="/expenses">
        <AuthenticatedLayout>
          <Expenses />
        </AuthenticatedLayout>
      </Route>
      
      <Route path="/analytics">
        <AuthenticatedLayout>
          <Analytics />
        </AuthenticatedLayout>
      </Route>
      
      <Route path="/budgets">
        <AuthenticatedLayout>
          <Budgets />
        </AuthenticatedLayout>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthGuard>
          <Toaster />
          <Router />
        </AuthGuard>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
