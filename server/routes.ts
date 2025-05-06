import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  eventInsertSchema, 
  memberRegisterSchema,
  contactInsertSchema,
  newsletterInsertSchema
} from "@shared/schema";
import { z } from "zod";

const apiPrefix = "/api";

export async function registerRoutes(app: Express): Promise<Server> {
  // Society Stats
  app.get(`${apiPrefix}/society/stats`, async (req, res) => {
    try {
      const stats = await storage.getSocietyStats();
      return res.json(stats);
    } catch (error) {
      console.error("Error getting society stats:", error);
      return res.status(500).json({ error: "Failed to fetch society statistics" });
    }
  });

  // Events Routes
  app.get(`${apiPrefix}/events`, async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      return res.json(events);
    } catch (error) {
      console.error("Error getting events:", error);
      return res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get(`${apiPrefix}/events/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const event = await storage.getEventById(id);
      
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      
      return res.json(event);
    } catch (error) {
      console.error("Error getting event:", error);
      return res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  app.post(`${apiPrefix}/events`, async (req, res) => {
    try {
      const validatedData = eventInsertSchema.parse(req.body);
      const newEvent = await storage.createEvent(validatedData);
      return res.status(201).json(newEvent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating event:", error);
      return res.status(500).json({ error: "Failed to create event" });
    }
  });

  // Members Routes
  app.get(`${apiPrefix}/members`, async (req, res) => {
    try {
      const members = await storage.getAllMembers();
      return res.json(members);
    } catch (error) {
      console.error("Error getting members:", error);
      return res.status(500).json({ error: "Failed to fetch members" });
    }
  });

  app.get(`${apiPrefix}/members/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const member = await storage.getMemberById(id);
      
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }
      
      return res.json(member);
    } catch (error) {
      console.error("Error getting member:", error);
      return res.status(500).json({ error: "Failed to fetch member" });
    }
  });

  app.post(`${apiPrefix}/members/register`, async (req, res) => {
    try {
      const validatedData = memberRegisterSchema.parse(req.body);
      const newMember = await storage.registerMember(validatedData);
      return res.status(201).json(newMember);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      
      // Check if it's a duplicate email error
      const errorMessage = String(error);
      if (errorMessage.includes('duplicate key') && errorMessage.includes('email')) {
        return res.status(409).json({ 
          error: "Email already exists", 
          message: "This email address is already registered. Please use a different email address."
        });
      }
      
      console.error("Error registering member:", error);
      return res.status(500).json({ error: "Failed to register member" });
    }
  });

  // News Routes
  app.get(`${apiPrefix}/news`, async (req, res) => {
    try {
      const news = await storage.getAllNews();
      return res.json(news);
    } catch (error) {
      console.error("Error getting news:", error);
      return res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  app.get(`${apiPrefix}/news/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const news = await storage.getNewsById(id);
      
      if (!news) {
        return res.status(404).json({ error: "News not found" });
      }
      
      return res.json(news);
    } catch (error) {
      console.error("Error getting news:", error);
      return res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  // Contact Route
  app.post(`${apiPrefix}/contact`, async (req, res) => {
    try {
      const validatedData = contactInsertSchema.parse(req.body);
      const newContact = await storage.createContact(validatedData);
      return res.status(201).json(newContact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating contact:", error);
      return res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  // Newsletter Subscription
  app.post(`${apiPrefix}/newsletter/subscribe`, async (req, res) => {
    try {
      const validatedData = newsletterInsertSchema.parse(req.body);
      const newSubscription = await storage.subscribeToNewsletter(validatedData);
      return res.status(201).json(newSubscription);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      
      // Check if it's a duplicate email error
      const errorMessage = String(error);
      if (errorMessage.includes('duplicate key') && errorMessage.includes('email')) {
        return res.status(409).json({ 
          error: "Email already subscribed", 
          message: "This email address is already subscribed to our newsletter."
        });
      }
      
      console.error("Error subscribing to newsletter:", error);
      return res.status(500).json({ error: "Failed to subscribe to newsletter" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
