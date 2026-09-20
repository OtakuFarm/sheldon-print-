import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import pinkGlamAdultImg from '../assets/images/pink_glam_adult.png';
import discoBallAdultImg from '../assets/images/discoball_adult.png';
import outsideAdultImg from '../assets/images/outside_adult.png';
import copperGownAdultImg from '../assets/images/copper_gown_adult.png';

interface HeroCarouselProps {
  onDiscoverClick?: () => void;
}

const IMAGES = [
  {
    src: pinkGlamAdultImg,
    fallback: pinkGlamAdultImg,
    bg: '#F4845F',
    panel: '#F79B7F'
  },
  {
    src: discoBallAdultImg,
    fallback: discoBallAdultImg,
    bg: '#6BBF7A',
    panel: '#85CC92'
  },
  {
    src: outsideAdultImg,
    fallback: outsideAdultImg,
    bg: '#E882B4',
    panel: '#ED9DC4'
  },
  {
    src: copperGownAdultImg,
    fallback: copperGownAdultImg,
    bg: '#6EB5FF',
    panel: '#8DC4FF'
  },
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onDiscoverClick }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [imgSources, setImgSources] = useState<string[]>(IMAGES.map(img => img.src));
  const animTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Resize listener for isMobile (< 640px)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Preload all 4 images on mount
  useEffect(() => {
    IMAGES.forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });
  }, []);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) {
        clearTimeout(animTimeoutRef.current);
      }
    };
  }, []);

  const navigate = (direction: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);

    setActiveIndex((prev) => {
      if (direction === 'next') {
        return (prev + 1) % 4;
      } else {
        return (prev + 3) % 4;
      }
    });

    animTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  };

  // Roles derived from activeIndex
  const getRole = (index: number) => {
    if (index === activeIndex) return 'center';
    if (index === (activeIndex + 3) % 4) return 'left';
    if (index === (activeIndex + 1) % 4) return 'right';
    return 'back';
  };

  const getRoleStyle = (role: 'center' | 'left' | 'right' | 'back') => {
    switch (role) {
      case 'center':
        return {
          transform: `translateX(-50%) scale(${isMobile ? 1.18 : 1.48})`,
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: 20,
          left: '50%',
          height: isMobile ? '64%' : '88%',
          bottom: isMobile ? '20%' : '2%',
        };
      case 'left':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '20%' : '30%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
        };
      case 'right':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '80%' : '70%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
        };
      case 'back':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(4px)',
          opacity: 1,
          zIndex: 5,
          left: '50%',
          height: isMobile ? '13%' : '22%',
          bottom: isMobile ? '32%' : '12%',
        };
    }
  };

  const handleImageError = (index: number) => {
    setImgSources((prev) => {
      const updated = [...prev];
      updated[index] = IMAGES[index].fallback;
      return updated;
    });
  };

  // Grain SVG fractalNoise data URI
  const grainDataUri = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.08"/></svg>`;

  return (
    <div
      id="toonhub-hero"
      className="relative w-full overflow-hidden select-none"
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="relative w-full overflow-hidden" style={{ height: '100vh' }}>
        {/* 1. Grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 50,
            opacity: 0.4,
            backgroundImage: `url("${grainDataUri}")`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* 3. Top-left brand label "TOONHUB" */}
        <div
          className="absolute top-6 left-4 sm:left-8 flex items-center gap-3"
          style={{ zIndex: 60 }}
        >
          <span
            className="text-xs font-semibold uppercase tracking-wider text-white"
            style={{ opacity: 0.9, letterSpacing: '0.18em' }}
          >
            TOONHUB
          </span>
          <span className="hidden sm:inline-block text-white/40 text-xs">/</span>
          <span className="hidden sm:inline-block text-white/80 text-xs tracking-widest uppercase">
            SHELDON RUDDOCK PRINTS
          </span>
        </div>

        {/* 4. Carousel */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {IMAGES.map((item, index) => {
            const role = getRole(index);
            const style = getRoleStyle(role);

            return (
              <div
                key={index}
                className="absolute"
                style={{
                  aspectRatio: '0.6 / 1',
                  ...style,
                  transition:
                    'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1), height 650ms cubic-bezier(0.4,0,0.2,1), bottom 650ms cubic-bezier(0.4,0,0.2,1)',
                  willChange: 'transform, filter, opacity',
                }}
              >
                <img
                  src={imgSources[index]}
                  alt={`Toonhub Figurine ${index + 1}`}
                  onError={() => handleImageError(index)}
                  draggable={false}
                  className="w-full h-full object-contain object-bottom pointer-events-none drop-shadow-2xl"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* 5. Bottom-left text + nav buttons */}
        <div
          className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24 flex flex-col items-start text-white"
          style={{ zIndex: 60, maxWidth: 380 }}
        >
          <p
            className="font-extrabold uppercase tracking-wider mb-2 sm:mb-3 text-base sm:text-[20px] text-white"
            style={{
              fontFamily: "'Syne', sans-serif",
              opacity: 0.98,
              letterSpacing: '0.04em',
            }}
          >
            SHELDON RUDDOCK EDITIONS
          </p>
          <p
            className="hidden sm:block text-xs sm:text-sm text-white/80 mb-4 sm:mb-5 font-light"
            style={{ lineHeight: 1.65 }}
          >
            Archival fine art editions and sculptural studies curated by Sheldon Ruddock. Printed on museum-grade Hahnemühle rag paper from authentic 35mm and 120 medium format film negatives.
          </p>

          <div className="flex items-center gap-3 sm:gap-4 mt-1">
            <button
              id="hero-nav-prev-btn"
              type="button"
              onClick={() => navigate('prev')}
              aria-label="Previous Figurine"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white flex items-center justify-center text-white bg-transparent cursor-pointer transition-all duration-150 hover:scale-108 hover:bg-white/12 active:scale-95"
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>
            <button
              id="hero-nav-next-btn"
              type="button"
              onClick={() => navigate('next')}
              aria-label="Next Figurine"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white flex items-center justify-center text-white bg-transparent cursor-pointer transition-all duration-150 hover:scale-108 hover:bg-white/12 active:scale-95"
            >
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* 6. Bottom-right link "DISCOVER IT" */}
        <div
          className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10"
          style={{ zIndex: 60 }}
        >
          <a
            id="hero-discover-link"
            href="#shop-section"
            onClick={(e) => {
              if (onDiscoverClick) {
                e.preventDefault();
                onDiscoverClick();
              }
            }}
            className="flex items-center gap-2 text-white uppercase no-underline cursor-pointer group transition-opacity duration-200 hover:opacity-100"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(20px, 4vw, 56px)',
              fontWeight: 400,
              opacity: 0.95,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            <span>DISCOVER IT</span>
            <ArrowRight
              className="w-5 h-5 sm:w-8 sm:h-8 transition-transform duration-200 group-hover:translate-x-1.5"
              strokeWidth={2.25}
            />
          </a>
        </div>
      </div>
    </div>
  );
};
