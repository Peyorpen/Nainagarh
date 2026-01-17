import React, { useState } from 'react';
import { Send, Users, User, Phone, Mail, Calendar, MessageSquare } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { sendReceptionNotification } from '../services/emailService';

export const Banquets: React.FC = () => {
  const { banquets, addInquiry } = useData();
  const [submitted, setSubmitted] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedVenue, setSelectedVenue] = useState(banquets[0]?.name || '');
  const [eventType, setEventType] = useState('Wedding Ceremony');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const inquiryDetails = `${eventType} at ${selectedVenue} for ${guests} guests on ${date}. Notes: ${details}`;
    
    addInquiry({
        name,
        phone,
        email,
        type: 'Banquet',
        details: inquiryDetails
    });

    // Notify Reception
    await sendReceptionNotification({
      type: 'INQUIRY',
      guestName: name,
      details: inquiryDetails,
      contact: `${email} | ${phone}`
    });

    setSubmitted(true);
    setTimeout(() => {
        setSubmitted(false);
        setName('');
        setPhone('');
        setEmail('');
        setDate('');
        setGuests('');
        setDetails('');
    }, 5000);
  };

  const inputClass = "w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-200 ease-in-out pl-11";
  const selectClass = "w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-200 ease-in-out appearance-none cursor-pointer";
  const labelClass = "block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2";

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="relative h-[500px]">
        <img 
          src="https://images.unsplash.com/photo-1519225421980-715cb0202128?q=80&w=2070&auto=format&fit=crop" 
          alt="Banquet Hall" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-rose-950 via-rose-950/40 to-transparent flex items-end justify-center pb-20">
          <div className="text-center text-white px-4 max-w-4xl">
            <h2 className="font-serif text-5xl md:text-6xl mb-4 drop-shadow-lg">Royal Weddings & Events</h2>
            <p className="text-xl md:text-2xl font-light text-amber-100 drop-shadow-md">Where timeless traditions meet grand celebrations in the heart of Varanasi</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 -mt-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Info Side */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-stone-100">
               <h3 className="font-serif text-3xl text-rose-950 mb-6 pb-4 border-b border-stone-100">Our Royal Venues</h3>
               <div className="space-y-6">
                {banquets.map((venue) => (
                  <div 
                    key={venue.id} 
                    className={`flex flex-col sm:flex-row gap-5 p-4 rounded-xl transition-all duration-300 cursor-pointer border ${selectedVenue === venue.name ? 'bg-rose-50 border-rose-200 shadow-md ring-1 ring-rose-200' : 'bg-white border-stone-100 hover:border-rose-100 hover:shadow-md'}`}
                    onClick={() => setSelectedVenue(venue.name)}
                  >
                    <img src={venue.image} alt={venue.name} className="w-full sm:w-28 h-28 object-cover rounded-lg" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                          <h4 className="font-serif text-xl font-bold text-rose-950 mb-1">{venue.name}</h4>
                          {selectedVenue === venue.name && <span className="w-3 h-3 bg-rose-500 rounded-full mt-1.5"></span>}
                      </div>
                      <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase mb-2">
                        <Users size={14} /> {venue.capacity}
                      </div>
                      <p className="text-stone-600 text-sm leading-relaxed">{venue.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 p-8 rounded-2xl border border-amber-100 shadow-sm">
              <h4 className="font-serif font-bold text-2xl text-rose-900 mb-3">Our Promise</h4>
              <p className="text-stone-700 italic text-lg leading-relaxed">"We don't just host events; we craft royal legacies with impeccable hospitality, ensuring every moment is etched in history."</p>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl border border-stone-100 sticky top-24">
            <h3 className="font-serif text-3xl text-rose-950 mb-2">Inquire Now</h3>
            <p className="text-stone-500 mb-8">Begin planning your event with our specialists.</p>
            
            {submitted ? (
               <div className="h-96 flex flex-col items-center justify-center text-center py-10 animate-fade-in">
                 <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                   <Send className="text-amber-600 w-10 h-10" />
                 </div>
                 <h4 className="text-2xl font-serif text-gray-800 mb-2">Inquiry Sent Successfully</h4>
                 <p className="text-gray-500">Our event specialists will contact you within 24 hours to discuss your royal celebration.</p>
               </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-3.5 text-stone-400" size={18} />
                        <input 
                            type="text" required className={inputClass} 
                            placeholder="Your Name" 
                            value={name} onChange={e => setName(e.target.value)}
                        />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-3.5 text-stone-400" size={18} />
                        <input 
                            type="tel" required className={inputClass} 
                            placeholder="+91..." 
                            value={phone} onChange={e => setPhone(e.target.value)}
                        />
                    </div>
                  </div>
                </div>

                <div>
                   <label className={labelClass}>Email Address</label>
                   <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-stone-400" size={18} />
                        <input 
                            type="email" required className={inputClass} 
                            placeholder="name@company.com" 
                            value={email} onChange={e => setEmail(e.target.value)}
                        />
                   </div>
                </div>

                <div>
                  <label className={labelClass}>Interested Venue</label>
                  <select 
                    value={selectedVenue}
                    onChange={(e) => setSelectedVenue(e.target.value)}
                    className={selectClass}
                  >
                    {banquets.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Event Type</label>
                    <select 
                        className={selectClass}
                        value={eventType} onChange={e => setEventType(e.target.value)}
                    >
                      <option>Wedding Ceremony</option>
                      <option>Reception</option>
                      <option>Corporate Event</option>
                      <option>Birthday / Anniversary</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Date</label>
                    <div className="relative">
                        <input 
                            type="date" className={`${inputClass} pl-4`} // standard padding for date
                            value={date} onChange={e => setDate(e.target.value)}
                        />
                    </div>
                  </div>
                </div>
                 
                <div>
                  <label className={labelClass}>Est. Guests</label>
                  <div className="relative">
                        <Users className="absolute left-4 top-3.5 text-stone-400" size={18} />
                        <input 
                            type="number" className={inputClass} 
                            placeholder="e.g. 500" 
                            value={guests} onChange={e => setGuests(e.target.value)}
                        />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Special Requirements</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 text-stone-400" size={18} />
                    <textarea 
                        rows={3} className={`${inputClass} pl-11`}
                        placeholder="Tell us about your dream event..."
                        value={details} onChange={e => setDetails(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <button type="submit" className="w-full py-4 bg-rose-900 text-white font-serif uppercase tracking-widest hover:bg-rose-800 transition-all shadow-lg hover:shadow-xl rounded-lg transform hover:-translate-y-1 mt-2">
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};