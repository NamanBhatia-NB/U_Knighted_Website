require('dotenv').config();
const connectDB = require('./mongoose');
const { Member, Event, News, SocietyStats, Tutorial, Lesson } = require('../models');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Member.deleteMany({});
    await Event.deleteMany({});
    await News.deleteMany({});
    await SocietyStats.deleteMany({});
    await Tutorial.deleteMany({});
    await Lesson.deleteMany({});

    // Create sample members
    const members = [
      {
        name: 'Michael Chen',
        firstName: 'Michael',
        lastName: 'Chen',
        role: 'Club President',
        eloRating: 2150,
        experience: 'expert',
        bio: 'National Master and Computer Science major with a passion for chess education.',
        photoUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=1974&auto=format&fit=crop',
        email: 'michael.chen@example.com',
        socialLinks: {
          linkedin: 'https://linkedin.com/in/michael-chen',
          chess: 'https://chess.com/member/mchen'
        }
      },
      {
        name: 'Sarah Johnson',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'Tournament Director',
        eloRating: 1875,
        experience: 'advanced',
        bio: 'Psychology major and chess enthusiast organizing our competitive events.',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop',
        email: 'sarah.johnson@example.com',
        socialLinks: {
          twitter: 'https://twitter.com/sarahj',
          chess: 'https://lichess.org/@/sarahjchess'
        }
      }
    ];

    // Create sample events
    const events = [
      {
        title: 'Weekly Club Meeting',
        type: 'Regular',
        date: '2025-05-10',
        timeStart: '18:00',
        timeEnd: '21:00',
        description: 'Our regular weekly club meeting with casual games, analysis, and chess puzzles.',
        location: 'Student Union Building, Room 305'
      },
      {
        title: 'Spring Championship',
        type: 'Tournament',
        date: '2025-05-25',
        timeStart: '09:00',
        timeEnd: '17:00',
        description: 'The semester\'s main tournament with cash prizes for the top three winners.',
        location: 'Student Union Grand Hall'
      },
      {
        title: 'Chess & Chill',
        type: 'Social',
        date: '2025-05-15',
        timeStart: '19:00',
        timeEnd: '22:00',
        description: 'A relaxed social event for chess players of all levels. Refreshments provided.',
        location: 'Campus Coffee House'
      }
    ];

    // Create sample news
    const news = [
      {
        title: 'Club Member Achieves FIDE Master Title',
        tag: 'Achievement',
        date: '2025-05-01',
        content: 'Our club president Michael Chen has officially achieved the FIDE Master title after his performance at the National Championship. This makes him the third FIDE titled player in our university\'s history.',
        imageUrl: 'https://images.unsplash.com/photo-1560174038-da43ac74f01b?q=80&w=1974&auto=format&fit=crop'
      },
      {
        title: 'Spring Tournament Registration Open',
        tag: 'Tournament',
        date: '2025-04-25',
        content: 'Registration is now open for our Spring Chess Championship. The tournament will be USCF rated with sections for different rating categories. Early registration discount available until May 10th.',
        imageUrl: 'https://images.unsplash.com/photo-1581296583726-118afbf267a0?q=80&w=1974&auto=format&fit=crop'
      }
    ];

    // Create society stats
    const stats = {
      members: 120,
      tournaments: 15,
      championships: 8
    };

    // Insert seed data
    await Member.insertMany(members);
    await Event.insertMany(events);
    await News.insertMany(news);
    await SocietyStats.create(stats);

    // Create tutorials
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

    const savedTutorials = await Tutorial.insertMany(tutorials);
    
    // Create lessons for each tutorial
    const beginnerTutorial = savedTutorials.find(t => t.level === 'beginner');
    const intermediateTutorial = savedTutorials.find(t => t.level === 'intermediate');
    const advancedTutorial = savedTutorials.find(t => t.level === 'advanced');

    // Create lessons
    const lessons = [
      // Beginner lessons
      {
        tutorialId: beginnerTutorial._id,
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
        tutorialId: beginnerTutorial._id,
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
      
      // Intermediate lessons
      {
        tutorialId: intermediateTutorial._id,
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
        tutorialId: intermediateTutorial._id,
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
      
      // Advanced lessons
      {
        tutorialId: advancedTutorial._id,
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
        tutorialId: advancedTutorial._id,
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

    await Lesson.insertMany(lessons);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();