import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Mail,
  Instagram,
  ExternalLink,
  ShieldCheck,
  Truck,
  Sparkles,
  Camera,
  Check,
  ArrowUp,
} from 'lucide-react';
import { PRINTS_DATA, ARTIST_INFO } from './data/prints';
import { PrintItem, CartItem, OrderRecord } from './types';
import { HeroCarousel } from './components/HeroCarousel';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { EmailConfirmationModal } from './components/EmailConfirmationModal';
import { FilmGalleryModal } from './components/FilmGalleryModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { FilmPage } from './components/FilmPage';

export default function App() {
  // Navigation & Page State
  const [currentPage, setCurrentPage] = useState<'shop' | 'film'>('film');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Prints' | 'Posters' | 'Editions'>('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  // Modal & Drawer State
  const [selectedProduct, setSelectedProduct] = useState<PrintItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isFilmOpen, setIsFilmOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [activeConfirmationOrder, setActiveConfirmationOrder] = useState<OrderRecord | null>(null);

  // Cart & Order State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRINTS_DATA[0], // Naomi Print
      quantity: 1,
      selectedDimension: '8x10 in',
      frameOption: 'Unframed',
      framePrice: 0,
    }
  ]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Filtered & Sorted Prints
  const filteredPrints = useMemo(() => {
    return PRINTS_DATA.filter((print) => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        print.title.toLowerCase().includes(query) ||
        print.description.toLowerCase().includes(query) ||
        print.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        print.filmStock.toLowerCase().includes(query);

      // Category match
      const matchesCategory =
        selectedCategory === 'All' || print.category === selectedCategory;

      // In stock filter
      const matchesStock = !inStockOnly || print.inStock;

      return matchesSearch && matchesCategory && matchesStock;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return 0; // featured default
    });
  }, [searchQuery, selectedCategory, inStockOnly, sortBy]);

  // Cart Handlers
  const handleAddToCart = (
    product: PrintItem,
    dimension: string,
    frame: 'Unframed' | 'Matte Black Gallery Frame' | 'Natural Oak Frame' = 'Unframed',
    quantity: number = 1
  ) => {
    const framePrice =
      frame === 'Matte Black Gallery Frame'
        ? 35
        : frame === 'Natural Oak Frame'
        ? 45
        : 0;

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedDimension === dimension &&
          item.frameOption === frame
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            quantity,
            selectedDimension: dimension,
            frameOption: frame,
            framePrice,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Order Complete Handler
  const handleOrderComplete = (newOrder: OrderRecord) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setActiveConfirmationOrder(newOrder);
  };

  const scrollToShop = () => {
    const el = document.getElementById('shop-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.includes('@')) return;
    setNewsletterSubscribed(true);
  };

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0d0e12] text-white flex flex-col selection:bg-amber-400 selection:text-black">
      {currentPage === 'film' ? (
        <FilmPage
          onNavigateToShop={() => {
            setCurrentPage('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenCart={() => setIsCartOpen(true)}
          cartCount={cartTotalCount}
          onSelectPrint={(print) => setSelectedProduct(print)}
        />
      ) : (
        <>
          {/* Top Floating Navbar */}
          <Navbar
            cartCount={cartTotalCount}
            onOpenCart={() => setIsCartOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenFilm={() => {
              setCurrentPage('film');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToShop={() => setCurrentPage('shop')}
            currentPage={currentPage}
            onOpenOrderHistory={() => setIsOrderHistoryOpen(true)}
            orderCount={orders.length}
          />

          {/* Hero Section: TOONHUB full-viewport character-figurine carousel */}
          <section id="hero">
            <HeroCarousel onDiscoverClick={scrollToShop} />
          </section>

          {/* Store & Prints Catalog Section */}
          <main id="shop-section" className="relative z-10 pt-16 sm:pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 mb-10 gap-6"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-300 mb-2">
              <Sparkles size={14} />
              <span>Sheldon Ruddock Fine Art Print Editions</span>
            </div>
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              ARCHIVAL PRINTS & POSTERS
            </h1>
            <p className="text-xs sm:text-sm text-white/60 max-w-2xl mt-2 leading-relaxed">
              Printed on museum-grade Hahnemühle 100% cotton rag 308gsm archival paper. Each edition is carefully crafted from authentic 35mm and 120 medium format negatives. Guest checkout enabled with multiple payment options and automated email confirmation.
            </p>
          </div>

          {/* Direct Artist Contact Tag */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-xs text-right shrink-0">
            <p className="text-white/50 text-[11px]">Artist & Studio Inquiries</p>
            <a
              href={`mailto:${ARTIST_INFO.email}`}
              className="text-white font-mono font-semibold hover:text-amber-300 transition-colors flex items-center justify-end gap-1.5 mt-0.5"
            >
              <Mail size={13} />
              <span>{ARTIST_INFO.email}</span>
            </a>
          </div>
        </motion.div>

        {/* Filter and Search Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#14151b] border border-white/10 rounded-2xl p-4 sm:p-5 mb-10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl"
        >
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {(['All', 'Prints', 'Posters', 'Editions'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-black shadow-md'
                    : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar & stock toggle & sorting */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search size={15} className="absolute left-3 top-2.5 text-white/40" />
              <input
                id="catalog-search-input"
                type="text"
                placeholder="Filter by title (e.g. Naomi, Eboni)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-white/40 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* In Stock toggle */}
            <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer select-none bg-white/5 px-3 py-2 rounded-xl border border-white/5 hover:border-white/20">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded accent-white cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
              <SlidersHorizontal size={13} className="text-white/40" />
              <select
                id="catalog-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-white/90 border-none focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-[#181920] text-white">Featured</option>
                <option value="price-asc" className="bg-[#181920] text-white">Price: Low to High</option>
                <option value="price-desc" className="bg-[#181920] text-white">Price: High to Low</option>
                <option value="name" className="bg-[#181920] text-white">Title A-Z</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Search status & count */}
        <div className="flex items-center justify-between text-xs text-white/50 mb-6 px-1">
          <span>Showing {filteredPrints.length} of {PRINTS_DATA.length} Available Prints</span>
          {searchQuery && (
            <span>
              Searching for: <strong className="text-amber-300">"{searchQuery}"</strong>
            </span>
          )}
        </div>

        {/* Product Grid */}
        {filteredPrints.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 space-y-3">
            <Search size={36} className="mx-auto text-white/30" />
            <p className="text-base font-semibold">No prints found matching "{searchQuery}"</p>
            <p className="text-xs text-white/50">Try checking your spelling or reset the active filter</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setInStockOnly(false);
              }}
              className="mt-2 px-4 py-2 bg-white text-black text-xs font-semibold rounded-xl hover:bg-white/90 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPrints.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 35, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.55,
                  delay: (index % 3) * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full flex flex-col"
              >
                <ProductCard
                  product={product}
                  onSelect={(p) => setSelectedProduct(p)}
                  onAddToCart={(p, dim) => handleAddToCart(p, dim, 'Unframed', 1)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Studio Craft & Printing Ethos Banner with Intersection Observer Animations */}
        <motion.section
          id="studio-craft-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#181a24] to-[#101117] border border-white/10 shadow-2xl relative overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xs font-mono uppercase tracking-widest text-amber-300 flex items-center gap-1.5"
            >
              <Camera size={14} />
              <span>Analog Film & Museum Archival Standards</span>
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="text-2xl sm:text-4xl font-bold tracking-tight text-white"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              PRINTED WITH CONVICTION. PACKED WITH REVERENCE.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal"
            >
              Every print ordered through this shop is printed to order to eliminate overproduction. We use 100% acid-free cotton rag papers certified for 100+ years of lightfast durability, protected inside reinforced double-walled packaging.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
              {[
                {
                  icon: ShieldCheck,
                  color: 'text-emerald-400',
                  title: 'Cotton Rag 308gsm',
                  desc: 'Heavyweight tactile velvet finish',
                },
                {
                  icon: Truck,
                  color: 'text-blue-400',
                  title: 'Tracked Worldwide',
                  desc: 'Free shipping on orders over $75',
                },
                {
                  icon: Mail,
                  color: 'text-amber-400',
                  title: 'Automated Notifications',
                  desc: 'Instant email confirmations & tracking',
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: 0.5,
                    delay: 0.25 + idx * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex items-start gap-3 bg-white/5 border border-white/5 hover:border-white/15 rounded-2xl p-4 backdrop-blur-sm transition-colors"
                >
                  <item.icon size={20} className={`${item.color} shrink-0 mt-0.5`} />
                  <div>
                    <strong className="block text-white font-semibold text-sm mb-0.5">{item.title}</strong>
                    <span className="text-white/50 text-[11px] leading-tight block">{item.desc}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#090a0d] pt-16 pb-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            {/* Col 1: Brand & Contact */}
            <div className="md:col-span-5 space-y-4">
              <h3
                className="text-2xl sm:text-3xl font-black tracking-tight"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                SHELDON RUDDOCK
              </h3>
              <p className="text-xs text-white/60 leading-relaxed max-w-sm">
                Fine art photographer & visual storyteller based in Canada. Exploring portraiture, western aesthetics, and human warmth on 35mm and 120 film.
              </p>
              <div className="space-y-1 text-xs">
                <p className="text-white/50">Direct Studio Email:</p>
                <a
                  href={`mailto:${ARTIST_INFO.email}`}
                  className="text-amber-300 hover:underline font-mono font-semibold"
                >
                  {ARTIST_INFO.email}
                </a>
              </div>
            </div>

            {/* Col 2: Navigation links */}
            <div className="md:col-span-3 space-y-3 text-xs">
              <p className="uppercase tracking-widest text-white/40 font-mono text-[10px]">
                Explore
              </p>
              <ul className="space-y-2 font-medium">
                <li>
                  <a href="#shop-section" onClick={scrollToShop} className="hover:text-amber-300 transition-colors">
                    Shop Prints & Posters
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsFilmOpen(true)}
                    className="hover:text-amber-300 transition-colors text-left"
                  >
                    Film Negatives & Rolls
                  </button>
                </li>
                <li>
                  <a
                    href={ARTIST_INFO.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-300 transition-colors flex items-center gap-1"
                  >
                    <Instagram size={13} />
                    <span>Instagram (@sheldonr.ca)</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`https://${ARTIST_INFO.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-300 transition-colors flex items-center gap-1"
                  >
                    <ExternalLink size={13} />
                    <span>sheldonr.ca</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Newsletter & Notifications */}
            <div className="md:col-span-4 space-y-3 text-xs">
              <p className="uppercase tracking-widest text-white/40 font-mono text-[10px]">
                Private Collectors Dispatch
              </p>
              <p className="text-white/60">
                Receive early access notices before new 35mm print editions and monograph reprints drop.
              </p>

              {newsletterSubscribed ? (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <Check size={16} />
                  <span>You're on the private collectors list!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="your-email@domain.com"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/40 placeholder-white/30"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-xl hover:bg-white/90 transition-colors cursor-pointer shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}

              {/* Supported Payment Methods Badges */}
              <div className="pt-2">
                <p className="text-[10px] uppercase font-mono text-white/40 mb-1.5">
                  Supported Payment Methods
                </p>
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-white/70">
                  <span className="bg-white/10 px-2 py-1 rounded border border-white/10">Credit / Debit</span>
                  <span className="bg-white/10 px-2 py-1 rounded border border-white/10"> Apple Pay</span>
                  <span className="bg-white/10 px-2 py-1 rounded border border-white/10">Google Pay</span>
                  <span className="bg-white/10 px-2 py-1 rounded border border-white/10">PayPal</span>
                  <span className="bg-pink-950/60 text-pink-300 px-2 py-1 rounded border border-pink-500/30">Klarna</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom copyright & Toonhub reference */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
            <p>© {new Date().getFullYear()} Sheldon Ruddock & TOONHUB. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <span>Back to Top</span>
                <ArrowUp size={14} />
              </button>
            </div>
          </div>
        </div>
      </footer>
        </>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(prod, dim, frame, qty) => {
          handleAddToCart(prod, dim, frame, qty);
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderComplete={handleOrderComplete}
      />

      {/* Automated Email Confirmation Modal */}
      <EmailConfirmationModal
        order={activeConfirmationOrder}
        onClose={() => setActiveConfirmationOrder(null)}
        onViewOrdersHistory={() => {
          setActiveConfirmationOrder(null);
          setIsOrderHistoryOpen(true);
        }}
      />

      {/* Film Gallery Modal */}
      <FilmGalleryModal
        isOpen={isFilmOpen}
        onClose={() => setIsFilmOpen(false)}
        onSelectPrint={(print) => setSelectedProduct(print)}
      />

      {/* Past Orders & Dispatched Notifications History */}
      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        orders={orders}
        onSelectOrder={(ord) => setActiveConfirmationOrder(ord)}
      />
    </div>
  );
}
