import { type User, type InsertUser, type NetWorthCalculation, type InsertNetWorthCalculation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveNetWorthCalculation(calculation: InsertNetWorthCalculation): Promise<NetWorthCalculation>;
  getNetWorthCalculation(id: string): Promise<NetWorthCalculation | undefined>;
  getUserNetWorthCalculations(userId: string): Promise<NetWorthCalculation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private netWorthCalculations: Map<string, NetWorthCalculation>;

  constructor() {
    this.users = new Map();
    this.netWorthCalculations = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveNetWorthCalculation(calculation: InsertNetWorthCalculation): Promise<NetWorthCalculation> {
    const id = randomUUID();
    const now = new Date();
    const netWorthCalculation: NetWorthCalculation = { 
      ...calculation, 
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.netWorthCalculations.set(id, netWorthCalculation);
    return netWorthCalculation;
  }

  async getNetWorthCalculation(id: string): Promise<NetWorthCalculation | undefined> {
    return this.netWorthCalculations.get(id);
  }

  async getUserNetWorthCalculations(userId: string): Promise<NetWorthCalculation[]> {
    return Array.from(this.netWorthCalculations.values()).filter(
      (calc) => calc.userId === userId,
    );
  }
}

export const storage = new MemStorage();
