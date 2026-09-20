import React from 'react';
import { ShoppingBag, Eye, Check } from 'lucide-react';
import { PrintItem } from '../types';

interface ProductCardProps {
  product: PrintItem;
  onSelect: (product: PrintItem) => void;
  onAddToCart: (product: PrintItem, dimension: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
}) => {
  const [selectedDim, setSelectedDim] = React.useState(product.dimensions[0]);
  const [justAdded, setJustAdded] = React.useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    onAddToCart(product, selectedDim);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <article
      id={`product-card-${product.id}`}
      onClick={() => onSelect(product)}
      className="group relative bg-[#14151a] rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 flex flex-col cursor-pointer hover:shadow-2xl hover:shadow-black/50"
    >
      {/* Artwork Image Container with Film Ratio */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0c0d10]">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Film Stock Tag */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] uppercase font-mono tracking-wider text-white/80">
          {product.filmStock}
        </div>

        {/* Sold out Badge */}
        {!product.inStock && (
          <div className="absolute top-3 right-3 bg-rose-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-rose-500/30 text-rose-200 text-xs font-bold uppercase tracking-wider">
            {product.soldOutLabel || 'Sold out'}
          </div>
        )}

        {/* Quick View Button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span className="bg-white/90 text-black px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-xl backdrop-blur-sm">
            <Eye size={14} /> Quick View
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3
              className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-amber-200 transition-colors"
            >
              {product.title}
            </h3>
            <span
              className="text-sm sm:text-base font-semibold text-white/90"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              {product.formattedPrice}
            </span>
          </div>

          <p className="text-xs text-white/60 line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Size selection & Add to Cart */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
          {product.dimensions.length > 1 ? (
            <select
              id={`dimension-select-${product.id}`}
              value={selectedDim}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setSelectedDim(e.target.value)}
              disabled={!product.inStock}
              className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white/80 focus:outline-none focus:border-white/30 cursor-pointer max-w-[120px]"
            >
              {product.dimensions.map((dim) => (
                <option key={dim} value={dim} className="bg-[#1a1b22] text-white">
                  {dim}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-[11px] font-mono text-white/50">
              {product.dimensions[0]}
            </span>
          )}

          {product.inStock ? (
            <button
              id={`add-to-bag-${product.id}`}
              type="button"
              onClick={handleAdd}
              disabled={justAdded}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                justAdded
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-black hover:bg-white/90 active:scale-95'
              }`}
            >
              {justAdded ? (
                <>
                  <Check size={14} /> Added
                </>
              ) : (
                <>
                  <ShoppingBag size={14} /> Add
                </>
              )}
            </button>
          ) : (
            <span className="text-xs font-medium text-white/40 uppercase tracking-wider py-1.5 px-2.5">
              Sold out
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
