import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Lock,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, PaymentMethodId, ShippingDetails, OrderRecord } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderComplete: (order: OrderRecord) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderComplete,
}) => {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('card');
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Canada',
  });

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Shipping speed
  const [shippingSpeed, setShippingSpeed] = useState<'standard' | 'express'>('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const subtotal = items.reduce((sum, item) => {
    return sum + (item.product.price + item.framePrice) * item.quantity;
  }, 0);

  const baseShipping = subtotal >= 75 ? 0 : 10;
  const shippingFee = shippingSpeed === 'express' ? baseShipping + 15 : baseShipping;
  const taxFee = Number((subtotal * 0.05).toFixed(2));
  const total = subtotal + shippingFee + taxFee;

  const paymentMethodsList = [
    {
      id: 'card' as PaymentMethodId,
      name: 'Credit / Debit Card',
      badge: 'Visa, MC, Amex',
      icon: CreditCard,
    },
    {
      id: 'apple_pay' as PaymentMethodId,
      name: 'Apple Pay',
      badge: '1-Click Touch ID / Face ID',
      icon: Lock,
    },
    {
      id: 'google_pay' as PaymentMethodId,
      name: 'Google Pay',
      badge: 'Fast & Secure',
      icon: Lock,
    },
    {
      id: 'paypal' as PaymentMethodId,
      name: 'PayPal',
      badge: 'Pay via PayPal balance or bank',
      icon: ShieldCheck,
    },
    {
      id: 'klarna' as PaymentMethodId,
      name: 'Klarna',
      badge: `4 x $${(total / 4).toFixed(2)} interest-free`,
      icon: Sparkles,
    },
  ];

  const handleInputChange = (field: keyof ShippingDetails, value: string) => {
    setShippingDetails((prev) => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Form validation
    if (!shippingDetails.fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!shippingDetails.email.trim() || !shippingDetails.email.includes('@')) {
      setErrorMsg('Please provide a valid email for automated order confirmation.');
      return;
    }
    if (!shippingDetails.address.trim()) {
      setErrorMsg('Please enter a delivery street address.');
      return;
    }
    if (!shippingDetails.city.trim()) {
      setErrorMsg('Please enter your city.');
      return;
    }
    if (!shippingDetails.postalCode.trim()) {
      setErrorMsg('Please enter your postal/zip code.');
      return;
    }

    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s+/g, '').length < 12) {
        setErrorMsg('Please provide a valid 16-digit card number.');
        return;
      }
      if (!cardExpiry || cardExpiry.length < 4) {
        setErrorMsg('Please enter a valid card expiration date (MM/YY).');
        return;
      }
      if (!cardCvc || cardCvc.length < 3) {
        setErrorMsg('Please enter a 3 or 4-digit CVC.');
        return;
      }
    }

    setIsSubmitting(true);

    // Simulate payment processing & order dispatch
    setTimeout(() => {
      setIsSubmitting(false);

      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const randomOrder = `SR-2026-${randomDigits}`;
      const randomTrack = `CA-POST-${Math.floor(10000000 + Math.random() * 90000000)}`;

      const currentMethod = paymentMethodsList.find((p) => p.id === paymentMethod);

      const newOrder: OrderRecord = {
        orderId: randomOrder,
        date: new Date().toLocaleDateString('en-CA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        shippingDetails,
        items,
        subtotal,
        shipping: shippingFee,
        tax: taxFee,
        total,
        paymentMethod,
        paymentMethodName: currentMethod ? currentMethod.name : 'Card',
        trackingNumber: randomTrack,
        estimatedDelivery: shippingSpeed === 'express' ? '3-5 Business Days' : '6-9 Business Days',
        emailNotificationSent: true,
        notificationTimestamp: new Date().toISOString(),
      };

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }

      onOrderComplete(newOrder);
    }, 1200);
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="checkout-modal"
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#14151b] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl my-auto text-white"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#14151b]/95 backdrop-blur-md z-10">
          <div>
            <div className="flex items-center gap-2">
              <h2
                className="text-xl sm:text-2xl font-bold tracking-wide"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                GUEST CHECKOUT
              </h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full">
                Encrypted 256-Bit SSL
              </span>
            </div>
            <p className="text-xs text-white/60 mt-0.5">
              No account required. Automated confirmation & receipt will be emailed immediately.
            </p>
          </div>
          <button
            id="close-checkout-btn"
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Shipping & Payment Method (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer & Delivery Info */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-white text-black text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Contact & Shipping Address
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                    Email Address (for automated confirmation receipt) *
                  </label>
                  <input
                    id="checkout-email-input"
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={shippingDetails.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-white/40"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                      Full Recipient Name *
                    </label>
                    <input
                      id="checkout-name-input"
                      type="text"
                      required
                      placeholder="e.g. Jordan Miller"
                      value={shippingDetails.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                      Phone (for courier updates)
                    </label>
                    <input
                      id="checkout-phone-input"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={shippingDetails.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-white/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                    Street Address *
                  </label>
                  <input
                    id="checkout-address-input"
                    type="text"
                    required
                    placeholder="123 King Street West"
                    value={shippingDetails.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-white/40"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                      City *
                    </label>
                    <input
                      id="checkout-city-input"
                      type="text"
                      required
                      placeholder="Toronto"
                      value={shippingDetails.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                      Province / State
                    </label>
                    <input
                      id="checkout-state-input"
                      type="text"
                      placeholder="ON"
                      value={shippingDetails.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                      Postal Code *
                    </label>
                    <input
                      id="checkout-postal-input"
                      type="text"
                      required
                      placeholder="M5V 1L9"
                      value={shippingDetails.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/40"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Speed Option */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-2">
                Shipping Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShippingSpeed('standard')}
                  className={`p-3 rounded-xl border text-left flex items-start justify-between cursor-pointer transition-all ${
                    shippingSpeed === 'standard'
                      ? 'border-white bg-white/10 text-white'
                      : 'border-white/10 bg-white/5 text-white/70'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold">Standard Archival Tube</p>
                    <p className="text-[10px] text-white/50">6-9 business days</p>
                  </div>
                  <span className="text-xs font-mono font-semibold">
                    {baseShipping === 0 ? 'FREE' : '$10.00'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingSpeed('express')}
                  className={`p-3 rounded-xl border text-left flex items-start justify-between cursor-pointer transition-all ${
                    shippingSpeed === 'express'
                      ? 'border-white bg-white/10 text-white'
                      : 'border-white/10 bg-white/5 text-white/70'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold">Priority Express Air</p>
                    <p className="text-[10px] text-white/50">3-5 business days</p>
                  </div>
                  <span className="text-xs font-mono font-semibold">
                    ${(baseShipping + 15).toFixed(2)}
                  </span>
                </button>
              </div>
            </div>

            {/* Step 2: Multiple Payment Methods */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-white text-black text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Payment Method
                </h3>
              </div>

              {/* Payment selector tabs */}
              <div className="space-y-2 mb-4">
                {paymentMethodsList.map((pm) => {
                  const Icon = pm.icon;
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <div
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'border-white bg-white/10 text-white shadow-inner'
                          : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-white bg-white' : 'border-white/30'}`}>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-black" />}
                        </div>
                        <Icon size={18} className={isSelected ? 'text-white' : 'text-white/60'} />
                        <div>
                          <p className="text-xs sm:text-sm font-semibold">{pm.name}</p>
                          <p className="text-[10px] text-white/50">{pm.badge}</p>
                        </div>
                      </div>

                      {pm.id === 'apple_pay' && (
                        <span className="text-xs font-black tracking-wider bg-black/40 px-2 py-1 rounded border border-white/20">
                          Pay
                        </span>
                      )}
                      {pm.id === 'google_pay' && (
                        <span className="text-xs font-bold tracking-wider bg-black/40 px-2 py-1 rounded border border-white/20">
                          GPay
                        </span>
                      )}
                      {pm.id === 'paypal' && (
                        <span className="text-xs font-black tracking-wider text-blue-300 italic">
                          PayPal
                        </span>
                      )}
                      {pm.id === 'klarna' && (
                        <span className="text-xs font-bold bg-[#ffb3c7] text-black px-2 py-0.5 rounded font-mono">
                          Klarna.
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Conditional inputs for Card */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-white/40 font-mono"
                      />
                      <CreditCard size={16} className="absolute right-3 top-2.5 text-white/40" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        placeholder="12/28"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-white/40 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1">
                        CVC Security Code
                      </label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-white/40 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Non-card instructions */}
              {paymentMethod !== 'card' && (
                <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 text-xs text-white/70 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>
                    You will complete payment seamlessly with {paymentMethodsList.find(p => p.id === paymentMethod)?.name}. No account creation required.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Review & Submit (5 cols) */}
          <div className="lg:col-span-5 bg-[#0e0f14] p-5 sm:p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div>
              <h3
                className="text-base font-bold uppercase tracking-wider text-white mb-4 pb-2 border-b border-white/10"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} Items)
              </h3>

              <div className="max-h-56 overflow-y-auto space-y-3 mb-4 pr-1">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-12 h-14 object-cover rounded-md bg-black shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{item.product.title}</p>
                      <p className="text-[11px] text-white/50">{item.selectedDimension} × {item.quantity}</p>
                      {item.frameOption !== 'Unframed' && (
                        <p className="text-[10px] text-amber-200/80 truncate">{item.frameOption}</p>
                      )}
                    </div>
                    <span className="font-mono text-white font-semibold">
                      ${((item.product.price + item.framePrice) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2 py-3 border-t border-white/10 text-xs text-white/70">
                <div className="flex justify-between">
                  <span>Prints Subtotal</span>
                  <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping ({shippingSpeed === 'express' ? 'Priority Express' : 'Standard Tube'})</span>
                  <span className="font-mono text-white">
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-mono text-white">${taxFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                  <span>Total Amount</span>
                  <span className="font-mono text-lg text-amber-300">${total.toFixed(2)} CAD</span>
                </div>
              </div>

              {/* Automated email notification disclaimer */}
              <div className="mt-4 p-3 bg-white/5 border border-white/5 rounded-xl text-[11px] text-white/60 space-y-1">
                <p className="font-semibold text-white/90 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-amber-400" />
                  Automated Notification System:
                </p>
                <p>
                  Upon completion, an official order confirmation & tracking dispatch will be automatically triggered to your email and cc'd to <strong>sheldonr.ca@gmail.com</strong>.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                id="place-order-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-white hover:bg-white/90 text-black font-extrabold uppercase tracking-wider text-xs sm:text-sm rounded-xl cursor-pointer transition-all shadow-xl shadow-black/50 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Authorizing Payment & Sending Receipt...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>
                      Pay ${total.toFixed(2)} with {paymentMethodsList.find(p => p.id === paymentMethod)?.name}
                    </span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-white/40">
                <span className="flex items-center gap-1">
                  <Truck size={12} /> Packed in Heavy Archival Tube
                </span>
                <span>•</span>
                <span>Customer Care: sheldonr.ca@gmail.com</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
