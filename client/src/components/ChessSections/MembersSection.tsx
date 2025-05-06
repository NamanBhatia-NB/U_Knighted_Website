import { useState, useEffect } from "react";
import { Link } from "wouter";
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

export default function MembersSection() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Sort members by role importance (President first, etc.)
    const sortedMembers = [...membersData].sort((a, b) => {
      // Custom sorting by role importance
      const roleImportance = (role: string) => {
        const order = ["President", "Vice President", "Treasurer", "Secretary", "Tournament Director"];
        const index = order.indexOf(role);
        return index >= 0 ? index : 999; // If not in the list, put at the end
      };
      
      return roleImportance(a.role) - roleImportance(b.role);
    });
    
    setMembers(sortedMembers);
    setIsLoading(false);
  }, []);

  return (
    <section id="members" className="py-20 md:py-32 relative">
      {/* Decorative chess board pattern in background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="grid grid-cols-8 h-full">
          {Array(8).fill(null).map((_, rowIndex) => (
            Array(8).fill(null).map((_, colIndex) => (
              <div 
                key={`${rowIndex}-${colIndex}`} 
                className="aspect-square" 
                style={{backgroundColor: (rowIndex + colIndex) % 2 === 0 ? '#FFFFFF' : '#000000'}}
              ></div>
            ))
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Meet Our Champions</h2>
          <p className="max-w-2xl mx-auto text-lg text-primary/70">Recognizing the talented players who represent our chess society in tournaments.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            // Loading skeletons
            Array(4).fill(null).map((_, i) => (
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
          ) : (
            members.slice(0, 4).map((member) => (
              <div key={member.id} className="glass rounded-xl p-6 text-center transition-transform duration-300 hover:scale-105">
                <img 
                  src={member.photoUrl} 
                  alt={`${member.name}, ${member.role}`} 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover object-center border-4 border-accent" 
                />
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-primary/70 mb-3">{member.role}</p>
                <div className="flex justify-center mb-4">
                  <span className="px-3 py-1 bg-primary/10 rounded-full text-sm">ELO {member.eloRating}</span>
                </div>
                <p className="text-sm mb-4">{member.bio}</p>
                <div className="flex justify-center space-x-3">
                  {member.socialLinks.linkedin && (
                    <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent transition-colors">
                      <i className="ri-linkedin-fill text-xl"></i>
                    </a>
                  )}
                  {member.socialLinks.twitter && (
                    <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent transition-colors">
                      <i className="ri-twitter-fill text-xl"></i>
                    </a>
                  )}
                  {member.socialLinks.chess && (
                    <a href={member.socialLinks.chess} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent transition-colors">
                      <i className="ri-chess-fill text-xl"></i>
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/members" className="inline-flex items-center space-x-2 px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-colors rounded-lg font-medium">
            <span>View All Members</span>
            <i className="ri-group-line"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
