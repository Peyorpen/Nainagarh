import React, { useState } from 'react';
import { ViewState } from './types';
import { Menu, X, Hotel, Lock, Compass } from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface NavigationProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { generalInfo } = useData();

  const navItems = [
    { label: 'Home', view: ViewState.HOME },
    { label: 'Royal Rooms', view: ViewState.ROOMS },
    { label: 'Banquets', view: ViewState.BANQUETS },
    { label: 'The Darbar Dining', view: ViewState.DINING },
    { label: 'Kaashi Yaatra', view: ViewState.TOURS },
    { label: 'Varanasi Guide', view: ViewState.GUIDE },
    { label: 'Gallery', view: ViewState.GALLERY },
  ];

  const handleNav = (view: ViewState) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-rose-950 text-amber-50 shadow-md border-b border-amber-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => handleNav(ViewState.HOME)}
          >
            <Hotel className="h-8 w-8 text-amber-500 group-hover:text-amber-400 transition-colors" />
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-wider text-amber-100 group-hover:text-white transition-colors">{generalInfo.logoTitle}</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-amber-500 group-hover:text-amber-400 transition-colors">{generalInfo.logoSubtitle}</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNav(item.view)}
                className={`font-serif text-sm tracking-wide transition-all duration-300 hover:text-amber-400 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-amber-400 after:transition-all after:duration-300 hover:after:w-full ${
                  currentView === item.view ? 'text-amber-400 after:w-full' : 'text-stone-300'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="h-4 w-px bg-rose-800 mx-2"></div>
            <button 
              onClick={() => handleNav(ViewState.ADMIN_LOGIN)}
              className="text-stone-400 hover:text-white transition-colors p-2 hover:bg-rose-900 rounded-full"
              title="Staff Login"
            >
              <Lock size={16} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-amber-100 hover:text-amber-400 transition-colors"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-rose-900 border-t border-rose-800 absolute w-full shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNav(item.view)}
                className={`block w-full text-left px-3 py-4 rounded-md text-base font-serif font-medium border-l-4 transition-all ${
                  currentView === item.view ? 'bg-rose-950 text-amber-400 border-amber-400' : 'text-stone-300 border-transparent hover:bg-rose-800 hover:text-white hover:border-rose-600'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
                onClick={() => handleNav(ViewState.ADMIN_LOGIN)}
                className="block w-full text-left px-3 py-4 rounded-md text-base font-serif font-medium text-stone-400 hover:bg-rose-800 hover:text-white flex items-center gap-2"
              >
                <Lock size={16} /> Staff Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
