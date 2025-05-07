import { db } from "./index";
import * as schema from "@shared/schema";

async function seed() {
  try {
    // Check if we already have data, if yes, don't seed
    const existingMembersCount = await db.select({ count: { value: schema.members.id } }).from(schema.members);
    
    if (existingMembersCount[0]?.count.value > 0) {
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

    await db.insert(schema.news).values(newsItems);

    // Seed Tutorials
    const tutorials = [
      {
        title: "Chess Basics for Beginners",
        description: "Learn the fundamentals of chess, from piece movement to basic tactics.",
        level: "beginner",
        coverImage: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        position: 1,
      },
      {
        title: "Tactical Patterns in Chess",
        description: "Discover common tactical patterns and how to spot them in your games.",
        level: "intermediate",
        coverImage: "https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        position: 2,
      },
      {
        title: "Advanced Endgame Techniques",
        description: "Master complex endgame positions and techniques used by grandmasters.",
        level: "advanced",
        coverImage: "https://images.unsplash.com/photo-1559480412-b3c866c6eb4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        position: 3,
      }
    ];

    const insertedTutorials = await db.insert(schema.tutorials).values(tutorials).returning();
    
    // Seed Lessons for beginner tutorial
    const beginnerTutorial = insertedTutorials.find(t => t.level === "beginner");
    const intermediateTutorial = insertedTutorials.find(t => t.level === "intermediate");
    const advancedTutorial = insertedTutorials.find(t => t.level === "advanced");
    
    if (beginnerTutorial && intermediateTutorial && advancedTutorial) {
      // Lessons for beginner tutorial
      const lessons = [
        {
          tutorialId: beginnerTutorial.id,
          title: "How Chess Pieces Move",
          description: "Learn how each chess piece moves on the board.",
          content: "In this lesson, we'll cover how each chess piece moves. The King moves one square in any direction. The Queen moves any number of squares diagonally, horizontally, or vertically. The Rook moves any number of squares horizontally or vertically. The Bishop moves any number of squares diagonally. The Knight moves in an L-shape: two squares horizontally or vertically and then one square perpendicular to that direction. The Pawn moves forward one square, but captures diagonally.",
          position: 1,
          initialPosition: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Starting position
          movesSequence: {
            moves: [
              { from: "e2", to: "e4" }, // Pawn move
              { from: "e7", to: "e5" }, // Pawn move
              { from: "g1", to: "f3" }  // Knight move
            ]
          },
          expectedOutcome: "Understanding basic piece movement",
        },
        {
          tutorialId: beginnerTutorial.id,
          title: "Basic Checkmate Patterns",
          description: "Learn the most common checkmate patterns for beginners.",
          content: "This lesson covers two fundamental checkmate patterns every beginner should know: the back-rank mate and the scholar's mate. The back-rank mate occurs when a rook or queen delivers checkmate along the back rank when the king is trapped by its own pieces. The scholar's mate is a four-move checkmate that targets the f7 square.",
          position: 2,
          initialPosition: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1", // Position after e4, e5, Nf3
          movesSequence: {
            moves: [
              { from: "f1", to: "c4" }, // Bishop to c4
              { from: "b8", to: "c6" }, // Knight to c6
              { from: "d1", to: "h5" }, // Queen to h5
              { from: "g8", to: "f6" }, // Knight to f6
              { from: "h5", to: "f7" }  // Queen checkmate
            ]
          },
          expectedOutcome: "Understanding basic checkmate patterns",
        },
        
        // Intermediate tutorial lessons
        {
          tutorialId: intermediateTutorial.id,
          title: "The Pin Tactic",
          description: "Learn how to use pins to gain material advantage.",
          content: "A pin is a powerful tactical motif where a piece is prevented from moving because it would expose a more valuable piece behind it to capture. There are two types of pins: absolute pins (where the pinned piece cannot legally move because it would expose the king to check) and relative pins (where the pinned piece can legally move but would expose a more valuable piece).",
          position: 1,
          initialPosition: "r1bqkbnr/ppp2ppp/2np4/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1", // Modified position
          movesSequence: {
            moves: [
              { from: "c4", to: "f7" }, // Bishop pin on f7
              { from: "e8", to: "f7" }, // King captures bishop
              { from: "d1", to: "h5" }, // Queen check
              { from: "g7", to: "g6" }, // Pawn blocks check
              { from: "h5", to: "e5" }  // Queen fork
            ]
          },
          expectedOutcome: "Understanding how to create and exploit pins",
        },
        {
          tutorialId: intermediateTutorial.id,
          title: "Double Attack and Fork Tactics",
          description: "Learn how to use double attacks to gain material.",
          content: "A double attack occurs when a single move threatens two or more targets simultaneously. A fork is a specific type of double attack where one piece (often a knight) attacks two or more enemy pieces at the same time. Knights are particularly effective at forking because of their unique movement pattern.",
          position: 2,
          initialPosition: "r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 1", // Position after development
          movesSequence: {
            moves: [
              { from: "f3", to: "g5" }, // Knight fork threat
              { from: "d7", to: "d6" }, // Defensive move 
              { from: "g5", to: "e6" }  // Knight fork on queen and king
            ]
          },
          expectedOutcome: "Understanding how to create and exploit forks",
        },
        
        // Advanced tutorial lessons
        {
          tutorialId: advancedTutorial.id,
          title: "Rook vs. Pawn Endgames",
          description: "Master the principles of rook vs. pawn endgames.",
          content: "Rook versus pawn endgames are among the most common endgames in chess. This lesson focuses on key principles: the Philidor position, the Lucena position, and the concept of the 'critical squares'. Understanding these positions and techniques is essential for mastering rook endgames.",
          position: 1,
          initialPosition: "8/8/8/8/3k4/8/3P4/3K1R2 w - - 0 1", // Lucena position
          movesSequence: {
            moves: [
              { from: "d1", to: "c2" }, // King approach
              { from: "d4", to: "e4" }, // Black king move
              { from: "f1", to: "f4" }, // Rook cuts off king
              { from: "e4", to: "e3" }, // Black king approach
              { from: "f4", to: "f8" }  // Building a bridge
            ]
          },
          expectedOutcome: "Understanding the Lucena position technique",
        },
        {
          tutorialId: advancedTutorial.id,
          title: "Opposition and Zugzwang",
          description: "Learn critical concepts for king and pawn endgames.",
          content: "This lesson covers two critical endgame concepts: opposition and zugzwang. Opposition occurs when kings face each other with an odd number of squares between them. The player who doesn't have to move often has the advantage. Zugzwang is a situation where any move will worsen a player's position. These concepts are especially important in king and pawn endgames.",
          position: 2,
          initialPosition: "8/8/4k3/8/4K3/8/4P3/8 w - - 0 1", // King and pawn vs king
          movesSequence: {
            moves: [
              { from: "e4", to: "e5" }, // Taking opposition 
              { from: "e6", to: "d6" }, // Black king moves aside
              { from: "e5", to: "d5" }, // Maintaining opposition
              { from: "d6", to: "c6" }, // Black king retreats
              { from: "d5", to: "e6" }  // White king advances
            ]
          },
          expectedOutcome: "Understanding how to use opposition to win endgames",
        }
      ];
      
      await db.insert(schema.lessons).values(lessons);
    }

  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
