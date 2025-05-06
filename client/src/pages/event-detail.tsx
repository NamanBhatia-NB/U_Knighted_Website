import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/ChessSections/Footer";
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

export default function EventDetail() {
  // Ensure the route matches exactly what's in App.tsx
  const [match, params] = useRoute('/event/:id');
  console.log("Route match:", match, "params:", params);
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  useEffect(() => {
    console.log("Event detail page mounted, params:", params);
    
    if (params?.id) {
      try {
        const eventId = parseInt(params.id);
        console.log("Looking for event with ID:", eventId);
        console.log("Available events:", eventsData);
        
        const foundEvent = eventsData.find(e => e.id === eventId);
        
        if (foundEvent) {
          console.log("Found event:", foundEvent);
          setEvent(foundEvent);
        } else {
          console.log("No event found with ID:", eventId);
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error parsing event ID:", error);
        setNotFound(true);
      }
      
      setIsLoading(false);
    }
  }, [params?.id]);
  
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-32">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  if (notFound) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-32">
          <div className="text-center py-16">
            <h1 className="text-4xl font-bold font-display mb-4">Event Not Found</h1>
            <p className="mb-8">Sorry, the event you're looking for doesn't exist or has been removed.</p>
            <Link href="/events" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-accent hover:text-primary transition-colors">
              Back to Events
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  // Format the date for display
  const formattedDate = event ? format(new Date(event.date), "MMMM d, yyyy") : "";
  
  // Determine event type color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "Tournament":
        return "bg-accent text-primary";
      case "Workshop":
        return "bg-primary text-white";
      case "Regular":
        return "bg-blue-500 text-white";
      case "Social":
        return "bg-green-500 text-white";
      case "Special":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-32">
        {event && (
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <Link href="/events" className="text-primary hover:text-accent transition-colors mb-4 md:mb-0 inline-flex items-center">
                <i className="ri-arrow-left-line mr-2"></i>
                Back to All Events
              </Link>
              <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.type)}`}>
                {event.type}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-4">{event.title}</h1>
            
            <div className="flex flex-col md:flex-row md:items-center mb-8 text-primary/70">
              <div className="flex items-center mr-6 mb-2 md:mb-0">
                <i className="ri-calendar-line mr-2 text-accent"></i>
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center mr-6 mb-2 md:mb-0">
                <i className="ri-time-line mr-2 text-accent"></i>
                <span>{event.timeStart} - {event.timeEnd}</span>
              </div>
              <div className="flex items-center">
                <i className="ri-map-pin-line mr-2 text-accent"></i>
                <span>{event.location}</span>
              </div>
            </div>
            
            <div className="glass p-8 rounded-xl mb-8">
              <h2 className="text-xl font-bold mb-4">About This Event</h2>
              <p className="text-lg whitespace-pre-line">{event.description}</p>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <a 
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.date.replace(/-/g, '')}T${event.timeStart.replace(':', '')}00/${event.date.replace(/-/g, '')}T${event.timeEnd.replace(':', '')}00&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-accent hover:text-primary transition-colors text-center"
              >
                <i className="ri-calendar-check-line mr-2"></i>
                Add to Calendar
              </a>
              <Link 
                href="/join" 
                className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors text-center"
              >
                <i className="ri-user-add-line mr-2"></i>
                Join the Society
              </Link>
            </div>
            
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold mb-4">Can't Make It?</h2>
              <p className="mb-4">
                Don't worry if you can't attend this event. Check out our other upcoming events or join our newsletter to stay updated.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  href="/events" 
                  className="text-primary hover:text-accent transition-colors inline-flex items-center"
                >
                  <i className="ri-calendar-line mr-2"></i>
                  View All Events
                </Link>
                <Link 
                  href="/contact" 
                  className="text-primary hover:text-accent transition-colors inline-flex items-center"
                >
                  <i className="ri-mail-line mr-2"></i>
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}