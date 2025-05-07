import { useState, useEffect } from "react";

import Footer from "@/components/ChessSections/Footer";
import membersData from "@/data/members.json";

interface Member {
  id: number;
  name: string;
  role: string;
  eloRating: number;
  bio: string;
  photoUrl: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    chess?: string;
  };
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    // Sort members by role importance first, then by ELO rating
    const sortedMembers = [...membersData].sort((a, b) => {
      // Custom sorting by role importance
      const roleImportance = (role: string) => {
        const order = ["President", "Vice President", "Treasurer", "Secretary", "Tournament Director"];
        const index = order.indexOf(role);
        return index >= 0 ? index : 999; // If not in the list, sort by ELO
      };

      const roleCompare = roleImportance(a.role) - roleImportance(b.role);

      // If roles have the same importance, sort by ELO rating (descending)
      if (roleCompare === 0) {
        return b.eloRating - a.eloRating;
      }

      return roleCompare;
    });

    setMembers(sortedMembers);
    setIsLoading(false);

    // Initialize scroll animations
    const scrollFadeElements = document.querySelectorAll('.scrolled-fade-in');

    const checkScroll = () => {
      scrollFadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('fade-in-visible');
        }
      });
    };

    window.addEventListener('scroll', checkScroll);
    // Check on initial load
    checkScroll();

    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  // Get all unique roles for filtering
  const allRoles = ["all", ...Array.from(new Set(membersData.map(member => member.role)))];

  // Filter members based on selection
  const filteredMembers = filter === "all"
    ? members
    : members.filter(member => member.role === filter);

  return (
    <>
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scrolled-fade-in">
            <h1 className="text-3xl md:text-5xl font-bold font-display mb-4">Our Chess Champions</h1>
            <p className="max-w-2xl mx-auto text-lg text-primary/70">
              Meet the talented players who represent our chess society and help make our community thrive.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10 scrolled-fade-in">
            {allRoles.map((role) => (
              <button
                key={role}
                onClick={() => setFilter(role)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === role
                  ? 'bg-primary text-white'
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
              >
                {role === "all" ? "All Members" : role}
              </button>
            ))}
          </div>

          {/* Members grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {isLoading ? (
              // Loading skeletons
              Array(8).fill(null).map((_, i) => (
                <div key={i} className="glass rounded-xl p-6 text-center animate-pulse">
                  <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-300"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                  <div className="flex justify-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              ))
            ) : filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <div key={member.id} className="glass rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl scrolled-fade-in">
                  <img
                    src={member.photoUrl}
                    alt={`${member.name}, ${member.role}`}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover object-center border-4 border-accent shadow-lg"
                  />
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className={`mb-3 font-medium ${member.role === 'President' ? 'text-accent' :
                    member.role === 'Vice President' ? 'text-accent/80' :
                      'text-primary/70'
                    }`}>{member.role}</p>
                  <div className="flex justify-center mb-4">
                    <span className="px-3 py-1 bg-primary/10 rounded-full text-sm font-medium">ELO {member.eloRating}</span>
                  </div>
                  <p className="text-sm mb-4 line-clamp-4">{member.bio}</p>
                  <div className="flex justify-center space-x-3">
                    {member.socialLinks.linkedin && (
                      <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                        <i className="ri-linkedin-fill"></i>
                      </a>
                    )}
                    {member.socialLinks.twitter && (
                      <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                        <i className="ri-twitter-fill"></i>
                      </a>
                    )}
                    {member.socialLinks.chess && (
                      <a
                        href={member.socialLinks.chess}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        <img
                          src="/chess.png"
                          alt="Chess Logo"
                          className="h-4 transition duration-300 group-hover:invert"
                        />
                      </a>
                    )}

                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-xl">No members found for this filter.</p>
                <button
                  onClick={() => setFilter("all")}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  View All Members
                </button>
              </div>
            )}
          </div>

          {/* ELO Rating explanation */}
          <div className="glass rounded-xl p-8 md:p-12 mt-16 mb-12 scrolled-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">Understanding ELO Ratings</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="mb-4">
                  The ELO rating system is a method for calculating the relative skill levels of players in chess and other competitive games. Higher ratings indicate stronger players.
                </p>
                <p className="mb-4">
                  The rating system was invented by Arpad Elo, a Hungarian-American physics professor and chess master. A player's ELO rating changes based on their performance against other rated players.
                </p>
                <p>
                  Winning against a higher-rated player results in a larger rating gain than winning against a lower-rated player. Similarly, losing to a lower-rated player results in a larger rating loss.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                  <span className="font-medium">Beginner</span>
                  <span>Below 1200</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                  <span className="font-medium">Novice</span>
                  <span>1200 - 1400</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                  <span className="font-medium">Intermediate</span>
                  <span>1400 - 1600</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                  <span className="font-medium">Advanced</span>
                  <span>1600 - 1800</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                  <span className="font-medium">Expert</span>
                  <span>1800 - 2000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                  <span className="font-medium">Master</span>
                  <span>2000 - 2200</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                  <span className="font-medium">Grandmaster</span>
                  <span>Above 2200</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
