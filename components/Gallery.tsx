import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { X, ZoomIn } from 'lucide-react';

export const Gallery: React.FC = () => {
  const { gallery } = useData();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(gallery.map(img => img.category)))];

  const filteredImages = selectedCategory === 'All' 
    ? gallery 
    : gallery.filter(img => img.category === selectedCategory);

  return (
    <div className="bg-stone-50 min-h-screen">
       <div className="bg-rose-950 text-white py-12 text-center">
        <h2 className="font-serif text-4xl mb-4">Digital Gallery</h2>
        <p className="text-stone-300 max-w-xl mx-auto">A visual journey through the splendor of Nainagarh Palace.</p>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-serif tracking-wide text-sm transition-all ${
                selectedCategory === cat 
                  ? 'bg-amber-600 text-white shadow-lg' 
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((img, idx) => (
            <div 
              key={img.id} 
              className="group relative h-72 rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300"
              onClick={() => setSelectedImage(img.src)}
            >
              <img 
                src={img.src} 
                alt={img.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                 <div className="text-center">
                    <ZoomIn className="text-white w-8 h-8 mx-auto mb-2" />
                    <p className="text-white font-serif text-lg">{img.title}</p>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-amber-500 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <img 
            src={selectedImage} 
            alt="Full view" 
            className="max-w-full max-h-[90vh] object-contain rounded-sm shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
