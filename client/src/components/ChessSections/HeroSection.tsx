import { Link } from "wouter";
import ChessBoard3D from "@/components/ChessBoard3D";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* 3D Chess Visualization */}
      <ChessBoard3D />
      
      {/* Hero Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 text-primary">
            Master the Game <br/>
            <span className="text-accent">Elevate Your Mind</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-primary/80">
            Join our university's premier chess community where strategy meets passion, and champions are made move by move.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/join" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-accent hover:text-primary transition-colors text-center font-medium">
              Join the Society
            </Link>
            <Link href="/events" className="bg-transparent border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors text-center font-medium">
              Upcoming Events
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
      <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 z-10">
        <a href="#about" className="text-primary/70 hover:text-accent transition-colors">
          <i className="ri-arrow-down-line text-3xl animate-bounce"></i>
        </a>
      </div>
    </section>
  );
}
