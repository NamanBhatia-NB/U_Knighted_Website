import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface News {
  id: number;
  title: string;
  tag: string;
  date: string;
  content: string;
  imageUrl?: string;
}

export default function NewsSection() {
  const { data: news = [], isLoading } = useQuery<News[]>({
    queryKey: ['/api/news'],
  });

  // Get featured news (first item) and remaining news (next two items)
  const featuredNews = news.length > 0 ? news[0] : null;
  const remainingNews = news.slice(1, 3);

  return (
    <section id="news" className="py-20 md:py-32 bg-primary/5 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 scrolled-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Latest News</h2>
          <p className="max-w-2xl mx-auto text-lg text-primary/70">Stay updated with tournament results, chess insights, and society achievements.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            <>
              {/* Loading state for featured news */}
              <div className="col-span-1 md:col-span-2 animate-pulse">
                <div className="rounded-xl overflow-hidden relative h-96">
                  <div className="w-full h-full bg-gray-300"></div>
                </div>
              </div>
              
              {/* Loading state for other news */}
              <div className="col-span-1 space-y-8">
                <div className="glass rounded-xl overflow-hidden shadow-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-3"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/5"></div>
                  </div>
                </div>
                
                <div className="glass rounded-xl overflow-hidden shadow-lg p-6 animate-pulse">
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
            </>
          ) : (
            <>
              {featuredNews && (
                <div className="col-span-1 md:col-span-2 scrolled-fade-in">
                  <div className="rounded-xl overflow-hidden relative h-96 group">
                    <img 
                      src={featuredNews.imageUrl || "https://pixabay.com/get/gf16b117048141a22f28c2622ff499a44427e5cbf5851a86ad36ea26547d670735bd5774a420448b76053a9332f4bd912865b1b1d847851d6dc8880be64215227_1280.jpg"} 
                      alt={featuredNews.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-accent text-primary text-sm font-medium rounded-full">{featuredNews.tag}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{featuredNews.title}</h3>
                      <p className="text-white/80 mb-4">{featuredNews.content.substring(0, 100)}...</p>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm">{featuredNews.date}</span>
                        <Link href={`/news/${featuredNews.id}`} className="text-accent hover:text-white transition-colors font-medium">Read More →</Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="col-span-1 space-y-8">
                {remainingNews.map((item) => (
                  <div key={item.id} className="glass rounded-xl overflow-hidden shadow-lg scrolled-fade-in">
                    <div className="p-6">
                      <div className="mb-3">
                        <span className={`inline-block px-3 py-1 ${
                          item.tag === 'Workshop' ? 'bg-primary text-white' : 
                          item.tag === 'Recognition' ? 'bg-secondary text-white' : 
                          'bg-accent text-primary'
                        } text-sm font-medium rounded-full`}>
                          {item.tag}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-primary/70 mb-4">{item.content.substring(0, 80)}...</p>
                      <div className="flex justify-between items-center">
                        <span className="text-primary/60 text-sm">{item.date}</span>
                        <Link href={`/news/${item.id}`} className="text-accent hover:text-secondary transition-colors font-medium">Read More →</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/news" className="inline-flex items-center space-x-2 px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-colors rounded-lg font-medium">
            <span>View All News</span>
            <i className="ri-newspaper-line"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
