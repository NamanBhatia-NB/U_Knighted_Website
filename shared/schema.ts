import { pgTable, text, serial, integer, boolean, timestamp, date, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table (existing from the template)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Members table
export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull().default("Member"),
  email: text("email").notNull().unique(),
  eloRating: integer("elo_rating").notNull().default(1200),
  experienceLevel: text("experience_level").notNull(),
  bio: text("bio"),
  photoUrl: text("photo_url"),
  joinReason: text("join_reason"),
  socialLinks: json("social_links").$type<{
    linkedin?: string;
    twitter?: string;
    chess?: string;
  }>(),
  joinDate: timestamp("join_date").defaultNow(),
});

export const memberInsertSchema = createInsertSchema(members);
export type MemberInsert = z.infer<typeof memberInsertSchema>;
export type Member = typeof members.$inferSelect;

// Custom schema for member registration form
export const memberRegisterSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  experience: z.enum(["beginner", "intermediate", "advanced", "expert"], {
    required_error: "Please select your experience level",
  }),
  message: z.string().optional(),
  newsletter: z.boolean().default(false),
});

export type MemberRegister = z.infer<typeof memberRegisterSchema>;

// Events table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // Tournament, Workshop, Social
  date: date("date").notNull(),
  timeStart: text("time_start").notNull(),
  timeEnd: text("time_end").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventInsertSchema = createInsertSchema(events);
export type EventInsert = z.infer<typeof eventInsertSchema>;
export type Event = typeof events.$inferSelect;

// News table
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tag: text("tag").notNull(), // Tournament Victory, Workshop, Recognition, etc.
  date: date("date").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsInsertSchema = createInsertSchema(news);
export type NewsInsert = z.infer<typeof newsInsertSchema>;
export type News = typeof news.$inferSelect;

// Contact forms
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isResolved: boolean("is_resolved").default(false),
});

export const contactInsertSchema = createInsertSchema(contacts);
export type ContactInsert = z.infer<typeof contactInsertSchema>;
export type Contact = typeof contacts.$inferSelect;

// Newsletter subscribers
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  subscribeDate: timestamp("subscribe_date").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const newsletterInsertSchema = createInsertSchema(newsletterSubscribers);
export type NewsletterInsert = z.infer<typeof newsletterInsertSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

// Chess tutorials
export const tutorials = pgTable("tutorials", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  level: text("level").notNull(), // Beginner, Intermediate, Advanced
  coverImage: text("cover_image"),
  position: integer("position").notNull(), // For ordering tutorials
  createdAt: timestamp("created_at").defaultNow(),
});

export const tutorialInsertSchema = createInsertSchema(tutorials);
export type TutorialInsert = z.infer<typeof tutorialInsertSchema>;
export type Tutorial = typeof tutorials.$inferSelect;

// Chess tutorial lessons
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  tutorialId: integer("tutorial_id").notNull().references(() => tutorials.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  position: integer("position").notNull(), // For ordering lessons within a tutorial
  initialPosition: text("initial_position").notNull(), // FEN string of initial board position
  movesSequence: json("moves_sequence").$type<{
    moves: Array<{
      from: string; // e.g., "e2"
      to: string; // e.g., "e4"
      promotion?: string; // For pawn promotion
    }>;
  }>(),
  expectedOutcome: text("expected_outcome"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const lessonInsertSchema = createInsertSchema(lessons);
export type LessonInsert = z.infer<typeof lessonInsertSchema>;
export type Lesson = typeof lessons.$inferSelect;

// Define relations
export const eventsRelations = relations(events, ({ many }) => ({
  // Additional relations can be added here
}));

export const membersRelations = relations(members, ({ many }) => ({
  // Additional relations can be added here
}));

export const newsRelations = relations(news, ({ many }) => ({
  // Additional relations can be added here
}));

export const tutorialsRelations = relations(tutorials, ({ many }) => ({
  lessons: many(lessons)
}));

export const lessonsRelations = relations(lessons, ({ one }) => ({
  tutorial: one(tutorials, {
    fields: [lessons.tutorialId],
    references: [tutorials.id]
  })
}));
