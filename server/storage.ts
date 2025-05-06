import { db } from "@db";
import { 
  events, 
  members, 
  news, 
  contacts, 
  newsletterSubscribers,
  EventInsert, 
  MemberRegister, 
  ContactInsert,
  NewsletterInsert
} from "@shared/schema";
import { eq } from "drizzle-orm";

export const storage = {
  // Society Stats
  getSocietyStats: async () => {
    const memberCount = await db.select({ count: { value: members.id } }).from(members);
    const tournamentCount = await db.select({ count: { value: events.id } })
      .from(events)
      .where(eq(events.type, "Tournament"));
    
    const champCount = 8; // Hardcoded for now

    return {
      members: memberCount[0]?.count.value || 120,
      tournaments: tournamentCount[0]?.count.value || 15,
      championships: champCount
    };
  },

  // Events
  getAllEvents: async () => {
    return db.select().from(events).orderBy(events.date);
  },

  getEventById: async (id: number) => {
    const result = await db.select().from(events).where(eq(events.id, id));
    return result.length > 0 ? result[0] : null;
  },

  createEvent: async (event: EventInsert) => {
    const result = await db.insert(events).values(event).returning();
    return result[0];
  },

  // Members
  getAllMembers: async () => {
    return db.select().from(members);
  },

  getMemberById: async (id: number) => {
    const result = await db.select().from(members).where(eq(members.id, id));
    return result.length > 0 ? result[0] : null;
  },

  registerMember: async (member: MemberRegister) => {
    // Create a member record from registration data
    const newMember = {
      name: `${member.firstName} ${member.lastName}`,
      email: member.email,
      experienceLevel: member.experience,
      joinReason: member.message || "",
      role: "Member", // Default role for new members
      eloRating: 
        member.experience === "beginner" ? Math.floor(Math.random() * 200) + 800 :
        member.experience === "intermediate" ? Math.floor(Math.random() * 600) + 1000 :
        member.experience === "advanced" ? Math.floor(Math.random() * 400) + 1600 :
        Math.floor(Math.random() * 500) + 2000,
      bio: `New member interested in chess.`,
      photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(member.firstName)}+${encodeURIComponent(member.lastName)}&background=random`,
      socialLinks: JSON.stringify({})
    };

    const result = await db.insert(members).values(newMember).returning();

    // If they opted in to the newsletter, subscribe them
    if (member.newsletter) {
      await db.insert(newsletterSubscribers).values({
        email: member.email,
        name: `${member.firstName} ${member.lastName}`
      });
    }

    return result[0];
  },

  // News
  getAllNews: async () => {
    return db.select().from(news).orderBy(news.date);
  },

  getNewsById: async (id: number) => {
    const result = await db.select().from(news).where(eq(news.id, id));
    return result.length > 0 ? result[0] : null;
  },

  // Contact Forms
  createContact: async (contact: ContactInsert) => {
    const result = await db.insert(contacts).values(contact).returning();
    return result[0];
  },

  // Newsletter
  subscribeToNewsletter: async (subscription: NewsletterInsert) => {
    const result = await db.insert(newsletterSubscribers).values(subscription).returning();
    return result[0];
  }
};
