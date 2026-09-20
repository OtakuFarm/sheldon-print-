import React, { useState } from 'react';
import {
  CheckCircle2,
  Mail,
  Printer,
  ExternalLink,
  Copy,
  Check,
  Send,
  Sparkles,
  PackageCheck,
  X,
} from 'lucide-react';
import { OrderRecord } from '../types';
import { ARTIST_INFO } from '../data/prints';

interface EmailConfirmationModalProps {
  order: OrderRecord | null;
  onClose: () => void;
  onViewOrdersHistory?: () => void;
}

export const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({
  order,
  onClose,
  onViewOrdersHistory,
}) => {
  if (!order) return null;

  const [activeTab, setActiveTab] = useState<'email' | 'receipt'>('email');
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [testEmailInput, setTestEmailInput] = useState(order.shippingDetails.email);

  const copyTracking = () => {
    navigator.clipboard.writeText(order.trackingNumber);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const handleResend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailInput.includes('@')) return;
    setResendStatus('sending');
    setTimeout(() => {
      setResendStatus('sent');
      setTimeout(() => setResendStatus(null), 3000);
    }, 900);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="email-confirmation-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="email-confirmation-modal"
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#131419] border border-white/15 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl my-auto text-white flex flex-col"
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#131419]/95 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  className="text-lg sm:text-2xl font-bold tracking-tight"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  ORDER CONFIRMED #{order.orderId}
                </h2>
                <span className="bg-emerald-400/15 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-400/30">
                  Paid
                </span>
              </div>
              <p className="text-xs text-white/60">
                Automated confirmation email generated & dispatched to{' '}
                <strong className="text-white">{order.shippingDetails.email}</strong>
              </p>
            </div>
          </div>

          <button
            id="close-confirmation-modal-btn"
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status ribbon */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-black/40 border-b border-emerald-500/20 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-300">
            <Sparkles size={14} />
            <span className="font-semibold">Automated Notification System:</span>
            <span className="text-white/80">
              Dispatched at {new Date(order.notificationTimestamp).toLocaleTimeString()}
            </span>
          </div>

          {/* Tab switcher: Automated Email Preview vs Order Receipt */}
          <div className="flex items-center bg-white/10 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('email')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'email' ? 'bg-white text-black' : 'text-white/70 hover:text-white'
              }`}
            >
              <Mail size={13} />
              <span>Automated Email Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('receipt')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'receipt' ? 'bg-white text-black' : 'text-white/70 hover:text-white'
              }`}
            >
              <PackageCheck size={13} />
              <span>Printable Receipt</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">
          {activeTab === 'email' ? (
            /* Automated Email Client Simulation */
            <div className="border border-white/15 rounded-2xl bg-[#0e0f13] overflow-hidden shadow-2xl">
              {/* Email Client Header bar */}
              <div className="bg-[#181920] px-5 py-3 border-b border-white/10 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-white/50 text-[11px]">
                  <span>System: <strong>Automated Order Dispatch Service</strong></span>
                  <span>Status: <strong className="text-emerald-400">Delivered (250 OK)</strong></span>
                </div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-white/40 uppercase font-mono text-[10px]">From:</span>
                  <span className="text-white font-medium">
                    Sheldon Ruddock Prints &lt;orders@sheldonr.ca&gt;
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-white/40 uppercase font-mono text-[10px]">To:</span>
                  <span className="text-white font-medium">
                    {order.shippingDetails.fullName} &lt;{order.shippingDetails.email}&gt;
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-white/40 uppercase font-mono text-[10px]">CC:</span>
                  <span className="text-amber-200/90 font-mono">
                    sheldonr.ca@gmail.com
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-2 pt-1 border-t border-white/5">
                  <span className="text-white/40 uppercase font-mono text-[10px]">Subject:</span>
                  <span className="text-white font-bold">
                    Order Confirmed #{order.orderId} — Sheldon Ruddock Fine Art Prints
                  </span>
                </div>
              </div>

              {/* Email Body HTML Render */}
              <div className="p-6 sm:p-8 bg-[#fafafa] text-[#1a1a1a] font-sans">
                {/* Email Header */}
                <div className="border-b-2 border-[#111] pb-6 mb-6 flex items-start justify-between">
                  <div>
                    <h1
                      className="text-2xl sm:text-3xl font-black tracking-tight text-black"
                      style={{ fontFamily: "'Anton', sans-serif" }}
                    >
                      SHELDON RUDDOCK
                    </h1>
                    <p className="text-xs uppercase tracking-widest text-[#666] font-mono mt-0.5">
                      Analog Film & Archival Fine Art Prints
                    </p>
                  </div>
                  <div className="text-right text-xs text-[#666]">
                    <p className="font-mono font-bold text-black">{order.orderId}</p>
                    <p>{order.date}</p>
                  </div>
                </div>

                {/* Email Intro */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-black mb-1">
                    Thank you for your order, {order.shippingDetails.fullName.split(' ')[0]}!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#444] leading-relaxed">
                    Your order has been received and confirmed. Each fine art print is individually produced using museum-grade archival pigments on 100% cotton rag paper and hand-inspected before dispatch.
                  </p>
                </div>

                {/* Tracking & Shipping Details */}
                <div className="bg-[#f0f0f3] p-4 rounded-xl mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#888] uppercase tracking-wider block text-[10px] font-mono">
                      Estimated Delivery Window
                    </span>
                    <strong className="text-black text-sm">{order.estimatedDelivery}</strong>
                    <p className="text-[#666] mt-0.5">Dispatched via Canada Post Archival Flat/Tube</p>
                  </div>
                  <div>
                    <span className="text-[#888] uppercase tracking-wider block text-[10px] font-mono">
                      Tracking Reference
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <strong className="text-black font-mono text-sm">{order.trackingNumber}</strong>
                      <button
                        type="button"
                        onClick={copyTracking}
                        className="text-[#666] hover:text-black p-1 transition-colors"
                        title="Copy tracking"
                      >
                        {copiedTracking ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Items Ordered Table */}
                <div className="mb-6 border border-[#e5e5e5] rounded-xl overflow-hidden">
                  <div className="bg-[#f5f5f7] px-4 py-2 text-[11px] font-bold text-[#555] uppercase tracking-wider grid grid-cols-12">
                    <span className="col-span-7">Print / Item</span>
                    <span className="col-span-2 text-center">Qty</span>
                    <span className="col-span-3 text-right">Price</span>
                  </div>
                  <div className="divide-y divide-[#eee]">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="px-4 py-3 grid grid-cols-12 items-center text-xs">
                        <div className="col-span-7 flex items-center gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-10 h-12 object-cover rounded bg-[#eee] border border-[#ddd] shrink-0"
                          />
                          <div>
                            <p className="font-bold text-black">{item.product.title}</p>
                            <p className="text-[11px] text-[#666] font-mono">{item.selectedDimension}</p>
                            {item.frameOption !== 'Unframed' && (
                              <p className="text-[10px] text-[#888]">{item.frameOption}</p>
                            )}
                          </div>
                        </div>
                        <span className="col-span-2 text-center font-mono text-black font-medium">
                          {item.quantity}
                        </span>
                        <span className="col-span-3 text-right font-mono text-black font-semibold">
                          ${((item.product.price + item.framePrice) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary Totals in Email */}
                  <div className="bg-[#fafafc] px-4 py-3 border-t border-[#e5e5e5] text-xs space-y-1">
                    <div className="flex justify-between text-[#666]">
                      <span>Subtotal</span>
                      <span className="font-mono text-black">${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#666]">
                      <span>Shipping</span>
                      <span className="font-mono text-black">
                        {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#666]">
                      <span>Tax (5%)</span>
                      <span className="font-mono text-black">${order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-black pt-2 border-t border-[#ddd]">
                      <span>Total Paid ({order.paymentMethodName})</span>
                      <span className="font-mono">${order.total.toFixed(2)} CAD</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Destination */}
                <div className="border-t border-[#eee] pt-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#555]">
                  <div>
                    <strong className="block text-black mb-1 uppercase tracking-wider text-[10px] font-mono">
                      Ship To
                    </strong>
                    <p className="text-black font-medium">{order.shippingDetails.fullName}</p>
                    <p>{order.shippingDetails.address}</p>
                    <p>
                      {order.shippingDetails.city}, {order.shippingDetails.state} {order.shippingDetails.postalCode}
                    </p>
                    <p>{order.shippingDetails.country}</p>
                  </div>
                  <div>
                    <strong className="block text-black mb-1 uppercase tracking-wider text-[10px] font-mono">
                      Artist Support & Inquiries
                    </strong>
                    <p>If you have any questions or custom framing notes, reply directly to:</p>
                    <p className="mt-1">
                      <a
                        href={`mailto:${ARTIST_INFO.email}`}
                        className="text-blue-700 underline font-semibold font-mono"
                      >
                        {ARTIST_INFO.email}
                      </a>
                    </p>
                    <p className="mt-1 text-[11px] text-[#888]">
                      Portfolio: <a href={`https://${ARTIST_INFO.website}`} className="underline" target="_blank" rel="noreferrer">{ARTIST_INFO.website}</a>
                    </p>
                  </div>
                </div>

                {/* Print Care Advice */}
                <div className="bg-[#f9f9fb] p-3.5 rounded-lg border border-[#ececef] text-[11px] text-[#666] leading-relaxed">
                  <strong className="text-black">Archival Handling Guide:</strong> Please handle by edges with clean hands. Avoid direct exposure to prolonged unshielded UV sunlight. For maximum longevity, use acid-free archival mats when framing.
                </div>
              </div>
            </div>
          ) : (
            /* Printable Clean Receipt View */
            <div className="bg-[#0f1014] p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
              <div className="flex justify-between items-start border-b border-white/10 pb-4">
                <div>
                  <h3
                    className="text-xl font-bold tracking-wider"
                    style={{ fontFamily: "'Anton', sans-serif" }}
                  >
                    TAX INVOICE & RECEIPT
                  </h3>
                  <p className="text-xs text-white/60">Sheldon Ruddock Photography Studio</p>
                  <p className="text-xs text-amber-200/80 font-mono">sheldonr.ca@gmail.com</p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-mono text-white font-bold">Invoice #{order.orderId}</p>
                  <p className="text-white/60">{order.date}</p>
                  <span className="inline-block mt-1 bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-mono">
                    PAID IN FULL
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs py-2 border-b border-white/5">
                    <div>
                      <p className="font-bold text-white">{item.product.title}</p>
                      <p className="text-white/50 text-[11px]">
                        {item.selectedDimension} • {item.frameOption} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono text-white font-semibold">
                      ${((item.product.price + item.framePrice) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="border-t border-white/10 pt-3 space-y-1.5 text-xs text-white/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-mono text-white">${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST/HST (5%)</span>
                  <span className="font-mono text-white">${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                  <span>Total Paid</span>
                  <span className="font-mono text-amber-300">${order.total.toFixed(2)} CAD</span>
                </div>
              </div>
            </div>
          )}

          {/* Automated System Tools: Resend / Test Notification to any Email */}
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Mail size={14} className="text-amber-300" />
                Resend Automated Order Confirmation
              </span>
              <p className="text-white/50 text-[11px]">
                Send an additional copy of this confirmation email to any inbox.
              </p>
            </div>

            <form onSubmit={handleResend} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="email"
                required
                value={testEmailInput}
                onChange={(e) => setTestEmailInput(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white/40 font-mono w-full sm:w-56"
                placeholder="recipient@email.com"
              />
              <button
                type="submit"
                disabled={resendStatus === 'sending'}
                className="px-3 py-1.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-white/90 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {resendStatus === 'sending' ? (
                  <span>Sending...</span>
                ) : resendStatus === 'sent' ? (
                  <>
                    <Check size={14} className="text-emerald-600" /> Sent!
                  </>
                ) : (
                  <>
                    <Send size={13} /> Resend
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-white/10 bg-[#101116] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-2 transition-colors border border-white/10"
            >
              <Printer size={15} />
              <span>Print Invoice</span>
            </button>
            {onViewOrdersHistory && (
              <button
                type="button"
                onClick={onViewOrdersHistory}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/5"
              >
                <span>View Order History</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-white text-black text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-white/90 active:scale-95 transition-all cursor-pointer shadow-lg shadow-black/40"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
