import ContactForm from "@/components/forms/ContactForm";

export default function ContactSection() {
  return (
    <section id="contact" className="bg-primary text-white !border-none ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="scrolled-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">Get In Touch</h2>
            <p className="mb-8 text-white/80 text-lg">Have questions about our chess society? We're here to help! Reach out to us using the contact form or through our social media channels.</p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary">
                  <i className="ri-map-pin-line text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold">Location</h3>
                  <p className="text-white/70">Student Union Building, Room 305<br/>University Campus</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary">
                  <i className="ri-time-line text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold">Meeting Times</h3>
                  <p className="text-white/70">Thursdays: 7:00 PM - 10:00 PM<br/>Saturdays: 2:00 PM - 6:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary">
                  <i className="ri-mail-line text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold">Email</h3>
                  <p className="text-white/70">chess@university.edu</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors">
                <i className="ri-instagram-fill text-xl"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors">
                <i className="ri-discord-fill text-xl"></i>
              </a>
            </div>
          </div>
          
          <div className="glass rounded-xl p-8 bg-white/10 shadow-lg scrolled-fade-in">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
