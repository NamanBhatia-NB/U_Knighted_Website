import mongoose from "mongoose";

// Member Schema
const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, default: 'Member' },
  eloRating: { type: Number, default: 1200 },
  experience: { type: String, required: true },
  bio: { type: String, default: '' },
  photoUrl: { type: String, default: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=1974&auto=format&fit=crop' },
  message: String,
  newsletter: { type: Boolean, default: false },
  socialLinks: {
    linkedin: String,
    twitter: String,
    chess: String
  },
  createdAt: { type: Date, default: Date.now }
});

// Event Schema
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: String, required: true },
  timeStart: { type: String, required: true },
  timeEnd: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true }
});

// News Schema
const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tag: { type: String, required: true },
  date: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: String
});

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Newsletter Schema
const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  createdAt: { type: Date, default: Date.now }
});

// Society Stats Schema
const societyStatsSchema = new mongoose.Schema({
  members: { type: Number, default: 120 },
  tournaments: { type: Number, default: 15 },
  championships: { type: Number, default: 8 }
});

// Create models
const Member = mongoose.model('Member', memberSchema);
const Event = mongoose.model('Event', eventSchema);
const News = mongoose.model('News', newsSchema);
const Contact = mongoose.model('Contact', contactSchema);
const Newsletter = mongoose.model('Newsletter', newsletterSchema);
const SocietyStats = mongoose.model('SocietyStats', societyStatsSchema);

export { Member, Event, News, Contact, Newsletter, SocietyStats};
