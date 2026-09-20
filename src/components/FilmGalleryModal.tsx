import React from 'react';
import { X, Film, Camera, ExternalLink, Mail, ShoppingBag } from 'lucide-react';
import { ARTIST_INFO, PRINTS_DATA } from '../data/prints';
import { PrintItem } from '../types';

interface FilmGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrint: (print: PrintItem) => void;
}

export const FilmGalleryModal: React.FC<FilmGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectPrint,
}) => {
  if (!isOpen) return null;

  const filmRolls = [
    {
      title: 'Roll #104: Kodak Portra 400',
      format: '35mm Film',
      camera: 'Contax G2 / 45mm Planar',
      location: 'Toronto & Montreal',
      featuredPrintId: 'naomi-print',
    },
    {
      title: 'Roll #089: Ilford HP5 Plus',
      format: '120 Medium Format',
      camera: 'Mamiya RZ67 Pro II / 110mm f/2.8',
      location: 'Studio Session, Toronto',
      featuredPrintId: 'eboni-print',
    },
    {
      title: 'Roll #112: Kodak Ektar 100',
      format: '120 Medium Format',
      camera: 'Pentax 67 / 105mm f/2.4',
      location: 'Highlands & Badlands',
      featuredPrintId: 'naomi-cowboy-print',
    },
    {
      title: 'Roll #076: Cinestill 800T',
      format: '35mm Film',
      camera: 'Leica M6 / 35mm Summicron',
      location: 'Dusk Interior & Neon Stills',
      featuredPrintId: 'clara-print',
    },
  ];

  return (
    <div
      id="film-gallery-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="film-gallery-modal"
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#111216] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl my-auto text-white p-6 sm:p-8"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-300">
              <Film size={20} />
            </div>
            <div>
              <h2
                className="text-xl sm:text-2xl font-bold tracking-wide"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                ANALOG FILM ARCHIVES
              </h2>
              <p className="text-xs text-white/60">
                Sheldon Ruddock’s 35mm & 120mm Film Negatives & Darkroom Journal
              </p>
            </div>
          </div>

          <button
            id="close-film-modal-btn"
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Philosophy Intro */}
        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 mb-8 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 space-y-2 text-xs sm:text-sm text-white/80 leading-relaxed">
            <p>
              "Film forces patience and complete surrender to the exposure. Every print in this shop is developed from physical analog negatives—celebrating organic chemical grain, authentic halation, and natural skin tones that digital sensors simply cannot replicate."
            </p>
            <p className="text-[11px] font-mono text-white/50 pt-1">
              — Sheldon Ruddock (sheldonr.ca@gmail.com)
            </p>
          </div>
          <div className="shrink-0 flex gap-2">
            <a
              href={ARTIST_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Instagram</span>
              <ExternalLink size={12} />
            </a>
            <a
              href={`mailto:${ARTIST_INFO.email}`}
              className="px-3.5 py-2 bg-white text-black hover:bg-white/90 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Mail size={12} />
              <span>Contact</span>
            </a>
          </div>
        </div>

        {/* Film Roll Showcase */}
        <h3 className="text-xs uppercase tracking-widest text-white/60 font-semibold mb-4">
          Featured Negative Rolls & Resulting Archival Prints
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {filmRolls.map((roll, idx) => {
            const matchedPrint = PRINTS_DATA.find((p) => p.id === roll.featuredPrintId);
            return (
              <div
                key={idx}
                className="bg-[#181921] border border-white/5 rounded-2xl p-4 flex gap-4 items-center hover:border-white/20 transition-colors"
              >
                {matchedPrint && (
                  <img
                    src={matchedPrint.image}
                    alt={matchedPrint.title}
                    className="w-20 h-24 object-cover rounded-xl bg-black border border-white/10 shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-amber-300/90 mb-1">
                    <Camera size={10} />
                    <span>{roll.format}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white truncate">{roll.title}</h4>
                  <p className="text-[11px] text-white/50">{roll.camera}</p>
                  <p className="text-[10px] text-white/40">{roll.location}</p>

                  {matchedPrint && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectPrint(matchedPrint);
                      }}
                      className="mt-2 text-xs text-white underline underline-offset-4 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <ShoppingBag size={12} /> View {matchedPrint.title} ({matchedPrint.formattedPrice})
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex justify-end pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-white/90 transition-colors cursor-pointer"
          >
            Back to Shop
          </button>
        </div>
      </div>
    </div>
  );
};
