import React from 'react';
import { ShoppingBag, Search, X, Mail, Film, ExternalLink } from 'lucide-react';
import { ARTIST_INFO } from '../data/prints';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenFilm: () => void;
  onNavigateToShop?: () => void;
  currentPage?: 'shop' | 'film';
  onOpenOrderHistory: () => void;
  orderCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  onOpenFilm,
  onNavigateToShop,
  currentPage = 'shop',
  onOpenOrderHistory,
  orderCount,
}) => {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const handleShopClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateToShop) {
      onNavigateToShop();
    }
    const el = document.getElementById('shop-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar"
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300 backdrop-blur-md bg-black/50 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleShopClick}
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

        {/* Primary Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs lg:text-sm font-semibold tracking-wider uppercase text-white/90">
          <button
            id="nav-link-shop"
            type="button"
            onClick={handleShopClick}
            className={`transition-colors relative py-1 cursor-pointer ${
              currentPage === 'shop'
                ? 'text-white border-b-2 border-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Shop
          </button>
          <button
            id="nav-link-film"
            type="button"
            onClick={onOpenFilm}
            className={`transition-colors flex items-center gap-1.5 cursor-pointer py-1 ${
              currentPage === 'film'
                ? 'text-white border-b-2 border-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Film size={14} />
            <span>Film</span>
          </button>
          <a
            id="nav-link-instagram"
            href={ARTIST_INFO.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Instagram</span>
            <ExternalLink size={12} className="opacity-60" />
          </a>
          <a
            id="nav-link-portfolio"
            href={`https://${ARTIST_INFO.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1 text-white/70 hover:text-white"
          >
            <span>sheldonr.ca</span>
            <ExternalLink size={12} className="opacity-60" />
          </a>
        </nav>

        {/* Action icons: Search, Orders/Emails, Bag */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search Input Toggle */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <div className="flex items-center bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-xs sm:text-sm w-44 sm:w-64 transition-all animate-fadeIn">
                <Search size={15} className="text-white/60 mr-2 shrink-0" />
                <input
                  id="navbar-search-input"
                  type="text"
                  placeholder="Search Naomi, Eboni, Polaroid..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                  className="bg-transparent border-none text-white focus:outline-none w-full placeholder-white/40 text-xs"
                />
                <button
                  id="navbar-search-close-btn"
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    onSearchChange('');
                  }}
                  className="text-white/60 hover:text-white ml-1 p-0.5"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                id="navbar-search-open-btn"
                type="button"
                onClick={() => {
                  setIsSearchOpen(true);
                  // also scroll toward shop so user sees results
                  const el = document.getElementById('shop-section');
                  if (el && window.scrollY < 200) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Search Prints"
              >
                <Search size={18} />
              </button>
            )}
          </div>

          {/* Email Notifications & Past Orders */}
          <button
            id="navbar-orders-history-btn"
            type="button"
            onClick={onOpenOrderHistory}
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Order Confirmations & Email Notifications"
          >
            <Mail size={18} />
            {orderCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black animate-pulse" />
            )}
          </button>

          {/* Cart Bag */}
          <button
            id="navbar-cart-btn"
            type="button"
            onClick={onOpenCart}
            className="relative flex items-center gap-2 bg-white text-black font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-full hover:bg-white/90 active:scale-95 transition-all shadow-lg shadow-black/30"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Bag</span>
            <span className="w-5 h-5 bg-black text-white text-[11px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
