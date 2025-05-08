import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { format } from "date-fns";

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
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (params?.id) {
      try {
        const eventId = parseInt(params.id);

        const foundEvent = eventsData.find(e => e.id === eventId);

        if (foundEvent) {
          setEvent(foundEvent);
        } else {
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
        <div className="container mx-auto px-4 py-32">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-accent"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (notFound) {
    return (
      <>
        <div className="container mx-auto px-4 py-32">
          <div className="text-center py-16">
            <h1 className="text-4xl font-bold font-display mb-4">Event Not Found</h1>
            <p className="mb-8 text-gray-600 dark:text-gray-300">Sorry, the event you're looking for doesn't exist or has been removed.</p>
            <Link href="/events" className="bg-primary hover:bg-primary/90 active:bg-primary/80 text-white px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg">
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

  // Determine event type color with dark mode support
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "Tournament":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 border border-transparent dark:border-blue-800/20";
      case "Workshop":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border border-transparent dark:border-green-800/20";
      case "Regular":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 border border-transparent dark:border-purple-800/20";
      case "Social":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 border border-transparent dark:border-yellow-800/20";
      case "Special":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100 border border-transparent dark:border-indigo-800/20";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 border border-transparent dark:border-gray-700/20";
    }
  };

  return (
    <>
      <main className="container mx-auto px-4 py-32">
        {event && (
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <Link href="/events" className="text-primary dark:text-accent hover:text-accent/80 dark:hover:text-accent/80 transition-colors mb-4 md:mb-0 inline-flex items-center">
                <i className="ri-arrow-left-line mr-2"></i>
                Back to All Events
              </Link>
              <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.type)}`}>
                {event.type}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold font-display mb-4">{event.title}</h1>

            <div className="flex flex-col md:flex-row md:items-center mb-8 text-gray-600 dark:text-gray-300">
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

            <div className="theme-card p-8 rounded-xl mb-8">
              <h2 className="text-xl font-bold mb-4">About This Event</h2>
              <p className="text-lg whitespace-pre-line">{event.description}</p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.date.replace(/-/g, '')}T${event.timeStart.replace(':', '')}00/${event.date.replace(/-/g, '')}T${event.timeEnd.replace(':', '')}00&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent hover:bg-accent/90 active:bg-accent/80 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center justify-center shadow-md hover:shadow-lg transition-all"
              >
                <i className="ri-calendar-check-line mr-2"></i>
                Add to Calendar
              </a>
              <Link
                href="/join"
                className="border border-primary dark:border-primary/50 text-primary dark:text-primary/90 hover:bg-primary/10 dark:hover:bg-primary/20 px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
              >
                <i className="ri-user-add-line mr-2"></i>
                Join the Society
              </Link>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700/30 pt-8">
              <h2 className="text-xl font-bold mb-4">Can't Make It?</h2>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Don't worry if you can't attend this event. Check out our other upcoming events or join our newsletter to stay updated.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/events"
                  className="text-primary dark:text-accent hover:text-accent dark:hover:text-accent/80 transition-colors inline-flex items-center"
                >
                  <i className="ri-calendar-line mr-2"></i>
                  View All Events
                </Link>
                <Link
                  href="/contact"
                  className="text-primary dark:text-accent hover:text-accent dark:hover:text-accent/80 transition-colors inline-flex items-center"
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