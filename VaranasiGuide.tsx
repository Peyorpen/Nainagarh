import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { MapPin, Info, ArrowRight, Compass, ShoppingBag, Landmark } from 'lucide-react';

export const VaranasiGuide: React.FC = () => {
  const { varanasiSpots } = useData();
  const [filter, setFilter] = useState<'All' | 'Ghats & Temples' | 'Famous Shops' | 'Fleet Destinations'>('All');

  const filteredSpots = filter === 'All' ? varanasiSpots : varanasiSpots.filter(s => s.category === filter);

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Header */}
      <div className="relative h-[400px]">
        <img 
          src="https://images.unsplash.com/photo-1590050752117-23a9d7fc217c?q=80&w=2070&auto=format&fit=crop" 
          alt="Varanasi Ghats" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-rose-950/90 via-rose-950/40 to-transparent flex items-end justify-center pb-16">
          <div className="text-center text-white px-4">
            <h2 className="font-serif text-5xl md:text-6xl mb-4 drop-shadow-lg">Experience Varanasi</h2>
            <p className="text-xl font-light text-amber-100 max-w-2xl mx-auto drop-shadow-md">A royal guide to the soul of Kashi, curated by Nainagarh Palace.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
                { label: 'All Experiences', value: 'All', icon: Compass },
                { label: 'Ghats & Temples', value: 'Ghats & Temples', icon: Landmark },
                { label: 'Famous Shops', value: 'Famous Shops', icon: ShoppingBag },
                { label: 'Fleet Destinations', value: 'Fleet Destinations', icon: MapPin }
            ].map(item => (
                <button
                    key={item.value}
                    onClick={() => setFilter(item.value as any)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-serif text-sm transition-all ${
                        filter === item.value 
                        ? 'bg-rose-900 text-white shadow-xl transform scale-105' 
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                    }`}
                >
                    <item.icon size={16} />
                    {item.label}
                </button>
            ))}
        </div>

        {/* Spot Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSpots.map((spot) => (
            <div key={spot.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-stone-100 group hover:shadow-2xl transition-all duration-500 flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={spot.image} 
                  alt={spot.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-md ${
                        spot.category === 'Fleet Destinations' ? 'bg-amber-600' : spot.category === 'Famous Shops' ? 'bg-rose-700' : 'bg-stone-700'
                    }`}>
                        {spot.category}
                    </span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-rose-900 mb-3">
                    <MapPin size={16} className="text-amber-600" />
                    <span className="text-xs font-bold uppercase tracking-wider">{spot.location}</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-rose-950 mb-4">{spot.name}</h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6 flex-grow">{spot.description}</p>
                
                {spot.category === 'Fleet Destinations' && (
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mb-6">
                        <p className="text-[10px] text-amber-800 font-bold uppercase flex items-center gap-2 tracking-widest">
                            <Compass size={12} /> Part of Our Tour Fleet Journey
                        </p>
                    </div>
                )}
                
                <button className="flex items-center gap-2 text-amber-700 font-serif font-bold text-sm hover:text-amber-800 group transition-colors">
                    Learn More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};