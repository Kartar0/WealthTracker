import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const netWorthCalculations = pgTable("net_worth_calculations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  currency: text("currency").notNull().default("USD"),
  assets: json("assets").notNull(),
  liabilities: json("liabilities").notNull(),
  totalAssets: real("total_assets").notNull().default(0),
  totalLiabilities: real("total_liabilities").notNull().default(0),
  netWorth: real("net_worth").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Asset categories schema
export const assetsSchema = z.object({
  // Cash & Bank Accounts
  checking: z.number().min(0).default(0),
  savings: z.number().min(0).default(0),
  cash: z.number().min(0).default(0),
  
  // Real Estate
  primaryHome: z.number().min(0).default(0),
  rentalProperty: z.number().min(0).default(0),
  otherRealEstate: z.number().min(0).default(0),
  
  // Investments
  stocks: z.number().min(0).default(0),
  retirement: z.number().min(0).default(0),
  bonds: z.number().min(0).default(0),
  
  // Personal Property
  vehicles: z.number().min(0).default(0),
  jewelry: z.number().min(0).default(0),
  business: z.number().min(0).default(0),
});

// Liabilities categories schema
export const liabilitiesSchema = z.object({
  // Mortgages & Loans
  primaryMortgage: z.number().min(0).default(0),
  homeEquityLoan: z.number().min(0).default(0),
  investmentMortgage: z.number().min(0).default(0),
  
  // Credit Cards
  creditCard1: z.number().min(0).default(0),
  creditCard2: z.number().min(0).default(0),
  creditCard3: z.number().min(0).default(0),
  
  // Personal Loans
  studentLoan: z.number().min(0).default(0),
  personalLoan: z.number().min(0).default(0),
  otherDebt: z.number().min(0).default(0),
  
  // Vehicle Loans
  carLoan1: z.number().min(0).default(0),
  carLoan2: z.number().min(0).default(0),
});

export const insertNetWorthCalculationSchema = createInsertSchema(netWorthCalculations, {
  assets: assetsSchema,
  liabilities: liabilitiesSchema,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type NetWorthCalculation = typeof netWorthCalculations.$inferSelect;
export type InsertNetWorthCalculation = z.infer<typeof insertNetWorthCalculationSchema>;
export type Assets = z.infer<typeof assetsSchema>;
export type Liabilities = z.infer<typeof liabilitiesSchema>;
