// server/index.ts
import "dotenv/config";
import express2 from "express";
import cookieParser from "cookie-parser";

// server/routes.ts
import { createServer } from "http";

// server/mongoStorage.ts
import { MongoClient, ObjectId } from "mongodb";
var MongoStorage = class {
  client;
  db = null;
  constructor(uri = process.env.MONGODB_URI || "mongodb://localhost:27017/wealthwatch") {
    this.client = new MongoClient(uri);
  }
  async connect() {
    await this.client.connect();
    this.db = this.client.db();
    console.log("Connected to MongoDB");
  }
  async disconnect() {
    await this.client.close();
  }
  getDb() {
    if (!this.db) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.db;
  }
  // User CRUD operations
  async getUser(id) {
    const db = this.getDb();
    const user = await db.collection("users").findOne({ id });
    if (!user) return void 0;
    return this.mapToUser(user);
  }
  async getUserByEmail(email) {
    const db = this.getDb();
    const user = await db.collection("users").findOne({ email });
    if (!user) return void 0;
    return this.mapToUser(user);
  }
  async createUser(insertUser) {
    const db = this.getDb();
    const user = {
      id: new ObjectId().toString(),
      ...insertUser,
      createdAt: /* @__PURE__ */ new Date()
    };
    await db.collection("users").insertOne(user);
    return user;
  }
  // Expense CRUD operations
  async getExpenses(userId) {
    const db = this.getDb();
    const expenses2 = await db.collection("expenses").find({ userId }).sort({ date: -1 }).toArray();
    return expenses2.map(this.mapToExpense);
  }
  async getExpense(id, userId) {
    const db = this.getDb();
    const expense = await db.collection("expenses").findOne({ id, userId });
    if (!expense) return void 0;
    return this.mapToExpense(expense);
  }
  async createExpense(expenseData) {
    const db = this.getDb();
    const expense = {
      id: new ObjectId().toString(),
      ...expenseData,
      createdAt: /* @__PURE__ */ new Date()
    };
    await db.collection("expenses").insertOne(expense);
    return expense;
  }
  async updateExpense(id, userId, expenseData) {
    const db = this.getDb();
    const result = await db.collection("expenses").findOneAndUpdate(
      { id, userId },
      { $set: expenseData },
      { returnDocument: "after" }
    );
    if (!result) return void 0;
    return this.mapToExpense(result);
  }
  async deleteExpense(id, userId) {
    const db = this.getDb();
    const result = await db.collection("expenses").deleteOne({ id, userId });
    return result.deletedCount === 1;
  }
  // Budget CRUD operations
  async getBudgets(userId) {
    const db = this.getDb();
    const budgets2 = await db.collection("budgets").find({ userId }).sort({ month: -1 }).toArray();
    return budgets2.map(this.mapToBudget);
  }
  async getBudget(id, userId) {
    const db = this.getDb();
    const budget = await db.collection("budgets").findOne({ id, userId });
    if (!budget) return void 0;
    return this.mapToBudget(budget);
  }
  async createBudget(budgetData) {
    const db = this.getDb();
    const budget = {
      id: new ObjectId().toString(),
      ...budgetData,
      createdAt: /* @__PURE__ */ new Date()
    };
    await db.collection("budgets").insertOne(budget);
    return budget;
  }
  async updateBudget(id, userId, budgetData) {
    const db = this.getDb();
    const result = await db.collection("budgets").findOneAndUpdate(
      { id, userId },
      { $set: budgetData },
      { returnDocument: "after" }
    );
    if (!result) return void 0;
    return this.mapToBudget(result);
  }
  async deleteBudget(id, userId) {
    const db = this.getDb();
    const result = await db.collection("budgets").deleteOne({ id, userId });
    return result.deletedCount === 1;
  }
  // Helper methods to map MongoDB documents to typed objects
  mapToUser(doc) {
    return {
      id: doc.id,
      email: doc.email,
      password: doc.password,
      name: doc.name,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt)
    };
  }
  mapToExpense(doc) {
    return {
      id: doc.id,
      userId: doc.userId,
      amount: doc.amount,
      category: doc.category,
      description: doc.description,
      date: doc.date instanceof Date ? doc.date : new Date(doc.date),
      createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt)
    };
  }
  mapToBudget(doc) {
    return {
      id: doc.id,
      userId: doc.userId,
      category: doc.category,
      amount: doc.amount,
      month: doc.month instanceof Date ? doc.month : new Date(doc.month),
      createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt)
    };
  }
};

// server/storage.ts
var mongoStorage = new MongoStorage();
mongoStorage.connect().catch(console.error);
var storage = mongoStorage;

// server/routes.ts
import bcrypt from "bcryptjs";

// server/middleware/auth.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
function authenticateToken(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}
function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var expenses = pgTable("expenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  amount: real("amount").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  date: timestamp("date").defaultNow().notNull(),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var budgets = pgTable("budgets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  category: text("category").notNull(),
  amount: real("amount").notNull(),
  month: timestamp("month").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var categories = [
  "Food",
  "Transport",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Other"
];
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
  createdAt: true,
  userId: true
}).extend({
  category: z.enum(categories),
  amount: z.number().min(0, "Amount must be positive"),
  title: z.string().min(1, "Title is required"),
  date: z.coerce.date(),
  tags: z.array(z.string()).optional()
});
var insertBudgetSchema = createInsertSchema(budgets).omit({
  id: true,
  createdAt: true,
  userId: true
}).extend({
  category: z.enum(categories),
  amount: z.number().min(0, "Amount must be positive"),
  month: z.coerce.date()
});
var loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});
var registerSchema = insertUserSchema.extend({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required")
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword
      });
      const token = generateToken(user.id);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1e3
      });
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword, token });
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Registration failed" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
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
        maxAge: 7 * 24 * 60 * 60 * 1e3
      });
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  });
  app2.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
      const user = await storage.getUser(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.get("/api/expenses", authenticateToken, async (req, res) => {
    try {
      const expenses2 = await storage.getExpenses(req.userId);
      res.json(expenses2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });
  app2.get("/api/expenses/:id", authenticateToken, async (req, res) => {
    try {
      const expense = await storage.getExpense(req.params.id, req.userId);
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.json(expense);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expense" });
    }
  });
  app2.post("/api/expenses", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense({
        ...validatedData,
        userId: req.userId
      });
      res.status(201).json(expense);
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create expense" });
    }
  });
  app2.put("/api/expenses/:id", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertExpenseSchema.partial().parse(req.body);
      const expense = await storage.updateExpense(req.params.id, req.userId, validatedData);
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.json(expense);
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update expense" });
    }
  });
  app2.delete("/api/expenses/:id", authenticateToken, async (req, res) => {
    try {
      const deleted = await storage.deleteExpense(req.params.id, req.userId);
      if (!deleted) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.json({ message: "Expense deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete expense" });
    }
  });
  app2.get("/api/expenses/stats/summary", authenticateToken, async (req, res) => {
    try {
      const expenses2 = await storage.getExpenses(req.userId);
      const totalSpent = expenses2.reduce((sum, expense) => sum + expense.amount, 0);
      const totalExpenses = expenses2.length;
      const now = /* @__PURE__ */ new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const monthlyExpenses = expenses2.filter((expense) => {
        const date = new Date(expense.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });
      const monthlySpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const averageDaily = monthlySpent / daysInMonth;
      const categoryBreakdown = expenses2.reduce((acc, expense) => {
        if (!acc[expense.category]) {
          acc[expense.category] = 0;
        }
        acc[expense.category] += expense.amount;
        return acc;
      }, {});
      const categoryBreakdownArray = Object.entries(categoryBreakdown).map(([category, amount]) => ({
        category,
        amount
      }));
      res.json({
        totalSpent,
        monthlySpent,
        totalExpenses,
        averageDaily,
        categoryBreakdown: categoryBreakdownArray
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });
  app2.get("/api/analytics/summary", authenticateToken, async (req, res) => {
    try {
      const expenses2 = await storage.getExpenses(req.userId);
      const totalSpent = expenses2.reduce((sum, expense) => sum + expense.amount, 0);
      const averageExpense = expenses2.length > 0 ? totalSpent / expenses2.length : 0;
      const categoryTotals = expenses2.reduce((acc, expense) => {
        if (!acc[expense.category]) {
          acc[expense.category] = 0;
        }
        acc[expense.category] += expense.amount;
        return acc;
      }, {});
      const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
      res.json({
        totalSpent,
        averageExpense,
        topCategory
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });
  app2.get("/api/budgets", authenticateToken, async (req, res) => {
    try {
      const budgets2 = await storage.getBudgets(req.userId);
      res.json(budgets2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch budgets" });
    }
  });
  app2.get("/api/budgets/:id", authenticateToken, async (req, res) => {
    try {
      const budget = await storage.getBudget(req.params.id, req.userId);
      if (!budget) {
        return res.status(404).json({ message: "Budget not found" });
      }
      res.json(budget);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch budget" });
    }
  });
  app2.post("/api/budgets", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertBudgetSchema.parse(req.body);
      const budget = await storage.createBudget({
        ...validatedData,
        userId: req.userId
      });
      res.status(201).json(budget);
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create budget" });
    }
  });
  app2.put("/api/budgets/:id", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertBudgetSchema.partial().parse(req.body);
      const budget = await storage.updateBudget(req.params.id, req.userId, validatedData);
      if (!budget) {
        return res.status(404).json({ message: "Budget not found" });
      }
      res.json(budget);
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update budget" });
    }
  });
  app2.delete("/api/budgets/:id", authenticateToken, async (req, res) => {
    try {
      const deleted = await storage.deleteBudget(req.params.id, req.userId);
      if (!deleted) {
        return res.status(404).json({ message: "Budget not found" });
      }
      res.json({ message: "Budget deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete budget" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express2.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5001", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
