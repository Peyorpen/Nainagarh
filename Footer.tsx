import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-serif text-2xl text-amber-100 mb-4">Nainagarh Palace</h3>
          <p className="text-sm leading-relaxed mb-6">
            A luxury heritage resort blending the architectural grandeur of Udaipur with the spiritual tranquility of Varanasi.
          </p>
          <div className="flex space-x-4">
            <a href="https://instagram.com/nainagarh.palace" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors flex items-center gap-1">
              <Instagram size={20} /> <span className="text-xs">@nainagarh.palace</span>
            </a>
            <a href="#" className="hover:text-amber-500 transition-colors"><Facebook size={20} /></a>
            <a href="#" className="hover:text-amber-500 transition-colors"><Twitter size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-sm">Contact & Location</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-amber-600 mt-1 shrink-0" />
              <div>
                <p>Nainagarh Palace Hotel</p>
                <p>Muinuddinpur, Uttar Pradesh, India</p>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Nainagarh+Palace+Hotel+Muinuddinpur+Uttar+Pradesh" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:text-amber-500 text-xs mt-1 inline-flex items-center gap-1"
                >
                  View on Google Maps <ExternalLink size={10} />
                </a>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-amber-600 shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-amber-600 shrink-0" />
              <span>reservations@nainagarh.com</span>
            </li>
          </ul>
        </div>

        <div>
           <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-sm">Newsletter</h4>
           <p className="text-xs mb-4">Subscribe for exclusive offers and updates.</p>
           <div className="flex">
             <input type="email" placeholder="Your email" className="bg-stone-800 border-none rounded-l px-4 py-2 w-full focus:ring-1 focus:ring-amber-500 outline-none text-sm" />
             <button className="bg-amber-600 text-white px-4 py-2 rounded-r hover:bg-amber-700 text-sm">Join</button>
           </div>
        </div>
      </div>
      <div className="text-center text-xs text-stone-600 mt-12 pt-8 border-t border-stone-800">
        &copy; {new Date().getFullYear()} Nainagarh Palace. All rights reserved.
      </div>
    </footer>
  );
};