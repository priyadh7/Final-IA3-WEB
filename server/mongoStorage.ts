import { MongoClient, Db, ObjectId } from "mongodb";
import {
  type User,
  type InsertUser,
  type Expense,
  type InsertExpense,
  type Budget,
  type InsertBudget,
} from "@shared/schema";
import { type IStorage } from "./storage";

export class MongoStorage implements IStorage {
  private client: MongoClient;
  private db: Db | null = null;

  constructor(uri: string = process.env.MONGODB_URI || "mongodb://localhost:27017/wealthwatch") {
    this.client = new MongoClient(uri);
  }

  async connect(): Promise<void> {
    await this.client.connect();
    this.db = this.client.db();
    console.log("Connected to MongoDB");
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  private getDb(): Db {
    if (!this.db) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.db;
  }

  // User CRUD operations
  async getUser(id: string): Promise<User | undefined> {
    const db = this.getDb();
    const user = await db.collection("users").findOne({ id });
    if (!user) return undefined;
    return this.mapToUser(user);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const db = this.getDb();
    const user = await db.collection("users").findOne({ email });
    if (!user) return undefined;
    return this.mapToUser(user);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const db = this.getDb();
    const user: User = {
      id: new ObjectId().toString(),
      ...insertUser,
      createdAt: new Date(),
    };
    await db.collection("users").insertOne(user);
    return user;
  }

  // Expense CRUD operations
  async getExpenses(userId: string): Promise<Expense[]> {
    const db = this.getDb();
    const expenses = await db
      .collection("expenses")
      .find({ userId })
      .sort({ date: -1 })
      .toArray();
    return expenses.map(this.mapToExpense);
  }

  async getExpense(id: string, userId: string): Promise<Expense | undefined> {
    const db = this.getDb();
    const expense = await db.collection("expenses").findOne({ id, userId });
    if (!expense) return undefined;
    return this.mapToExpense(expense);
  }

  async createExpense(expenseData: InsertExpense & { userId: string }): Promise<Expense> {
    const db = this.getDb();
    const expense: Expense = {
      id: new ObjectId().toString(),
      ...expenseData,
      createdAt: new Date(),
    };
    await db.collection("expenses").insertOne(expense);
    return expense;
  }

  async updateExpense(
    id: string,
    userId: string,
    expenseData: Partial<InsertExpense>
  ): Promise<Expense | undefined> {
    const db = this.getDb();
    const result = await db.collection("expenses").findOneAndUpdate(
      { id, userId },
      { $set: expenseData },
      { returnDocument: "after" }
    );
    if (!result) return undefined;
    return this.mapToExpense(result);
  }

  async deleteExpense(id: string, userId: string): Promise<boolean> {
    const db = this.getDb();
    const result = await db.collection("expenses").deleteOne({ id, userId });
    return result.deletedCount === 1;
  }

  // Budget CRUD operations
  async getBudgets(userId: string): Promise<Budget[]> {
    const db = this.getDb();
    const budgets = await db
      .collection("budgets")
      .find({ userId })
      .sort({ month: -1 })
      .toArray();
    return budgets.map(this.mapToBudget);
  }

  async getBudget(id: string, userId: string): Promise<Budget | undefined> {
    const db = this.getDb();
    const budget = await db.collection("budgets").findOne({ id, userId });
    if (!budget) return undefined;
    return this.mapToBudget(budget);
  }

  async createBudget(budgetData: InsertBudget & { userId: string }): Promise<Budget> {
    const db = this.getDb();
    const budget: Budget = {
      id: new ObjectId().toString(),
      ...budgetData,
      createdAt: new Date(),
    };
    await db.collection("budgets").insertOne(budget);
    return budget;
  }

  async updateBudget(
    id: string,
    userId: string,
    budgetData: Partial<InsertBudget>
  ): Promise<Budget | undefined> {
    const db = this.getDb();
    const result = await db.collection("budgets").findOneAndUpdate(
      { id, userId },
      { $set: budgetData },
      { returnDocument: "after" }
    );
    if (!result) return undefined;
    return this.mapToBudget(result);
  }

  async deleteBudget(id: string, userId: string): Promise<boolean> {
    const db = this.getDb();
    const result = await db.collection("budgets").deleteOne({ id, userId });
    return result.deletedCount === 1;
  }

  // Helper methods to map MongoDB documents to typed objects
  private mapToUser(doc: any): User {
    return {
      id: doc.id,
      email: doc.email,
      password: doc.password,
      name: doc.name,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt),
    };
  }

  private mapToExpense(doc: any): Expense {
    return {
      id: doc.id,
      userId: doc.userId,
      amount: doc.amount,
      category: doc.category,
      description: doc.description,
      date: doc.date instanceof Date ? doc.date : new Date(doc.date),
      createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt),
    };
  }

  private mapToBudget(doc: any): Budget {
    return {
      id: doc.id,
      userId: doc.userId,
      category: doc.category,
      amount: doc.amount,
      month: doc.month instanceof Date ? doc.month : new Date(doc.month),
      createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt),
    };
  }
}
