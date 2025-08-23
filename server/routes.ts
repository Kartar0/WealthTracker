import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNetWorthCalculationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Save net worth calculation
  app.post("/api/net-worth", async (req, res) => {
    try {
      const validationResult = insertNetWorthCalculationSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid data", 
          errors: validationResult.error.issues 
        });
      }

      const calculation = await storage.saveNetWorthCalculation(validationResult.data);
      res.json(calculation);
    } catch (error) {
      console.error("Error saving net worth calculation:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get net worth calculation by ID
  app.get("/api/net-worth/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const calculation = await storage.getNetWorthCalculation(id);
      
      if (!calculation) {
        return res.status(404).json({ message: "Net worth calculation not found" });
      }

      res.json(calculation);
    } catch (error) {
      console.error("Error getting net worth calculation:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all net worth calculations for a user
  app.get("/api/users/:userId/net-worth", async (req, res) => {
    try {
      const { userId } = req.params;
      const calculations = await storage.getUserNetWorthCalculations(userId);
      res.json(calculations);
    } catch (error) {
      console.error("Error getting user net worth calculations:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
