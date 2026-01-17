import React, { useEffect, useState } from 'react';
import { ViewState } from '../types';
import { ArrowRight, UtensilsCrossed, Image as ImageIcon, Compass } from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface HeroProps {
  onNavigate: (view: ViewState) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { generalInfo } = useData();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="relative h-[calc(100vh-80px)] overflow-hidden bg-stone-900">
      {/* Background Image with Zoom Effect */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear ${loaded ? 'scale-110' : 'scale-100'}`}
        style={{ 
          backgroundImage: `url("${generalInfo.heroImage}")`,
        }}
      >
        <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black/90 via-black/40 to-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-center text-center px-4 z-10">
        <div className={`transition-all duration-1000 transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-[1px] w-12 bg-amber-500/50"></div>
                <span className="text-amber-400 uppercase tracking-[0.3em] text-xs md:text-sm font-medium">{generalInfo.heroSubtitle}</span>
                <div className="h-[1px] w-12 bg-amber-500/50"></div>
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight drop-shadow-2xl max-w-5xl mx-auto">
            {generalInfo.heroTitle}
            </h1>
            
            <p className="max-w-2xl mx-auto text-stone-200 text-lg md:text-xl mb-12 font-light leading-relaxed tracking-wide text-shadow">
            Experience the grandeur of Udaipur-style architecture nestled in the peaceful outskirts of the spiritual capital.
            </p>
        </div>
        
        <div className={`flex flex-col md:flex-row gap-4 w-full justify-center items-center flex-wrap max-w-5xl transition-all duration-1000 delay-300 transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <button 
            onClick={() => onNavigate(ViewState.ROOMS)}
            className="group w-full md:w-auto px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-serif tracking-wider text-sm uppercase rounded-sm transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-amber-600/30"
          >
            Book Your Stay <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={() => onNavigate(ViewState.DINING)}
            className="w-full md:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-serif tracking-wider text-sm uppercase rounded-sm transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2 border border-white/20 hover:border-white/40"
          >
            Fine Dining <UtensilsCrossed size={16} />
          </button>

          <button 
            onClick={() => onNavigate(ViewState.BANQUETS)}
            className="w-full md:w-auto px-8 py-4 bg-transparent border border-white/30 text-stone-200 hover:bg-white hover:text-rose-950 font-serif tracking-wider text-sm uppercase rounded-sm transition-all duration-300 backdrop-blur-sm"
          >
            Royal Weddings
          </button>

          <button 
            onClick={() => onNavigate(ViewState.TOURS)}
            className="w-full md:w-auto px-8 py-4 bg-transparent border border-white/30 text-stone-200 hover:bg-white hover:text-rose-950 font-serif tracking-wider text-sm uppercase rounded-sm transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2"
          >
            Kaashi Yaatra <Compass size={16} />
          </button>
          
          <button 
            onClick={() => onNavigate(ViewState.GALLERY)}
            className="w-full md:w-auto px-8 py-4 bg-transparent text-amber-100 hover:text-white font-serif tracking-wider text-sm uppercase rounded-sm transition-all duration-300 flex items-center justify-center gap-2 hover:bg-white/5"
          >
            Gallery <ImageIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};