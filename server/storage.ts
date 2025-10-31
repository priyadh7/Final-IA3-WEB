import {
  type User,
  type InsertUser,
  type Expense,
  type InsertExpense,
  type Budget,
  type InsertBudget,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getExpenses(userId: string): Promise<Expense[]>;
  getExpense(id: string, userId: string): Promise<Expense | undefined>;
  createExpense(expense: InsertExpense & { userId: string }): Promise<Expense>;
  updateExpense(id: string, userId: string, expense: Partial<InsertExpense>): Promise<Expense | undefined>;
  deleteExpense(id: string, userId: string): Promise<boolean>;

  getBudgets(userId: string): Promise<Budget[]>;
  getBudget(id: string, userId: string): Promise<Budget | undefined>;
  createBudget(budget: InsertBudget & { userId: string }): Promise<Budget>;
  updateBudget(id: string, userId: string, budget: Partial<InsertBudget>): Promise<Budget | undefined>;
  deleteBudget(id: string, userId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private expenses: Map<string, Expense>;
  private budgets: Map<string, Budget>;

  constructor() {
    this.users = new Map();
    this.expenses = new Map();
    this.budgets = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async getExpenses(userId: string): Promise<Expense[]> {
    return Array.from(this.expenses.values())
      .filter((expense) => expense.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getExpense(id: string, userId: string): Promise<Expense | undefined> {
    const expense = this.expenses.get(id);
    if (expense && expense.userId === userId) {
      return expense;
    }
    return undefined;
  }

  async createExpense(expenseData: InsertExpense & { userId: string }): Promise<Expense> {
    const id = randomUUID();
    const expense: Expense = {
      id,
      ...expenseData,
      createdAt: new Date(),
    };
    this.expenses.set(id, expense);
    return expense;
  }

  async updateExpense(
    id: string,
    userId: string,
    expenseData: Partial<InsertExpense>
  ): Promise<Expense | undefined> {
    const expense = await this.getExpense(id, userId);
    if (!expense) {
      return undefined;
    }

    const updated: Expense = {
      ...expense,
      ...expenseData,
    };
    this.expenses.set(id, updated);
    return updated;
  }

  async deleteExpense(id: string, userId: string): Promise<boolean> {
    const expense = await this.getExpense(id, userId);
    if (!expense) {
      return false;
    }
    return this.expenses.delete(id);
  }

  async getBudgets(userId: string): Promise<Budget[]> {
    return Array.from(this.budgets.values())
      .filter((budget) => budget.userId === userId)
      .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime());
  }

  async getBudget(id: string, userId: string): Promise<Budget | undefined> {
    const budget = this.budgets.get(id);
    if (budget && budget.userId === userId) {
      return budget;
    }
    return undefined;
  }

  async createBudget(budgetData: InsertBudget & { userId: string }): Promise<Budget> {
    const id = randomUUID();
    const budget: Budget = {
      id,
      ...budgetData,
      createdAt: new Date(),
    };
    this.budgets.set(id, budget);
    return budget;
  }

  async updateBudget(
    id: string,
    userId: string,
    budgetData: Partial<InsertBudget>
  ): Promise<Budget | undefined> {
    const budget = await this.getBudget(id, userId);
    if (!budget) {
      return undefined;
    }

    const updated: Budget = {
      ...budget,
      ...budgetData,
    };
    this.budgets.set(id, updated);
    return updated;
  }

  async deleteBudget(id: string, userId: string): Promise<boolean> {
    const budget = await this.getBudget(id, userId);
    if (!budget) {
      return false;
    }
    return this.budgets.delete(id);
  }
}

import { MongoStorage } from "./mongoStorage";

// Use MongoDB storage
const mongoStorage = new MongoStorage();
mongoStorage.connect().catch(console.error);

export const storage = mongoStorage;

// Fallback to MemStorage if needed
// export const storage = new MemStorage();
