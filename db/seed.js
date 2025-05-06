require('dotenv').config();
const connectDB = require('./mongoose');
const { Member, Event, News, SocietyStats } = require('../models');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Member.deleteMany({});
    await Event.deleteMany({});
    await News.deleteMany({});
    await SocietyStats.deleteMany({});

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



    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();