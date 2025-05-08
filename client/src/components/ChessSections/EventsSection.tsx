import { useState, useEffect } from "react";
import { Link } from "wouter";
import eventsData from "@/data/events.json";

interface Event {
  id: number;
  title: string;
  type: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  description: string;
  location: string;
}

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Sort events by date - upcoming events first
    const sortedEvents = [...eventsData].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    setEvents(sortedEvents);
    setIsLoading(false);
  }, []);

  return (
    <section id="events" className="py-20 md:py-32 bg-primary/5 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 scrolled-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Upcoming Events</h2>
          <p className="max-w-2xl mx-auto text-lg text-primary/70">Join us for tournaments, workshops, and social gatherings throughout the academic year.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden shadow-lg h-64 animate-pulse">
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            events.slice(0, 3).map((event) => (
              <div key={event.id} className="glass rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 scrolled-fade-in">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`inline-block px-3 py-1 ${
                        event.type === 'Tournament' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' : 
                        event.type === 'Workshop' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                        event.type === 'Regular' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' :
                        event.type === 'Social' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100'
                      } text-sm font-medium rounded-full border border-transparent dark:border-opacity-10`}>
                        {event.type}
                      </span>
                      <h3 className="mt-3 text-xl font-bold">{event.title}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-primary/70">{event.date}</div>
                      <div className="text-sm font-medium">{event.timeStart} - {event.timeEnd}</div>
                    </div>
                  </div>
                  <p className="mb-4">{event.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <i className="ri-map-pin-line text-accent"></i>
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <Link href={`/event/${event.id}`} className="text-accent hover:text-secondary transition-colors font-medium">Details →</Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/events" className="inline-flex items-center space-x-2 px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-colors rounded-lg font-medium">
            View All Events
            <i className="ri-calendar-line ml-2"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
