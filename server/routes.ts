import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { authenticateToken, generateToken, type AuthRequest } from "./middleware/auth";
import {
  registerSchema,
  loginSchema,
  insertExpenseSchema,
  insertBudgetSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      const token = generateToken(user.id);
      
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword, token });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = generateToken(user.id);
      
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/me", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/expenses", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const expenses = await storage.getExpenses(req.userId!);
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });

  app.get("/api/expenses/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const expense = await storage.getExpense(req.params.id, req.userId!);
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.json(expense);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expense" });
    }
  });

  app.post("/api/expenses", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense({
        ...validatedData,
        userId: req.userId!,
      });
      res.status(201).json(expense);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create expense" });
    }
  });

  app.put("/api/expenses/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertExpenseSchema.partial().parse(req.body);
      const expense = await storage.updateExpense(req.params.id, req.userId!, validatedData);
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.json(expense);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update expense" });
    }
  });

  app.delete("/api/expenses/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const deleted = await storage.deleteExpense(req.params.id, req.userId!);
      if (!deleted) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.json({ message: "Expense deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete expense" });
    }
  });

  app.get("/api/expenses/stats/summary", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const expenses = await storage.getExpenses(req.userId!);
      
      const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const totalExpenses = expenses.length;
      
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const monthlyExpenses = expenses.filter(expense => {
        const date = new Date(expense.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });
      
      const monthlySpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const averageDaily = monthlySpent / daysInMonth;
      
      const categoryBreakdown = expenses.reduce((acc, expense) => {
        if (!acc[expense.category]) {
          acc[expense.category] = 0;
        }
        acc[expense.category] += expense.amount;
        return acc;
      }, {} as Record<string, number>);

      const categoryBreakdownArray = Object.entries(categoryBreakdown).map(([category, amount]) => ({
        category,
        amount,
      }));

      res.json({
        totalSpent,
        monthlySpent,
        totalExpenses,
        averageDaily,
        categoryBreakdown: categoryBreakdownArray,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  app.get("/api/analytics/summary", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const expenses = await storage.getExpenses(req.userId!);
      
      const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const averageExpense = expenses.length > 0 ? totalSpent / expenses.length : 0;
      
      const categoryTotals = expenses.reduce((acc, expense) => {
        if (!acc[expense.category]) {
          acc[expense.category] = 0;
        }
        acc[expense.category] += expense.amount;
        return acc;
      }, {} as Record<string, number>);

      const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

      res.json({
        totalSpent,
        averageExpense,
        topCategory,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get("/api/budgets", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const budgets = await storage.getBudgets(req.userId!);
      res.json(budgets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch budgets" });
    }
  });

  app.get("/api/budgets/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const budget = await storage.getBudget(req.params.id, req.userId!);
      if (!budget) {
        return res.status(404).json({ message: "Budget not found" });
      }
      res.json(budget);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch budget" });
    }
  });

  app.post("/api/budgets", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertBudgetSchema.parse(req.body);
      const budget = await storage.createBudget({
        ...validatedData,
        userId: req.userId!,
      });
      res.status(201).json(budget);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create budget" });
    }
  });

  app.put("/api/budgets/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertBudgetSchema.partial().parse(req.body);
      const budget = await storage.updateBudget(req.params.id, req.userId!, validatedData);
      if (!budget) {
        return res.status(404).json({ message: "Budget not found" });
      }
      res.json(budget);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update budget" });
    }
  });

  app.delete("/api/budgets/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const deleted = await storage.deleteBudget(req.params.id, req.userId!);
      if (!deleted) {
        return res.status(404).json({ message: "Budget not found" });
      }
      res.json({ message: "Budget deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete budget" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
