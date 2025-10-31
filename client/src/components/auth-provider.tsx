import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { User } from "@shared/schema";
import { useEffect } from "react";

const protectedPaths = ["/dashboard", "/expenses", "/analytics", "/budgets"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  useEffect(() => {
    const isProtectedPath = protectedPaths.some(path => location.startsWith(path));
    
    if (!isLoading && !user && isProtectedPath) {
      setLocation("/login");
    }
  }, [user, isLoading, location, setLocation]);

  const isProtectedPath = protectedPaths.some(path => location.startsWith(path));

  if (isProtectedPath && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isProtectedPath && !user) {
    return null;
  }

  return <>{children}</>;
}
