import { useState, useEffect } from "react";
import { Link } from "wouter";

import Footer from "@/components/ChessSections/Footer";
import newsData from "@/data/news.json";
import { format } from "date-fns";

interface News {
  id: number;
  title: string;
  tag: string;
  date: string;
  content: string;
  imageUrl?: string;
}

export default function News() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    // Sort news by date - newest first
    const sortedNews = [...newsData].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    setNews(sortedNews);
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

  // Get unique tags for filtering
  const allNewsTags = newsData.map(item => item.tag);
  const uniqueTags = Array.from(new Set(allNewsTags));
  const allTags = ["all", ...uniqueTags];
  
  // Filter news based on selection
  const filteredNews = filter === "all" 
    ? news
    : news.filter(item => item.tag === filter);
    
  // Format date for display
  const formatNewsDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  return (
    <>
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scrolled-fade-in">
            <h1 className="text-3xl md:text-5xl font-bold font-display mb-4">Chess Society News</h1>
            <p className="max-w-2xl mx-auto text-lg text-primary/70">
              Stay updated with tournament results, chess insights, and society achievements.
            </p>
          </div>
          
          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10 scrolled-fade-in">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === tag 
                    ? 'bg-primary text-white' 
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
              >
                {tag === "all" ? "All News" : tag}
              </button>
            ))}
          </div>
          
          {/* Featured news (first item) */}
          {!isLoading && filteredNews.length > 0 && (
            <div className="mb-12 scrolled-fade-in">
              <div className="rounded-xl overflow-hidden relative md:h-96 shadow-xl">
                <img 
                  src={filteredNews[0].imageUrl || "https://via.placeholder.com/1200x600"} 
                  alt={filteredNews[0].title} 
                  className="w-full h-full object-cover md:aspect-[2/1]" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-accent text-primary text-sm font-medium rounded-full">
                      {filteredNews[0].tag}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{filteredNews[0].title}</h2>
                  <p className="text-white/80 mb-4 max-w-3xl">{filteredNews[0].content.substring(0, 150)}...</p>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">{formatNewsDate(filteredNews[0].date)}</span>
                    <Link href={`/news/${filteredNews[0].id}`} className="text-accent hover:text-white transition-colors font-medium">
                      Read Full Article →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Rest of the news grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {isLoading ? (
              // Loading skeletons
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="glass rounded-xl overflow-hidden shadow-lg animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded w-1/4 mb-3"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/5"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : filteredNews.length > 1 ? (
              // Skip the first news item as it's featured above
              filteredNews.slice(1).map((item) => (
                <div key={item.id} className="glass rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 scrolled-fade-in">
                  {item.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-3">
                      <span className={`inline-block px-3 py-1 ${
                        item.tag === 'Tournament Result' ? 'bg-primary text-white' : 
                        item.tag === 'Society News' ? 'bg-accent text-primary' : 
                        item.tag === 'Community Outreach' ? 'bg-blue-500 text-white' :
                        item.tag === 'Tournament News' ? 'bg-purple-500 text-white' :
                        item.tag === 'Educational' ? 'bg-green-500 text-white' :
                        item.tag === 'Charity Event' ? 'bg-red-500 text-white' :
                        'bg-secondary text-white'
                      } text-sm font-medium rounded-full`}>
                        {item.tag}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-primary/70 mb-4 line-clamp-3">{item.content}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-primary/60 text-sm">{formatNewsDate(item.date)}</span>
                      <Link href={`/news/${item.id}`} className="text-accent hover:text-secondary transition-colors font-medium">
                        Read More →
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : filteredNews.length === 1 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-lg">No additional news articles found for this filter.</p>
              </div>
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-xl">No news found for this filter.</p>
                <button 
                  onClick={() => setFilter("all")} 
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  View All News
                </button>
              </div>
            )}
          </div>
          
          {/* Subscribe banner */}
          <div className="glass rounded-xl p-8 md:p-12 text-center mt-16 mb-12 scrolled-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">Get Chess Society Updates</h2>
            <p className="max-w-2xl mx-auto mb-8">
              Subscribe to our newsletter to receive the latest news, tournament announcements, and event invitations.
            </p>
            <Link href="/contact" className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white hover:bg-primary/90 transition-colors rounded-lg font-medium">
              <span>Subscribe Now</span>
              <i className="ri-mail-line"></i>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
