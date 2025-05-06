import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    // Check if we already have data, if yes, don't seed
    const existingMembersCount = await db.select({ count: { value: schema.members.id } }).from(schema.members);
    
    if (existingMembersCount[0]?.count.value > 0) {
      console.log("Database already has data. Skipping seed.");
      return;
    }

    // Seed Members
    const members = [
      {
        name: "Michael Chen",
        role: "Club President",
        email: "mchen@example.com",
        eloRating: 2150,
        experienceLevel: "expert",
        bio: "International Master and 3-time university champion specializing in the Sicilian Defense.",
        photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        joinReason: "To lead the chess community on campus.",
        socialLinks: JSON.stringify({
          linkedin: "https://linkedin.com",
          twitter: "https://twitter.com",
          chess: "https://chess.com"
        })
      },
      {
        name: "Sarah Johnson",
        role: "Tournament Director",
        email: "sjohnson@example.com",
        eloRating: 2080,
        experienceLevel: "expert",
        bio: "FIDE Master known for aggressive play and tactical combinations in the French Defense.",
        photoUrl: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        joinReason: "To organize tournaments and promote competitive play.",
        socialLinks: JSON.stringify({
          linkedin: "https://linkedin.com",
          twitter: "https://twitter.com",
          chess: "https://chess.com"
        })
      },
      {
        name: "David Rodriguez",
        role: "Treasurer",
        email: "drodriguez@example.com",
        eloRating: 1950,
        experienceLevel: "advanced",
        bio: "National Master with strategic positional style and expertise in Ruy Lopez variations.",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        joinReason: "To manage club finances and ensure resource availability.",
        socialLinks: JSON.stringify({
          linkedin: "https://linkedin.com",
          twitter: "https://twitter.com",
          chess: "https://chess.com"
        })
      },
      {
        name: "Maya Patel",
        role: "Events Coordinator",
        email: "mpatel@example.com",
        eloRating: 1890,
        experienceLevel: "advanced",
        bio: "Rising star with exceptional endgame skills and a specialist in the Queen's Gambit Declined.",
        photoUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        joinReason: "To plan and execute engaging chess events for the community.",
        socialLinks: JSON.stringify({
          linkedin: "https://linkedin.com",
          twitter: "https://twitter.com",
          chess: "https://chess.com"
        })
      }
    ];

    console.log("Seeding members...");
    await db.insert(schema.members).values(members);

    // Seed Events
    const events = [
      {
        title: "Fall Championship",
        type: "Tournament",
        date: new Date("2023-10-15"),
        timeStart: "9:00 AM",
        timeEnd: "5:00 PM",
        description: "Our premier semester tournament with divisions for beginners, intermediate, and advanced players. Prizes for top performers!",
        location: "Student Union, Room 302"
      },
      {
        title: "Opening Strategies",
        type: "Workshop",
        date: new Date("2023-10-08"),
        timeStart: "4:00 PM",
        timeEnd: "6:00 PM",
        description: "Learn essential opening principles and common patterns from our club champion. Perfect for beginners and intermediate players.",
        location: "Library, Conference Room B"
      },
      {
        title: "Chess & Chill",
        type: "Social",
        date: new Date("2023-10-05"),
        timeStart: "7:00 PM",
        timeEnd: "10:00 PM",
        description: "Casual games, pizza, and good company! Drop in anytime during the event. All skill levels welcome.",
        location: "Campus Coffee House"
      }
    ];

    console.log("Seeding events...");
    await db.insert(schema.events).values(events);

    // Seed News
    const newsItems = [
      {
        title: "University Team Wins Regional Championship",
        content: "Our team dominated the regional collegiate chess championship, securing both individual and team titles. Michael Chen led the charge with an undefeated performance, while Sarah Johnson secured best board 2 with a stunning queen sacrifice in the final round. The victory qualifies our team for the national collegiate championships next semester.",
        tag: "Tournament Victory",
        date: new Date("2023-09-28"),
        imageUrl: "https://pixabay.com/get/gf16b117048141a22f28c2622ff499a44427e5cbf5851a86ad36ea26547d670735bd5774a420448b76053a9332f4bd912865b1b1d847851d6dc8880be64215227_1280.jpg"
      },
      {
        title: "Grandmaster Visit: Strategic Thinking Workshop",
        content: "International Grandmaster Elena Petrova will conduct a special workshop on strategic thinking in chess. This is a rare opportunity to learn from one of the world's top players. Registration is required and spaces are limited.",
        tag: "Workshop",
        date: new Date("2023-09-15")
      },
      {
        title: "Club Member Achieves FIDE Master Title",
        content: "Congratulations to Sarah Johnson on achieving the prestigious FIDE Master title at the International Open. Her performance included victories against two Grandmasters and a stunning 26-move brilliancy that's already being featured in chess publications.",
        tag: "Recognition",
        date: new Date("2023-09-05")
      }
    ];

    console.log("Seeding news...");
    await db.insert(schema.news).values(newsItems);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
