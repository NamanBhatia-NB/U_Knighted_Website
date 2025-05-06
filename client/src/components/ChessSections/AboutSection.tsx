import { useQuery } from "@tanstack/react-query";

interface SocietyStats {
  members: number;
  tournaments: number;
  championships: number;
}

export default function AboutSection() {
  const { data: stats = { members: 120, tournaments: 15, championships: 8 } } = useQuery<SocietyStats>({
    queryKey: ['/api/society/stats'],
  });
  
  return (
    <section id="about" className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">About Our Chess Society</h2>
            <p className="mb-4 text-lg">Founded in 2005, the University Chess Society has grown into a vibrant community where chess enthusiasts of all skill levels can learn, practice, and compete.</p>
            <p className="mb-6 text-lg">Our mission is to promote chess culture on campus, provide training resources, and organize tournaments that challenge and inspire our members.</p>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="glass p-4 rounded-lg">
                <div className="text-accent text-3xl mb-2">
                  <i className="ri-group-line"></i>
                </div>
                <h3 className="font-bold text-xl mb-2">{stats?.members || '120+' }</h3>
                <p className="text-primary/70">Active Members</p>
              </div>
              <div className="glass p-4 rounded-lg">
                <div className="text-accent text-3xl mb-2">
                  <i className="ri-trophy-line"></i>
                </div>
                <h3 className="font-bold text-xl mb-2">{stats?.tournaments || '15+'}</h3>
                <p className="text-primary/70">Tournaments Yearly</p>
              </div>
              <div className="glass p-4 rounded-lg">
                <div className="text-accent text-3xl mb-2">
                  <i className="ri-medal-line"></i>
                </div>
                <h3 className="font-bold text-xl mb-2">{stats?.championships || '8'}</h3>
                <p className="text-primary/70">Regional Championships</p>
              </div>
              <div className="glass p-4 rounded-lg">
                <div className="text-accent text-3xl mb-2">
                  <i className="ri-calendar-event-line"></i>
                </div>
                <h3 className="font-bold text-xl mb-2">Weekly</h3>
                <p className="text-primary/70">Club Meetings</p>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1567175220912-c8791c83ba1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Students playing chess in a modern club setting" 
                className="rounded-lg shadow-xl w-full" 
              />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent rounded-lg flex items-center justify-center shadow-lg">
                <span className="font-display font-bold text-primary text-xl">Since<br/>2005</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
