import { useState, useEffect } from "react";
import { Link } from "wouter";

import Footer from "@/components/ChessSections/Footer";
import eventsData from "@/data/events.json";
import { format } from "date-fns";

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

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  // Initialize animations and load data
  useEffect(() => {
    // Sort events by date - upcoming events first
    const sortedEvents = [...eventsData].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    setEvents(sortedEvents);
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

  // Get all unique event types for filtering
  const allEventTypes = eventsData.map(event => event.type);
  const uniqueEventTypes = Array.from(new Set(allEventTypes));
  const eventTypes = ["all", ...uniqueEventTypes];

  // Filter events based on selection
  const filteredEvents = filter === "all"
    ? events
    : events.filter(event => event.type === filter);

  // Format date for display
  const formatEventDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  return (
    <>
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scrolled-fade-in">
            <h1 className="text-3xl md:text-5xl font-bold font-display mb-4">Chess Society Events</h1>
            <p className="max-w-2xl mx-auto text-lg text-primary/70">
              Join us for tournaments, workshops, and social gatherings throughout the academic year.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10 scrolled-fade-in">
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === type
                    ? 'bg-primary text-white dark:bg-accent dark:text-primary'
                    : 'bg-primary/10 dark:bg-primary/5 text-primary dark:text-primary/90 hover:bg-primary/20 dark:hover:bg-primary/10'
                  }`}
              >
                {type === "all" ? "All Events" : type}
              </button>
            ))}
          </div>

          {/* Event grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {isLoading ? (
              // Loading skeletons
              Array(6).fill(0).map((_, i) => (
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
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="glass rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 scrolled-fade-in flex flex-col"
                >
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className={`inline-block px-3 py-1 ${
                          event.type === 'Tournament' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' : 
                          event.type === 'Workshop' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                          event.type === 'Regular' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' :
                          event.type === 'Social' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                          event.type === 'Special' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                        } text-sm font-medium rounded-full border border-transparent dark:border-opacity-10`}>
                          {event.type}
                        </span>
                        <h3 className="mt-3 text-xl font-bold">{event.title}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-300">{formatEventDate(event.date)}</div>
                        <div className="text-sm font-medium">{event.timeStart} - {event.timeEnd}</div>
                      </div>
                    </div>

                    <p className="mb-4 line-clamp-3">{event.description}</p>

                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-primary/10">
                      <div className="flex items-center space-x-1">
                        <i className="ri-map-pin-line text-accent"></i>
                        <span className="text-sm">{event.location}</span>
                      </div>
                      <Link
                        href={`/event/${event.id}`}
                        className="text-accent dark:text-accent hover:text-secondary dark:hover:text-secondary/80 transition-colors font-medium"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-gray-800 dark:text-gray-200">No events found for this filter.</p>
                <button
                  onClick={() => setFilter("all")}
                  className="mt-4 px-4 py-2 bg-primary dark:bg-accent text-white dark:text-primary rounded-md hover:bg-primary/90 dark:hover:bg-accent/90 transition-colors"
                >
                  View All Events
                </button>
              </div>
            )}
          </div>

          {/* Calendar integration */}
          <div className="text-center mt-16 mb-12 scrolled-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">Get Notified About Upcoming Events</h2>
            <p className="max-w-2xl mx-auto mb-8">
              Subscribe to our newsletter or follow our social media channels to stay updated about all our upcoming events.
            </p>
            <Link href="/contact" className="inline-flex items-center space-x-2 px-6 py-3 bg-primary dark:bg-accent text-white dark:text-primary hover:bg-primary/90 dark:hover:bg-accent/90 transition-colors rounded-lg font-medium shadow-sm hover:shadow-md">
              <span>Join Our Newsletter</span>
              <i className="ri-mail-line ml-2"></i>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
