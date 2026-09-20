import React from 'react';
import { X, Mail, Package, ChevronRight, CheckCircle2 } from 'lucide-react';
import { OrderRecord } from '../types';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderRecord[];
  onSelectOrder: (order: OrderRecord) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  onSelectOrder,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="order-history-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="order-history-modal"
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#131419] border border-white/15 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl my-auto text-white p-6"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Mail size={18} />
            </div>
            <div>
              <h3
                className="text-xl font-bold tracking-wide"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                AUTOMATED ORDER NOTIFICATIONS
              </h3>
              <p className="text-xs text-white/60">
                Dispatched email confirmations & order receipts
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-white/40 space-y-2">
            <Package size={36} className="mx-auto opacity-50" />
            <p className="text-sm">No orders placed in this session yet.</p>
            <p className="text-xs text-white/30">
              When you purchase any print, your automated email confirmation will be archived here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.orderId}
                onClick={() => {
                  onSelectOrder(ord);
                  onClose();
                }}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">
                      #{ord.orderId}
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                      <CheckCircle2 size={10} /> Email Sent
                    </span>
                  </div>
                  <p className="text-xs text-white/60">
                    {ord.items.length} items • ${ord.total.toFixed(2)} CAD • {ord.date}
                  </p>
                  <p className="text-[11px] text-white/40 truncate">
                    Sent to: {ord.shippingDetails.email}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-white/70 group-hover:text-white font-medium">
                  <span>View Email</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-white/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
