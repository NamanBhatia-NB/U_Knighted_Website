import { Member, Event, News, Contact, Newsletter } from '../models/index.mjs';

export const storage = {
  // Society Stats
  getSocietyStats: async () => {
    // Count members
    const memberCount = await Member.countDocuments();
    
    // Count tournaments
    const tournamentCount = await Event.countDocuments({ type: /tournament/i });
    
    // Hardcoded championships for now
    const champCount = 8;

    return {
      members: memberCount || 120,
      tournaments: tournamentCount || 15,
      championships: champCount
    };
  },

  // Events
  getAllEvents: async () => {
    return Event.find().sort({ date: 1 });
  },

  getEventById: async (id) => {
    return Event.findById(id);
  },

  createEvent: async (eventData) => {
    const event = new Event(eventData);
    return event.save();
  },

  updateEvent: async (id, eventData) => {
    return Event.findByIdAndUpdate(id, eventData, { new: true });
  },

  deleteEvent: async (id) => {
    return Event.findByIdAndDelete(id);
  },

  // Members
  getAllMembers: async () => {
    return Member.find().select('-message -newsletter');
  },

  getMemberById: async (id) => {
    return Member.findById(id);
  },

  getMemberByEmail: async (email) => {
    return Member.findOne({ email });
  },

  registerMember: async (memberData) => {
    // Check if member already exists
    const existingMember = await Member.findOne({ email: memberData.email });
    if (existingMember) {
      throw new Error('Email already exists');
    }
    
    // Create new member
    const member = new Member({
      name: `${memberData.firstName} ${memberData.lastName}`,
      firstName: memberData.firstName,
      lastName: memberData.lastName,
      email: memberData.email,
      experience: memberData.experience,
      message: memberData.message,
      newsletter: memberData.newsletter,
      role: "Member", // Default role for new members
      eloRating: 
        memberData.experience === "beginner" ? Math.floor(Math.random() * 200) + 800 :
        memberData.experience === "intermediate" ? Math.floor(Math.random() * 600) + 1000 :
        memberData.experience === "advanced" ? Math.floor(Math.random() * 400) + 1600 :
        Math.floor(Math.random() * 500) + 2000,
      bio: `New member interested in chess.`,
      photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(memberData.firstName)}+${encodeURIComponent(memberData.lastName)}&background=random`,
      socialLinks: {}
    });
    
    const savedMember = await member.save();
    
    // If they opted in to the newsletter, subscribe them
    if (memberData.newsletter) {
      await Newsletter.create({
        email: memberData.email,
        name: `${memberData.firstName} ${memberData.lastName}`
      });
    }
    
    return savedMember;
  },

  // News
  getAllNews: async () => {
    return News.find().sort({ date: -1 });
  },

  getNewsById: async (id) => {
    return News.findById(id);
  },

  // Contact Forms
  createContact: async (contactData) => {
    const contact = new Contact(contactData);
    return contact.save();
  },

  // Newsletter
  subscribeToNewsletter: async (subscriptionData) => {
    // Check if already subscribed
    const existingSubscription = await Newsletter.findOne({ email: subscriptionData.email });
    if (existingSubscription) {
      throw new Error('Email already subscribed');
    }
    
    const subscription = new Newsletter(subscriptionData);
    return subscription.save();
  }
};