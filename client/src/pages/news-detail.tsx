import { useState, useEffect } from "react";
import { Link, useRoute, useLocation } from "wouter";

import Footer from "@/components/ChessSections/Footer";
import { getNewsById } from "../data/newsItems";
import { format } from "date-fns";

interface News {
  id: number;
  title: string;
  tag: string;
  date: string;
  content: string;
  imageUrl?: string;
}

export default function NewsDetail() {
  // Ensure the route matches exactly what's in App.tsx
  const [match, params] = useRoute('/news/:id');
  const [newsItem, setNewsItem] = useState<News | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  // Get the current path
  const [location] = useLocation();
  
  useEffect(() => {
    
    if (params?.id) {
      try {
        const newsId = parseInt(params.id);
        
        const foundNews = getNewsById(newsId);
        
        if (foundNews) {
          setNewsItem(foundNews);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error parsing news ID:", error);
        setNotFound(true);
      }
      
      setIsLoading(false);
    }
  }, [params?.id, location]);
  
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
            <h1 className="text-4xl font-bold font-display mb-4">Article Not Found</h1>
            <p className="mb-8 text-gray-600 dark:text-gray-300">Sorry, the article you're looking for doesn't exist or has been removed.</p>
            <Link href="/news" className="bg-primary dark:bg-accent text-white dark:text-primary px-6 py-3 rounded-lg hover:bg-primary/90 hover:text-white dark:hover:bg-accent/90 dark:hover:text-primary transition-all duration-200 shadow-sm hover:shadow-md">
              Back to News
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  // Format the date for display
  const formattedDate = newsItem ? format(new Date(newsItem.date), "MMMM d, yyyy") : "";
  
  // Determine news tag color with dark mode support
  const getNewsTagColor = (tag: string) => {
    switch (tag) {
      case "Tournament Result":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 border border-transparent dark:border-blue-800/20";
      case "Society News":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 border border-transparent dark:border-purple-800/20";
      case "Community Outreach":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border border-transparent dark:border-green-800/20";
      case "Tournament News":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100 border border-transparent dark:border-indigo-800/20";
      case "Educational":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 border border-transparent dark:border-yellow-800/20";
      case "Charity Event":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border border-transparent dark:border-red-800/20";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 border border-transparent dark:border-gray-700/20";
    }
  };
  
  return (
    <>
      <main className="container mx-auto px-4 py-32">
        {newsItem && (
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <Link href="/news" className="text-primary dark:text-accent hover:text-accent hover:underline dark:hover:text-accent/80 dark:hover:underline transition-all duration-200 mb-4 md:mb-0 inline-flex items-center">
                <i className="ri-arrow-left-line mr-2"></i>
                Back to All News
              </Link>
              <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${getNewsTagColor(newsItem.tag)}`}>
                {newsItem.tag}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-4">{newsItem.title}</h1>
            
            <div className="text-gray-600 dark:text-gray-300 mb-8">
              <span>{formattedDate}</span>
            </div>
            
            {newsItem.imageUrl && (
              <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={newsItem.imageUrl} 
                  alt={newsItem.title}
                  className="w-full h-auto"
                />
              </div>
            )}
            
            <div className="glass p-8 rounded-xl mb-8">
              <p className="text-lg whitespace-pre-line">{newsItem.content}</p>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700/30 pt-8">
              <h2 className="text-xl font-bold mb-4">Stay Updated</h2>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Join our newsletter to receive the latest news, tournament results, and chess tips.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  href="/news" 
                  className="text-primary dark:text-accent hover:text-accent hover:underline dark:hover:text-accent/80 dark:hover:underline transition-all duration-200 inline-flex items-center"
                >
                  <i className="ri-newspaper-line mr-2"></i>
                  Browse More Articles
                </Link>
                <Link 
                  href="/contact" 
                  className="text-primary dark:text-accent hover:text-accent hover:underline dark:hover:text-accent/80 dark:hover:underline transition-all duration-200 inline-flex items-center"
                >
                  <i className="ri-mail-line mr-2"></i>
                  Subscribe to Newsletter
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