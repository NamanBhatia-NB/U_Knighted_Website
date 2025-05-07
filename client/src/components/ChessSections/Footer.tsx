import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12 border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <i className="ri-chess-fill text-primary text-2xl"></i>
              </div>
              <span className="text-xl font-bold font-display">Chess Society</span>
            </div>
            <p className="text-white/70 mb-4">Promoting chess excellence and community on campus since 2005.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-accent transition-colors">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-accent transition-colors">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href="https://www.instagram.com/uknighted.chess/" target="_blank" className="text-white/70 hover:text-accent transition-colors">
                <i className="ri-instagram-fill text-xl"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-accent transition-colors">
                <i className="ri-discord-fill text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-white/70 hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/events" className="text-white/70 hover:text-accent transition-colors">Events</Link></li>
              <li><Link href="/members" className="text-white/70 hover:text-accent transition-colors">Members</Link></li>
              <li><Link href="/news" className="text-white/70 hover:text-accent transition-colors">News</Link></li>
              <li><Link href="/join" className="text-white/70 hover:text-accent transition-colors">Join Us</Link></li>
            </ul>
          </div>
          
          
          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-white/70 mb-4">Subscribe to receive updates about tournaments, events, and chess tips.</p>
            <form className="space-y-2" onSubmit={(e) => {
              e.preventDefault();
              const email = (e.target as HTMLFormElement).email.value;
              const name = "";

              if (!email) return;

              // Set button state
              const button = (e.target as HTMLFormElement).querySelector('button');
              if (button) {
                button.disabled = true;
                button.innerText = 'Subscribing...';
              }

              // Submit newsletter subscription
              fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name }),
              })
                .then((res) => {
                  if (!res.ok) {
                    if (res.status === 409) {
                      throw new Error('You are already subscribed to our newsletter');
                    }
                    throw new Error('Failed to subscribe. Please try again.');
                  }
                  return res.json();
                })
                .then(() => {
                  // Reset form
                  (e.target as HTMLFormElement).reset();
                  // Show success message
                  alert('Thank you for subscribing to our newsletter!');
                })
                .catch((error) => {
                  // Show error message
                  alert(error.message);
                })
                .finally(() => {
                  // Reset button state
                  if (button) {
                    button.disabled = false;
                    button.innerText = 'Subscribe';
                  }
                });
            }}>
              <input 
                name="email" 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:ring-2 focus:ring-accent focus:border-accent" 
                required 
              />
              <button 
                type="submit" 
                className="w-full bg-accent text-primary hover:bg-white transition-colors px-4 py-2 rounded-lg font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-white/10 text-center text-white/50 text-sm">
          <p>&copy; {new Date().getFullYear()} University Chess Society. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
