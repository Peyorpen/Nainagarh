import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Compass, Clock, Map, Sparkles, Car, ShoppingBag, MapPin, ArrowRight, Tag, Check, Info, Calendar } from 'lucide-react';
import { generateItinerary } from '../services/geminiService';
import { sendReceptionNotification } from '../services/emailService';

interface ToursProps {
  onNavigateToGuide: () => void;
}

export const Tours: React.FC<ToursProps> = ({ onNavigateToGuide }) => {
  const { tours, addBooking, coupons } = useData();
  const [activeTab, setActiveTab] = useState<'packages' | 'custom'>('packages');
  const [selectedTour, setSelectedTour] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedItinerary, setGeneratedItinerary] = useState('');
  const [loading, setLoading] = useState(false);

  // Coupon Logic
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const handleGenerate = async () => {
    if (!customPrompt) return;
    setLoading(true);
    const result = await generateItinerary(customPrompt);
    setGeneratedItinerary(result);
    setLoading(false);
  };

  const getFinalPrice = (base: number) => {
      if (!appliedCoupon) return base;
      if (appliedCoupon.type === 'PERCENT') return base * (1 - appliedCoupon.value / 100);
      return Math.max(0, base - appliedCoupon.value);
  };

  const handleBookTour = async (tourId: string, tourName: string, amount: number) => {
    const name = prompt("Please enter your name for booking:");
    if (name) {
        const finalPrice = getFinalPrice(amount);
        const tourDetails = `Tour Package: ${tourName}`;
        
        addBooking({
            customerName: name,
            type: 'Tour',
            date: new Date().toISOString().split('T')[0],
            amount: finalPrice,
            details: tourDetails,
            couponUsed: appliedCoupon?.code
        });

        await sendReceptionNotification({
          type: 'TOUR_BOOKING',
          guestName: name,
          details: tourDetails,
          amount: finalPrice
        });

        alert(`Booking request sent for ${tourName}! Our concierge will call you for confirmation.`);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="bg-rose-950 py-16 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
            <h2 className="font-serif text-5xl mb-4 tracking-wide">Kaashi Yaatra</h2>
            <p className="text-amber-100/80 max-w-xl mx-auto font-light">Spiritual journeys curated by royal historians to the heart of the eternal city.</p>
            <div className="flex justify-center gap-4 mt-8 flex-wrap px-4">
                <button onClick={() => setActiveTab('packages')} className={`px-6 py-2 rounded-full border transition-all ${activeTab === 'packages' ? 'bg-amber-600 border-amber-600' : 'border-amber-500/30 hover:bg-white/10'}`}>Signature Packages</button>
                <button onClick={() => setActiveTab('custom')} className={`px-6 py-2 rounded-full border transition-all ${activeTab === 'custom' ? 'bg-amber-600 border-amber-600' : 'border-amber-500/30 hover:bg-white/10'}`}>AI Trip Planner</button>
                <button onClick={onNavigateToGuide} className="px-6 py-2 rounded-full border border-white/30 hover:bg-white text-white hover:text-rose-950">Varanasi Local Guide</button>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {activeTab === 'packages' && (
          <div className="animate-fade-in">
            <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm border border-stone-200 mb-16">
                <div className="flex items-center gap-2 mb-3 text-rose-900 font-bold uppercase text-[10px] tracking-widest">
                    <Tag size={12} /> Special Offer?
                </div>
                <div className="flex gap-2">
                    <input className="flex-1 px-3 py-2 border rounded uppercase text-sm" placeholder="ENTER CODE" value={couponInput} onChange={e => setCouponInput(e.target.value)} />
                    <button onClick={() => {
                        const found = coupons.find(c => c.code === couponInput.toUpperCase());
                        setAppliedCoupon(found || null);
                    }} className="bg-stone-800 text-white px-4 py-2 rounded text-[10px] font-bold uppercase">Apply</button>
                </div>
                {appliedCoupon && <p className="text-green-600 text-[10px] mt-2 font-bold">Applied: {appliedCoupon.code}</p>}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {tours.map((tour) => (
                <div key={tour.id} className={`bg-white rounded-2xl overflow-hidden shadow-lg border transition-all duration-300 flex flex-col ${selectedTour === tour.id ? 'ring-2 ring-amber-500 border-amber-500' : 'border-stone-100'}`}>
                  <div className="relative h-56 overflow-hidden">
                    <img src={tour.image} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-rose-900 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">{tour.duration}</span>
                    </div>
                  </div>
                  <div className="p-8 flex-grow">
                    <h3 className="font-serif text-2xl font-bold text-rose-950 mb-3">{tour.name}</h3>
                    <p className="text-stone-500 text-sm mb-6 leading-relaxed">{tour.description}</p>
                    
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 text-xs text-stone-600">
                            <Car size={16} className="text-amber-600" /> <span>{tour.shuttle}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tour.places.map((p, i) => <span key={i} className="px-2 py-0.5 bg-stone-50 border border-stone-100 text-[10px] text-stone-600 rounded">{p}</span>)}
                        </div>
                    </div>

                    {selectedTour === tour.id && tour.itinerary && (
                        <div className="mb-8 p-4 bg-amber-50 rounded-xl animate-fade-in border border-amber-100">
                            <h4 className="text-[10px] font-bold uppercase mb-2 text-amber-800 flex items-center gap-1"><Calendar size={12}/> Sample Itinerary</h4>
                            <ul className="space-y-2">
                                {tour.itinerary.map((it, i) => (
                                    <li key={i} className="text-xs flex gap-2">
                                        <span className="font-bold text-amber-700 whitespace-nowrap">{it.time}:</span>
                                        <span className="text-stone-700">{it.activity}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-6 border-t mt-auto">
                        <div className="flex flex-col">
                            {appliedCoupon && <span className="text-[10px] line-through text-stone-300">₹{tour.price}</span>}
                            <span className="text-xl font-bold text-rose-950">₹{getFinalPrice(tour.price).toLocaleString()}</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setSelectedTour(selectedTour === tour.id ? null : tour.id)} className="p-2 border rounded-full hover:bg-stone-50 text-stone-400">
                                <Info size={18} />
                            </button>
                            <button onClick={() => handleBookTour(tour.id, tour.name, tour.price)} className="bg-rose-950 text-white px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-rose-900 shadow-md">Reserve</button>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'custom' && (
            <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-2xl border border-stone-100 text-center animate-fade-in">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="text-amber-600" size={28} />
                </div>
                <h3 className="font-serif text-3xl mb-4 text-rose-950">Bespoke Pilgrimage Planner</h3>
                <p className="text-stone-500 mb-8 font-light">Tell us your spiritual needs, and our royal AI concierge will craft an exclusive day-plan for you.</p>
                <textarea 
                    className="w-full p-5 bg-stone-50 border border-stone-200 rounded-2xl mb-6 text-sm focus:ring-2 focus:ring-amber-500/20 focus:outline-none placeholder-stone-400" 
                    placeholder="E.g., I'm interested in early morning Boat ride at 5 AM, Dashaswamedh Aarti, and visiting the Weaver's village in the afternoon..." 
                    rows={4} 
                    value={customPrompt} 
                    onChange={e => setCustomPrompt(e.target.value)} 
                />
                <button 
                    onClick={handleGenerate} 
                    disabled={loading || !customPrompt} 
                    className="w-full bg-rose-950 text-white py-4 rounded-xl font-serif text-lg tracking-widest hover:bg-rose-900 disabled:opacity-50 shadow-xl transition-all"
                >
                    {loading ? 'Consulting Royal Historians...' : 'Plan My Spiritual Journey'}
                </button>
                {generatedItinerary && (
                    <div className="mt-10 text-left p-8 bg-amber-50/50 rounded-2xl border border-amber-100 shadow-inner animate-fade-in text-stone-800 leading-relaxed text-sm">
                        <div className="flex items-center gap-2 mb-4 text-amber-700 font-bold uppercase tracking-widest text-[10px]">
                            <Compass size={14} /> Curated AI Itinerary
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: generatedItinerary }} />
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};
