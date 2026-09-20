import React, { useState } from 'react';
import { X, Check, ShieldCheck, Truck, RefreshCw, Mail, Sparkles } from 'lucide-react';
import { PrintItem } from '../types';
import { ARTIST_INFO } from '../data/prints';

interface ProductDetailModalProps {
  product: PrintItem | null;
  onClose: () => void;
  onAddToCart: (
    product: PrintItem,
    dimension: string,
    frame: 'Unframed' | 'Matte Black Gallery Frame' | 'Natural Oak Frame',
    quantity: number
  ) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [dimension, setDimension] = useState(product.dimensions[0] || '8x10 in');
  const [frame, setFrame] = useState<'Unframed' | 'Matte Black Gallery Frame' | 'Natural Oak Frame'>('Unframed');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const framePrices: Record<string, number> = {
    'Unframed': 0,
    'Matte Black Gallery Frame': 35,
    'Natural Oak Frame': 45,
  };

  const totalPrice = (product.price + framePrices[frame]) * quantity;

  const handleAdd = () => {
    if (!product.inStock) return;
    onAddToCart(product, dimension, frame, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      id="product-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="product-detail-modal"
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#15161c] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row my-auto"
      >
        {/* Close Button */}
        <button
          id="close-detail-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors"
        >
          <X size={20} />
        </button>

        {/* Left: Big Imagery with Frame Simulation */}
        <div className="md:w-1/2 p-6 sm:p-8 flex items-center justify-center bg-[#0d0e12] relative overflow-hidden">
          <div
            className={`relative max-w-full max-h-[460px] transition-all duration-300 rounded-sm ${
              frame === 'Matte Black Gallery Frame'
                ? 'p-6 bg-[#0a0a0a] shadow-2xl border-4 border-[#1c1c1e] ring-1 ring-white/10'
                : frame === 'Natural Oak Frame'
                ? 'p-6 bg-[#f4ebd0] shadow-2xl border-8 border-[#c99e6b] ring-1 ring-black/20'
                : 'p-0 shadow-xl'
            }`}
          >
            <img
              src={product.image}
              alt={product.title}
              className="max-h-[380px] w-auto object-contain rounded-xs drop-shadow-md"
            />
            {frame !== 'Unframed' && (
              <div className="absolute bottom-2 right-4 text-[9px] font-mono tracking-widest text-black/50 uppercase">
                {frame}
              </div>
            )}
          </div>
        </div>

        {/* Right: Spec sheet & Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/50 mb-2">
              <span>{product.category}</span>
              <span>•</span>
              <span>{product.year}</span>
            </div>

            <h2
              className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              {product.title}
            </h2>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold text-white">
                ${totalPrice.toFixed(2)}
              </span>
              {frame !== 'Unframed' && (
                <span className="text-xs text-white/50 font-mono">
                  (Includes {frame})
                </span>
              )}
            </div>

            <p className="text-sm text-white/75 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Specifications Box */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-2 mb-6 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/50">Film Stock</span>
                <span className="text-white font-mono">{product.filmStock}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/50">Paper Stock</span>
                <span className="text-white text-right max-w-[200px]">{product.paper}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/50">Print Medium</span>
                <span className="text-white">{product.medium}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-white/50">Artist Inquiries</span>
                <a
                  href={`mailto:${ARTIST_INFO.email}?subject=Inquiry: ${product.title}`}
                  className="text-amber-300 hover:underline flex items-center gap-1 font-mono"
                >
                  <Mail size={12} /> {ARTIST_INFO.email}
                </a>
              </div>
            </div>

            {/* Dimensions Selector */}
            <div className="mb-5">
              <label className="block text-xs uppercase tracking-wider font-semibold text-white/70 mb-2">
                Select Dimensions
              </label>
              <div className="grid grid-cols-3 gap-2">
                {product.dimensions.map((dim) => (
                  <button
                    key={dim}
                    type="button"
                    onClick={() => setDimension(dim)}
                    disabled={!product.inStock}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      dimension === dim
                        ? 'border-white bg-white text-black'
                        : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30'
                    }`}
                  >
                    {dim}
                  </button>
                ))}
              </div>
            </div>

            {/* Framing Options */}
            {product.category === 'Prints' && (
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-wider font-semibold text-white/70 mb-2">
                  Framing Option
                </label>
                <div className="space-y-2">
                  {(['Unframed', 'Matte Black Gallery Frame', 'Natural Oak Frame'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFrame(opt)}
                      className={`w-full py-2.5 px-3.5 rounded-xl text-xs flex items-center justify-between border transition-all cursor-pointer ${
                        frame === opt
                          ? 'border-white bg-white/15 text-white font-medium'
                          : 'border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <span>{opt}</span>
                      <span className="font-mono">
                        {opt === 'Unframed' ? 'Free' : `+$${framePrices[opt]}.00`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            {product.inStock && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs uppercase tracking-wider font-semibold text-white/70">
                  Quantity
                </span>
                <div className="flex items-center border border-white/15 rounded-xl overflow-hidden bg-white/5">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-semibold text-white font-mono">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action button */}
          <div>
            {product.inStock ? (
              <button
                id="modal-add-to-cart-btn"
                type="button"
                onClick={handleAdd}
                disabled={added}
                className={`w-full py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  added
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white text-black hover:bg-white/90 active:scale-[0.99] shadow-lg shadow-black/40'
                }`}
              >
                {added ? (
                  <>
                    <Check size={18} /> Added to Bag
                  </>
                ) : (
                  <>
                    <Sparkles size={18} /> Add to Bag • ${totalPrice.toFixed(2)}
                  </>
                )}
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs sm:text-sm bg-white/10 text-white/40 cursor-not-allowed"
              >
                Sold out
              </button>
            )}

            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10 text-[11px] text-white/50 text-center">
              <div className="flex flex-col items-center gap-1">
                <Truck size={14} className="text-white/70" />
                <span>Worldwide Flat Tracked</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={14} className="text-white/70" />
                <span>Museum Archival Pigment</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw size={14} className="text-white/70" />
                <span>Damage Replacement Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
