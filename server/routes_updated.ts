import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { dbStorage as storage } from "./dbStorage";
import { db } from "./db";
import { eq } from 'drizzle-orm';
// const winston = require('winston');
import {
  insertUserSchema,
  stepOneSchema,
  stepTwoSchema,
  stepThreeSchema,
  stepFourSchema,
  insertContactSchema,
  insertCompanySchema,
  InsertUser,
  contacts,
  companies
} from "@shared/schema";
import { z } from "zod";
import {
  generateMessage,
  MessagePurpose,
  MessageTone,
} from "./services/gemini";
import {
  testSalesforceConnection,
  importContactsFromSalesforce,
  importCompaniesFromSalesforce,
  exportContactsToSalesforce,
  exportCompaniesToSalesforce,
} from "./services/crm/salesforce";
import {
  testHubspotConnection,
  importContactsFromHubspot,
  importCompaniesFromHubspot,
  exportContactsToHubspot,
  exportCompaniesToHubspot,
} from "./services/crm/hubspot";
import { CRMType, CRMConnectionStatus } from "./services/crm/index";

const SESSION_SECRET = process.env.SESSION_SECRET || "your-secret-key";
const MOCK_VERIFICATION_CODE = "123456"; // For demonstration purposes only

// JWT token authentication (simplified)
function generateToken(userId: number): string {
  return `token_${userId}_${Date.now()}`;
}

function verifyToken(token: string): number | null {
  // In a real implementation, this would validate a JWT
  const parts = token.split("_");
  if (parts.length >= 2 && parts[0] === "token") {
    return parseInt(parts[1], 10);
  }
  return null;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware for authenticating requests
  const authenticateRequest = async (
    req: Request,
    res: Response,
    next: Function,
  ) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const userId = verifyToken(token);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Attach user to request for route handlers to use
    (req as any).user = user;
    next();
  };

  // AUTH ROUTES
  // (auth routes would be here - omitted to save space)

  // USER ROUTES
  app.get("/api/user/profile", authenticateRequest, async (req, res) => {
    const user = (req as any).user;

    return res.status(200).json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        companyName: user.companyName,
        industry: user.industry,
        role: user.role,
        credits: user.credits,
      },
    });
  });

  app.get("/api/user/credits", authenticateRequest, async (req, res) => {
    const user = (req as any).user;
    const credits = await storage.getCreditBalance(user.id);

    return res.status(200).json({ credits });
  });

  app.get(
    "/api/user/credit-transactions",
    authenticateRequest,
    async (req, res) => {
      const user = (req as any).user;
      const transactions = await storage.getCreditTransactions(user.id);

      return res.status(200).json({ transactions });
    },
  );

  // CONTACT ROUTES
  app.get("/api/contacts", authenticateRequest, async (req, res) => {
    const user = (req as any).user;
    
    const contacts = await storage.getContactsByUser(user.id);
    return res.status(200).json({ contacts });
  });

  // ENHANCED: Create contact with proper company integration
  app.post("/api/contacts", authenticateRequest, async (req, res) => {
    try {
      const user = (req as any).user;
      
      // Let's handle the company and contact data properly for synchronization
      const contactData = {
        ...req.body,
        userId: user.id,
      };
      
      // If companyId is provided, look up the company to set the company name properly
      if (contactData.companyId) {
        const company = await storage.getCompany(contactData.companyId);
        
        if (company && company.userId === user.id) {
          // Ensure companyName matches the company record
          contactData.companyName = company.name;
          
          // If industry is not set but available from company, use it
          if (!contactData.industry && company.industry) {
            contactData.industry = company.industry;
          }
        } else {
          // Company not found or doesn't belong to user
          delete contactData.companyId;
        }
      }
      
      // Create a new company if companyName is provided but no companyId
      if (contactData.companyName && !contactData.companyId && !req.body.skipCompanyCreation) {
        try {
          // Check if a company with this name already exists for this user
          const existingCompanies = await storage.getCompaniesByUser(user.id);
          const existingCompany = existingCompanies.find(
            c => c.name.toLowerCase() === contactData.companyName.toLowerCase()
          );
          
          if (existingCompany) {
            // Use existing company
            contactData.companyId = existingCompany.id;
          } else {
            // Create new company
            const newCompany = await storage.createCompany({
              name: contactData.companyName,
              userId: user.id,
              industry: contactData.industry,
              location: contactData.location,
              website: null,
              description: null,
              size: contactData.teamSize,
              foundedYear: null,
              logo: null,
              linkedInUrl: null,
              twitterUrl: null,
              facebookUrl: null,
            });
            
            contactData.companyId = newCompany.id;
          }
        } catch (companyError) {
          console.error("Error handling company creation:", companyError);
          // Continue without company association
        }
      }

      const validatedData = insertContactSchema.parse(contactData);
      const contact = await storage.createContact(validatedData);

      return res.status(201).json({ contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      }
      console.error("Error creating contact:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // ENHANCED: Update contact with proper company integration
  app.patch('/api/contacts/:id', authenticateRequest, async (req, res) => {
    try {
      const user = (req as any).user;
      const contactId = parseInt(req.params.id);
      let contactData = req.body;
      
      console.log("PATCH Contact ID:", contactId);
      console.log("PATCH Contact data:", contactData);
      
      // Check if the contact belongs to the user
      const existingContact = await storage.getContact(contactId);
      if (!existingContact) {
        return res.status(404).json({ message: "Contact not found" });
      }

      if (existingContact.userId !== user.id) {
        return res.status(403).json({ message: "Not authorized to update this contact" });
      }
      
      // If companyId is provided, look up the company to set the company name properly
      if (contactData.companyId) {
        const company = await storage.getCompany(contactData.companyId);
        
        if (company && company.userId === user.id) {
          // Ensure companyName matches the company record
          contactData.companyName = company.name;
          
          // If industry is not set but available from company, use it
          if (!contactData.industry && company.industry) {
            contactData.industry = company.industry;
          }
        } else {
          // Company not found or doesn't belong to user
          delete contactData.companyId;
        }
      }
      
      // Create a new company if companyName is changed but no companyId
      if (contactData.companyName && 
          contactData.companyName !== existingContact.companyName && 
          !contactData.companyId && 
          !req.body.skipCompanyCreation) {
        try {
          // Check if a company with this name already exists for this user
          const existingCompanies = await storage.getCompaniesByUser(user.id);
          const existingCompany = existingCompanies.find(
            c => c.name.toLowerCase() === contactData.companyName.toLowerCase()
          );
          
          if (existingCompany) {
            // Use existing company
            contactData.companyId = existingCompany.id;
          } else {
            // Create new company
            const newCompany = await storage.createCompany({
              name: contactData.companyName,
              userId: user.id,
              industry: contactData.industry || existingContact.industry,
              location: contactData.location || existingContact.location,
              website: null,
              description: null,
              size: contactData.teamSize || existingContact.teamSize,
              foundedYear: null,
              logo: null,
              linkedInUrl: null,
              twitterUrl: null,
              facebookUrl: null,
            });
            
            contactData.companyId = newCompany.id;
          }
        } catch (companyError) {
          console.error("Error handling company creation:", companyError);
          // Continue without company association
        }
      }
      
      // Update the contact with all provided data
      const updatedContact = await storage.updateContact(contactId, contactData);
      return res.status(200).json(updatedContact);
    } catch (error) {
      console.error("Error updating contact with PATCH:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Other existing routes would continue from here
  // ...

  app.get("/api/messages/stats", authenticateRequest, async (req, res) => {
    try {
      const user = (req as any).user;

      const stats = await db.transaction(async (tx) => {
        try {
          const totalResult = await tx.execute(sql`
            SELECT COUNT(*) as count 
            FROM credit_transactions 
            WHERE user_id = ${user.id} 
            AND description LIKE '%AI message generation%'
          `);

          const last30Result = await tx.execute(sql`
            SELECT COUNT(*) as count 
            FROM credit_transactions 
            WHERE user_id = ${user.id} 
            AND description LIKE '%AI message generation%'
            AND created_at >= NOW() - INTERVAL '30 days'
          `);

          const todayResult = await tx.execute(sql`
            SELECT COUNT(*) as count 
            FROM credit_transactions 
            WHERE user_id = ${user.id} 
            AND description LIKE '%AI message generation%'
            AND DATE(created_at) = CURRENT_DATE
          `);

          return {
            totalMessages: Number((totalResult.rows[0]?.count ?? 0)),
            last30Days: Number((last30Result.rows[0]?.count ?? 0)),
            today: Number((todayResult.rows[0]?.count ?? 0))
          };
        } catch (txError) {
          console.error("Transaction error:", txError);
          throw new Error("Failed to fetch message counts");
        }
      });

      // Fetch recent messages with fixed array handling
      try {
        const recentResult = await db.execute(sql`
          SELECT id, description, type, created_at
          FROM credit_transactions 
          WHERE user_id = ${user.id}
          AND description LIKE '%AI message generation%'
          ORDER BY created_at DESC
          LIMIT 5
        `);

        // Ensure recentResult.rows exists and is an array
        const recentMessages = Array.isArray(recentResult) 
          ? recentResult 
          : Array.isArray(recentResult?.rows) 
            ? recentResult.rows 
            : [];

        return res.status(200).json({
          success: true,
          ...stats,
          recentMessages: recentMessages.map(msg => ({
            id: msg.id,
            description: msg.description,
            creditsUsed: Number(msg.type),
            createdAt: msg.created_at
          }))
        });

      } catch (recentError) {
        console.error("Error fetching recent messages:", recentError);
        return res.status(200).json({
          success: true,
          ...stats,
          recentMessages: []
        });
      }

    } catch (error) {
      console.error("Error fetching message stats:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch message statistics",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/activities", authenticateRequest, async (req, res) => {
    try {
      const user = (req as any).user;

      // Fetch activities from credit_transactions and combine them
      const activities = await db.execute(sql`
        SELECT 
          id,
          CASE 
            WHEN description LIKE '%search%' THEN 'search'
            WHEN description LIKE '%message%' THEN 'message'
            WHEN description LIKE '%email%' THEN 'email'
            WHEN description LIKE '%contact%' THEN 'contact'
            WHEN description LIKE '%company%' THEN 'company'
            ELSE 'other'
          END as type,
          description,
          created_at as timestamp
        FROM credit_transactions 
        WHERE user_id = ${user.id}
        ORDER BY created_at DESC
        LIMIT 20
      `);

      return res.status(200).json({
        success: true,
        activities: activities.map(activity => ({
          id: activity.id,
          type: activity.type,
          description: activity.description,
          timestamp: activity.timestamp
        }))
      });

    } catch (error) {
      console.error("Error fetching activities:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch activities"
      });
    }
  });

  const server = createServer(app);
  return server;
}