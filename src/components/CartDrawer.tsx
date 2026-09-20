import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => {
    return sum + (item.product.price + item.framePrice) * item.quantity;
  }, 0);

  const freeShippingThreshold = 75;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        id="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#121318] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl animate-slideLeft"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-white" />
            <h2
              className="text-lg font-bold text-white tracking-wide uppercase"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              Your Cart ({items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            id="close-cart-btn"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Tracker */}
        <div className="px-5 py-3 bg-white/5 border-b border-white/5">
          <div className="flex justify-between text-xs text-white/80 mb-1.5 font-mono">
            {remainingForFreeShipping > 0 ? (
              <span>Add ${remainingForFreeShipping.toFixed(2)} more for <strong>Free Worldwide Shipping</strong></span>
            ) : (
              <span className="text-emerald-400 font-semibold">🎉 You unlocked Free Shipping!</span>
            )}
            <span>{Math.round(progressToFreeShipping)}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-white/40 space-y-3 py-16">
              <ShoppingBag size={48} strokeWidth={1.2} />
              <p className="text-sm font-medium">Your shopping bag is empty</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 text-xs font-semibold text-white underline underline-offset-4 hover:text-amber-300"
              >
                Explore Sheldon Ruddock Prints
              </button>
            </div>
          ) : (
            items.map((item, index) => {
              const itemTotal = (item.product.price + item.framePrice) * item.quantity;
              return (
                <div
                  key={`${item.product.id}-${item.selectedDimension}-${item.frameOption}-${index}`}
                  className="flex gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 items-center"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-16 h-20 object-cover rounded-lg shrink-0 bg-black"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">
                      {item.product.title}
                    </h4>
                    <p className="text-xs text-white/50 font-mono mt-0.5">
                      {item.selectedDimension}
                    </p>
                    {item.frameOption !== 'Unframed' && (
                      <p className="text-[11px] text-amber-200/80 truncate">
                        {item.frameOption}
                      </p>
                    )}
                    <p className="text-xs font-semibold text-white mt-1">
                      ${itemTotal.toFixed(2)}
                    </p>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-black/40 text-xs">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          className="px-2 py-0.5 text-white/60 hover:text-white hover:bg-white/10"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 font-mono text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          className="px-2 py-0.5 text-white/60 hover:text-white hover:bg-white/10"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(index)}
                        className="text-white/40 hover:text-rose-400 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Checkout Trigger */}
        {items.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-[#0d0e13] space-y-4">
            <div className="space-y-1.5 text-xs text-white/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-white font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-mono text-white">
                  {subtotal >= freeShippingThreshold ? 'Free' : '$10.00'}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                <span>Estimated Total</span>
                <span className="font-mono text-base text-amber-300">
                  ${(subtotal + (subtotal >= freeShippingThreshold ? 0 : 10)).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Guest Checkout Button */}
            <button
              id="proceed-checkout-btn"
              type="button"
              onClick={onProceedToCheckout}
              className="w-full py-3.5 bg-white hover:bg-white/90 text-black font-bold uppercase tracking-wider text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/40 active:scale-[0.99] transition-all"
            >
              <span>Proceed to Guest Checkout</span>
              <ArrowRight size={16} />
            </button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-white/50">
              <ShieldCheck size={12} className="text-emerald-400" />
              <span>Instant Guest Checkout • No Registration Required</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
