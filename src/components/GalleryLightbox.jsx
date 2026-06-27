import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function GalleryLightbox({ images, onClose, initialIndex = 0, location, productUsed }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToPrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') goToPrevious(e);
    if (e.key === 'ArrowRight') goToNext(e);
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors p-2"
        aria-label="Zavřít"
      >
        <X size={24} />
      </button>

      {/* Main image */}
      <div className="relative w-full h-full flex items-center justify-center px-4 sm:px-8">
        <img
          src={images[currentIndex]}
          alt={`Galerie ${currentIndex + 1}`}
          className="max-w-5xl max-h-[85vh] object-contain"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              aria-label="Předchozí"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              aria-label="Další"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}

        {/* Info footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 sm:p-8">
          <div className="max-w-5xl mx-auto">
            {(location || productUsed) && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  {location && (
                    <p className="text-white/60 text-sm font-mono tracking-widest uppercase mb-1">
                      Lokalita
                    </p>
                  )}
                  {location && <p className="text-white text-lg">{location}</p>}
                </div>
                <div className="text-right">
                  {productUsed && (
                    <p className="text-white/60 text-sm font-mono tracking-widest uppercase mb-1">
                      Použitá technologie
                    </p>
                  )}
                  {productUsed && <p className="text-cyan text-lg">{productUsed}</p>}
                </div>
              </div>
            )}
            {images.length > 1 && (
              <p className="text-white/40 text-xs mt-4 text-center">
                {currentIndex + 1} / {images.length}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}