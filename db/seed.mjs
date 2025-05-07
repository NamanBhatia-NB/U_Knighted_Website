import connectDB from './mongoose.mjs';
import { Member, Event, News, SocietyStats } from '../models/index.mjs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const isConnected = await connectDB();

if (!isConnected) {
  console.error('Failed to connect to MongoDB. Database seeding aborted.');
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Clear existing data (be careful in production)
    // Only use this in development environment
    if (process.env.NODE_ENV !== 'production') {
      console.log('Clearing existing data...');
      await Member.deleteMany({});
      await Event.deleteMany({});
      await News.deleteMany({});
      await SocietyStats.deleteMany({});
    }
    
    // Seed society stats
    console.log('Seeding society stats...');
    const stats = await SocietyStats.create({
      members: 120,
      tournaments: 15,
      championships: 8
    });
    
    // Seed members
    console.log('Seeding members...');
    const members = [
      {
        name: 'Alex Johnson',
        firstName: 'Alex',
        lastName: 'Johnson',
        email: 'alex@example.com',
        role: 'President',
        eloRating: 2100,
        experience: 'Advanced',
        bio: 'Club president and tournament organizer with over 10 years of competitive chess experience.',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1374&auto=format&fit=crop',
        socialLinks: {
          linkedin: 'https://linkedin.com/in/alexjohnson',
          twitter: 'https://twitter.com/alexjohnson',
          chess: 'https://chess.com/member/alexjchess'
        }
      },
      {
        name: 'Maria Chen',
        firstName: 'Maria',
        lastName: 'Chen',
        email: 'maria@example.com',
        role: 'Vice President',
        eloRating: 1950,
        experience: 'Advanced',
        bio: 'International chess competitor and mathematics student specializing in chess strategy analysis.',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374&auto=format&fit=crop',
        socialLinks: {
          linkedin: 'https://linkedin.com/in/mariachen',
          twitter: 'https://twitter.com/mariachenchess',
          chess: 'https://chess.com/member/mariachen'
        }
      },
      {
        name: 'David Williams',
        firstName: 'David',
        lastName: 'Williams',
        email: 'david@example.com',
        role: 'Treasurer',
        eloRating: 1850,
        experience: 'Intermediate',
        bio: 'Finance student and chess enthusiast who manages club finances and tournament prize pools.',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop',
        socialLinks: {
          linkedin: 'https://linkedin.com/in/davidwilliams',
          chess: 'https://chess.com/member/davidw'
        }
      },
      {
        name: 'Sarah Thompson',
        firstName: 'Sarah',
        lastName: 'Thompson',
        email: 'sarah@example.com',
        role: 'Secretary',
        eloRating: 1720,
        experience: 'Intermediate',
        bio: 'Communications major who handles all club correspondence and event coordination.',
        photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470&auto=format&fit=crop',
        socialLinks: {
          twitter: 'https://twitter.com/sarahthompson',
          chess: 'https://chess.com/member/saraht'
        }
      },
      {
        name: 'James Lee',
        firstName: 'James',
        lastName: 'Lee',
        email: 'james@example.com',
        role: 'Tournament Director',
        eloRating: 2200,
        experience: 'Expert',
        bio: 'National Master and computer science student who develops chess algorithms in his spare time.',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop',
        socialLinks: {
          linkedin: 'https://linkedin.com/in/jameslee',
          twitter: 'https://twitter.com/jamesleechess',
          chess: 'https://chess.com/member/masterlee'
        }
      }
    ];
    
    await Member.insertMany(members);
    
    // Seed events
    console.log('Seeding events...');
    const currentDate = new Date();
    const events = [
      {
        title: 'Weekly Blitz Tournament',
        type: 'Tournament',
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7).toISOString().split('T')[0],
        timeStart: '18:00',
        timeEnd: '21:00',
        description: 'Fast-paced 5-minute blitz games with prizes for the top 3 finishers. Open to all skill levels.',
        location: 'Student Union Room 202'
      },
      {
        title: 'Beginner Chess Workshop',
        type: 'Workshop',
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 3).toISOString().split('T')[0],
        timeStart: '16:00',
        timeEnd: '18:00',
        description: 'Learn the basics of chess including piece movements, strategy fundamentals, and common openings.',
        location: 'Library Study Room 3'
      },
      {
        title: 'Chess Movie Night: "Queen\'s Gambit"',
        type: 'Social',
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 14).toISOString().split('T')[0],
        timeStart: '19:00',
        timeEnd: '22:00',
        description: 'Join us for a screening of the popular chess drama followed by a discussion of the chess positions featured in the show.',
        location: 'Media Center Auditorium'
      },
      {
        title: 'Advanced Strategy Lecture by GM Sarah Johnson',
        type: 'Lecture',
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 21).toISOString().split('T')[0],
        timeStart: '17:00',
        timeEnd: '19:00',
        description: 'Special guest lecture by Grandmaster Sarah Johnson on positional play and endgame techniques.',
        location: 'Science Building Room 105'
      },
      {
        title: 'Spring Championship',
        type: 'Tournament',
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 30).toISOString().split('T')[0],
        timeStart: '10:00',
        timeEnd: '18:00',
        description: 'Our major semester tournament with cash prizes and trophies. FIDE rated matches with 30-minute time controls.',
        location: 'University Great Hall'
      }
    ];
    
    await Event.insertMany(events);
    
    // Seed news
    console.log('Seeding news articles...');
    const news = [
      {
        title: 'Club Member Wins Regional Championship',
        tag: 'Achievement',
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 5).toISOString().split('T')[0],
        content: 'Our club\'s vice president, Maria Chen, has won the Regional Collegiate Chess Championship with an impressive 7-0 score. This victory qualifies her for the National Collegiate Chess Championship next month. The entire club congratulates Maria on this outstanding achievement!',
        imageUrl: 'https://images.unsplash.com/photo-1560174051-47a5911fdb71?q=80&w=1374&auto=format&fit=crop'
      },
      {
        title: 'New Chess Analysis Software Available in Club Room',
        tag: 'Resources',
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 10).toISOString().split('T')[0],
        content: 'Thanks to a generous donation from the Computer Science department, our club room now features four workstations with professional chess analysis software. Members can analyze their games, study master games, and prepare opening repertoires. Training sessions on how to use the software will be held every Wednesday afternoon.',
        imageUrl: 'https://images.unsplash.com/photo-1623360356596-e833b8d86c8b?q=80&w=1470&auto=format&fit=crop'
      },
      {
        title: 'Upcoming Chess Simultaneous Exhibition',
        tag: 'Event',
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 2).toISOString().split('T')[0],
        content: 'We\'re excited to announce that International Master David Patterson will be visiting our club for a simultaneous exhibition on April 15th. Up to 25 club members will have the opportunity to play against IM Patterson simultaneously. Sign up is available through our website or in the club room. This is a rare opportunity to test your skills against a seasoned professional!',
        imageUrl: 'https://images.unsplash.com/photo-1611195974226-a6a9be98f67c?q=80&w=1471&auto=format&fit=crop'
      }
    ];
    
    await News.insertMany(news);
    
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
await seedDatabase();