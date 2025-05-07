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
        
        <div className="container mx-auto px-4 py-32">
          <div className="text-center py-16">
            <h1 className="text-4xl font-bold font-display mb-4">Article Not Found</h1>
            <p className="mb-8">Sorry, the article you're looking for doesn't exist or has been removed.</p>
            <Link href="/news" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-accent hover:text-primary transition-colors">
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
  
  // Determine news tag color
  const getNewsTagColor = (tag: string) => {
    switch (tag) {
      case "Tournament Result":
        return "bg-primary text-white";
      case "Society News":
        return "bg-accent text-primary";
      case "Community Outreach":
        return "bg-blue-500 text-white";
      case "Tournament News":
        return "bg-purple-500 text-white";
      case "Educational":
        return "bg-green-500 text-white";
      case "Charity Event":
        return "bg-red-500 text-white";
      default:
        return "bg-secondary text-white";
    }
  };
  
  return (
    <>
      
      <main className="container mx-auto px-4 py-32">
        {newsItem && (
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <Link href="/news" className="text-primary hover:text-accent transition-colors mb-4 md:mb-0 inline-flex items-center">
                <i className="ri-arrow-left-line mr-2"></i>
                Back to All News
              </Link>
              <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${getNewsTagColor(newsItem.tag)}`}>
                {newsItem.tag}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-4">{newsItem.title}</h1>
            
            <div className="text-primary/70 mb-8">
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
            
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold mb-4">Stay Updated</h2>
              <p className="mb-4">
                Join our newsletter to receive the latest news, tournament results, and chess tips.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  href="/news" 
                  className="text-primary hover:text-accent transition-colors inline-flex items-center"
                >
                  <i className="ri-newspaper-line mr-2"></i>
                  Browse More Articles
                </Link>
                <Link 
                  href="/contact" 
                  className="text-primary hover:text-accent transition-colors inline-flex items-center"
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