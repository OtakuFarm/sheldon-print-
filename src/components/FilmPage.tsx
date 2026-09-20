import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  ArrowRight,
  Camera,
  Film,
  Sparkles,
  SlidersHorizontal,
  ArrowUp,
  Mail,
  Check,
} from 'lucide-react';
import { FILM_PHOTOS, FilmPhoto } from '../data/filmPhotos';
import { ARTIST_INFO, PRINTS_DATA } from '../data/prints';
import { PrintItem } from '../types';

interface FilmPageProps {
  onNavigateToShop: () => void;
  onOpenCart: () => void;
  cartCount: number;
  onSelectPrint?: (print: PrintItem) => void;
}

type FormatFilter = 'all' | '120' | '35mm' | 'prints';

export const FilmPage: React.FC<FilmPageProps> = ({
  onNavigateToShop,
  onOpenCart,
  cartCount,
  onSelectPrint,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<FormatFilter>('all');

  // Filtered photos based on tab
  const filteredPhotos = useMemo(() => {
    return FILM_PHOTOS.filter((photo) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === '120') return photo.format?.includes('120');
      if (activeFilter === '35mm') return photo.format?.includes('35mm');
      if (activeFilter === 'prints') return Boolean(photo.matchingPrintId);
      return true;
    });
  }, [activeFilter]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') {
        setSelectedPhotoIndex(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) =>
          prev !== null ? (prev + 1) % filteredPhotos.length : 0
        );
      } else if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) =>
          prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : 0
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, filteredPhotos.length]);

  const activePhoto =
    selectedPhotoIndex !== null && filteredPhotos[selectedPhotoIndex]
      ? filteredPhotos[selectedPhotoIndex]
      : null;

  const activeMatchingPrint = activePhoto?.matchingPrintId
    ? PRINTS_DATA.find((p) => p.id === activePhoto.matchingPrintId)
    : null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) =>
      prev !== null ? (prev + 1) % filteredPhotos.length : 0
    );
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) =>
      prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : 0
    );
  };

  return (
    <div
      id="film-page"
      className="min-h-screen bg-[#0d0e12] text-white flex flex-col selection:bg-amber-400 selection:text-black"
    >
      {/* 1. Header (Unified site styling with Anton branding & navigation) */}
      <header
        id="film-navbar"
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300 backdrop-blur-md bg-black/60 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onNavigateToShop}
              className="flex items-baseline gap-2 group text-white no-underline text-left cursor-pointer"
            >
              <span
                className="text-lg sm:text-2xl font-black tracking-tight"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                SHELDON RUDDOCK
              </span>
              <span className="text-[10px] sm:text-xs tracking-widest text-white/60 uppercase font-mono">
                / STUDIO & SHOP
              </span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs lg:text-sm font-semibold tracking-wider uppercase text-white/90">
            <button
              id="film-nav-to-shop"
              type="button"
              onClick={onNavigateToShop}
              className="text-white/70 hover:text-white transition-colors relative py-1 cursor-pointer"
            >
              Shop
            </button>
            <button
              id="film-nav-active-film"
              type="button"
              className="text-white border-b-2 border-amber-400 pb-0.5 cursor-default flex items-center gap-1.5"
            >
              <Film size={14} className="text-amber-400" />
              <span>Film</span>
            </button>
            <a
              id="film-nav-instagram"
              href={ARTIST_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Instagram</span>
              <ExternalLink size={12} className="opacity-60" />
            </a>
            <a
              id="film-nav-website"
              href={`https://${ARTIST_INFO.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1 text-white/70 hover:text-white"
            >
              <span>sheldonr.ca</span>
              <ExternalLink size={12} className="opacity-60" />
            </a>
          </nav>

          {/* Cart Bag Action */}
          <div className="flex items-center gap-3">
            <button
              id="film-open-cart-btn"
              type="button"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer flex items-center gap-2"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag size={18} />
              <span className="text-xs font-mono font-bold text-amber-300">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Headline & Darkroom Journal Intro */}
      <section className="relative z-10 pt-28 sm:pt-36 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-300 mb-2">
              <Camera size={14} />
              <span>Sheldon Ruddock Analog Negatives Archive</span>
            </div>
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              FILM GALLERY & ARCHIVES
            </h1>
            <p className="text-xs sm:text-sm text-white/60 max-w-2xl mt-2 leading-relaxed">
              Every exposure is shot on genuine analog 35mm and 120 medium format film emulsions. Developed with organic chemical grain, authentic halation, and natural skin tones. Scroll to explore the complete darkroom collection.
            </p>
          </div>

          {/* Quick Stats Banner */}
          <div className="bg-[#14151b] border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center gap-6 shrink-0 shadow-xl">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/50">
                Total Negatives
              </p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-amber-300">
                {FILM_PHOTOS.length}
              </p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/50">
                Emulsions
              </p>
              <p className="text-xs font-semibold text-white/80">
                Portra • HP5 • Cinestill
              </p>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-8 bg-[#14151b] border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs font-mono text-white/40 uppercase mr-1 hidden sm:inline-block">
              Filter:
            </span>
            {(
              [
                { id: 'all', label: `All Negatives (${FILM_PHOTOS.length})` },
                { id: '120', label: '120 Medium Format' },
                { id: '35mm', label: '35mm Film' },
                { id: 'prints', label: 'Prints Available in Shop' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === tab.id
                    ? 'bg-white text-black shadow-md'
                    : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-white/40 tracking-wider">
            Showing {filteredPhotos.length} exposures
          </div>
        </div>
      </section>

      {/* 3. Main Masonry Gallery with Physics Drop-in Scroll Animation */}
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-28 flex-1">
        <div
          id="gallery-masonry-container"
          className="columns-1 md:columns-2 gap-6 [column-fill:_balance]"
        >
          {filteredPhotos.map((photo, index) => {
            const matchingPrint = photo.matchingPrintId
              ? PRINTS_DATA.find((p) => p.id === photo.matchingPrintId)
              : null;

            return (
              <motion.figure
                key={photo.id}
                id={`film-dropin-item-${index}`}
                initial={{ opacity: 0, y: -50, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                  delay: (index % 2) * 0.1,
                }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                onClick={() => setSelectedPhotoIndex(index)}
                className="group relative mb-6 break-inside-avoid bg-[#14151b] border border-white/10 hover:border-white/30 rounded-2xl overflow-hidden shadow-2xl transition-all cursor-pointer flex flex-col"
              >
                {/* Image Viewport */}
                <div className="relative overflow-hidden bg-black/40">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading={index < 4 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  />

                  {/* Darkroom Frame Edge Number Overlay */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[10px] font-mono tracking-widest text-white/70 bg-black/70 border border-white/10 px-2.5 py-1 rounded-md backdrop-blur-md">
                      EXP #{String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Availability Badge */}
                  {matchingPrint && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="text-[10px] font-mono tracking-wider font-semibold text-amber-300 bg-black/80 border border-amber-400/40 px-2.5 py-1 rounded-md backdrop-blur-md flex items-center gap-1 shadow-lg">
                        <Sparkles size={11} />
                        <span>Print Available • {matchingPrint.formattedPrice}</span>
                      </span>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white/90 underline underline-offset-4 flex items-center gap-1">
                        Click to Inspect Negative
                      </span>
                      {matchingPrint && onSelectPrint && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPrint(matchingPrint);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-400 text-black text-xs font-bold tracking-wider uppercase hover:bg-amber-300 transition-colors shadow-lg cursor-pointer flex items-center gap-1"
                        >
                          <span>Shop Print</span>
                          <ArrowRight size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Meta Footer Bar */}
                <div className="p-4 sm:p-5 flex items-center justify-between border-t border-white/5 bg-[#14151b]">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                      {photo.alt}
                    </h3>
                    <p className="text-xs text-white/50 font-mono mt-0.5">
                      {photo.format} • {photo.filmStock || 'Negative Archive'}
                    </p>
                  </div>

                  {matchingPrint ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectPrint) onSelectPrint(matchingPrint);
                      }}
                      className="px-3 py-1 rounded-full border border-white/20 text-xs font-mono text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                    >
                      {matchingPrint.formattedPrice}
                    </button>
                  ) : (
                    <span className="text-[11px] font-mono text-white/30">
                      Archive Still
                    </span>
                  )}
                </div>
              </motion.figure>
            );
          })}
        </div>
      </main>

      {/* 4. Footer (Matching main site with direct email booking & back to top) */}
      <footer className="border-t border-white/10 bg-[#0a0b0e] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span
                className="text-xl sm:text-2xl font-black tracking-tight uppercase text-white"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                SHELDON RUDDOCK
              </span>
              <span className="text-xs font-mono text-white/50">/ FILM</span>
            </div>
            <p className="text-xs text-white/50 max-w-md">
              Analog film photographs, darkroom master editions, and editorial commissions. Based in Toronto & Montreal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 text-right">
            <div>
              <p className="text-[11px] font-mono text-white/40 uppercase tracking-widest mb-1">
                Artist & Commercial Inquiries
              </p>
              <a
                id="film-footer-email"
                href="mailto:sheldonr.ca@gmail.com"
                className="text-lg sm:text-2xl font-mono font-medium text-white hover:text-amber-300 transition-colors"
              >
                sheldonr.ca@gmail.com
              </a>
            </div>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
            >
              <ArrowUp size={16} />
              <span>Top</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
          <p>© {new Date().getFullYear()} Sheldon Ruddock. All analog negatives reserved.</p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={onNavigateToShop}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Shop Fine Art Prints
            </button>
            <a
              href="https://www.instagram.com/sheldonr.ca/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </footer>

      {/* 5. Fullscreen Lightbox Preview */}
      <AnimatePresence>
        {activePhoto && selectedPhotoIndex !== null && (
          <motion.div
            id="film-lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 select-none"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            {/* Top Bar */}
            <div
              className="flex items-center justify-between text-white z-10 max-w-7xl mx-auto w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono tracking-widest text-amber-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                  {selectedPhotoIndex + 1} / {filteredPhotos.length}
                </span>
                <span className="text-sm font-semibold tracking-wide text-white/90">
                  {activePhoto.alt}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {activeMatchingPrint && onSelectPrint && (
                  <button
                    id="film-lightbox-shop-btn"
                    type="button"
                    onClick={() => {
                      setSelectedPhotoIndex(null);
                      onSelectPrint(activeMatchingPrint);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-400 text-black text-xs font-bold tracking-wider uppercase hover:bg-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <span>Shop Print ({activeMatchingPrint.formattedPrice})</span>
                    <ArrowRight size={14} />
                  </button>
                )}
                <button
                  id="film-close-lightbox-btn"
                  type="button"
                  onClick={() => setSelectedPhotoIndex(null)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close Lightbox"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* High-Res Viewport */}
            <div
              className="relative flex-1 flex items-center justify-center overflow-hidden my-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 sm:left-6 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer shadow-2xl"
                aria-label="Previous photo"
              >
                <ChevronLeft size={24} />
              </button>

              <motion.img
                key={activePhoto.id}
                src={activePhoto.src}
                alt={activePhoto.alt}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
              />

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:right-6 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer shadow-2xl"
                aria-label="Next photo"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Details Bar */}
            <div
              className="flex items-center justify-between text-xs text-white/50 font-mono tracking-widest z-10 border-t border-white/10 pt-4 max-w-7xl mx-auto w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="text-white/80">{activePhoto.format || 'Film Negative'}</span>
                <span>•</span>
                <span className="text-amber-300">{activePhoto.filmStock || 'Analog Negative'}</span>
              </div>
              <div className="hidden sm:block text-white/40">
                Use Arrow keys to navigate, Esc to close
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
