'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/app/actions/order';
import { ShoppingBag, X, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function CartSheet({ locale }: { locale: string }) {
  const { items, total, removeFromCart, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const searchParams = useSearchParams();
  const tableId = searchParams.get('tableId');

  const handleOrder = async () => {
    if (!tableId) return alert(locale === 'en' ? 'Table not found!' : 'Masa bilgisi bulunamadı! QR kodu tekrar okutun.');

    setStatus('loading');
    const res = await createOrder(tableId, items, total);

    if (res.success) {
      setStatus('success');
      clearCart();
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
      }, 2000);
    } else {
      alert('Hata oluştu');
      setStatus('idle');
    }
  };

  if (items.length === 0 && !isOpen) return null;

  return (
    <>
      {/* Modern Yüzen Sepet Butonu */}
      {!isOpen && items.length > 0 && (
        <div className="fixed left-0 z-50 flex justify-center w-full px-4 bottom-6">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full max-w-md bg-gray-900 text-white rounded-[1.5rem] p-4 shadow-2xl shadow-gray-900/40 flex items-center justify-between transform transition-all hover:scale-[1.02] active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-full shadow-md bg-primary">
                {items.reduce((a, b) => a + b.quantity, 0)}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-medium text-gray-400 uppercase">{locale === 'en' ? 'Total' : 'Toplam'}</span>
                <span className="text-lg font-bold">{total.toFixed(0)} ₺</span>
              </div>
            </div>
            <div className="flex items-center gap-2 pr-2">
              <span className="font-bold">{locale === 'en' ? 'View Cart' : 'Sepeti Gör'}</span>
              <ArrowRight size={18} />
            </div>
          </button>
        </div>
      )}

      {/* Sepet Paneli Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end sm:justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full bg-surface shadow-2xl sm:max-w-md sm:mx-auto rounded-t-3xl sm:rounded-3xl overflow-hidden h-[85vh] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-white border-b">
              <h2 className="flex items-center gap-2 text-2xl font-black text-gray-900">
                <ShoppingBag className="text-primary" />
                {locale === 'en' ? 'Your Order' : 'Siparişiniz'}
              </h2>
              <button onClick={() => setIsOpen(false)} className="p-2 transition bg-gray-100 rounded-full hover:bg-gray-200">
                <X size={20} />
              </button>
            </div>

            {/* Liste */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ShoppingBag size={48} className="mb-4 opacity-20" />
                  <p>Sepetiniz boş.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 shadow-sm rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 text-sm font-bold rounded-lg bg-primary/10 text-primary">
                        {item.quantity}x
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{item.name}</div>
                        <div className="text-sm font-medium text-gray-500">{item.price} ₺</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900">{(item.price * item.quantity).toFixed(0)} ₺</span>
                      <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-400 transition rounded-full hover:text-red-600 hover:bg-red-50">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 space-y-4 bg-white border-t">
                <div className="flex items-center justify-between text-xl font-black text-gray-900">
                  <span>Toplam</span>
                  <span className="text-primary">{total.toFixed(0)} ₺</span>
                </div>

                {status === 'success' ? (
                  <div className="flex flex-col items-center justify-center p-6 text-green-600 border border-green-100 bg-green-50 rounded-2xl animate-pulse">
                    <CheckCircle size={48} className="mb-2" />
                    <span className="text-lg font-bold">Sipariş Alındı!</span>
                    <span className="text-sm">Mutfağa iletildi.</span>
                  </div>
                ) : (
                  <button
                    onClick={handleOrder}
                    disabled={status === 'loading'}
                    className="flex items-center justify-center w-full gap-2 py-4 text-lg font-bold text-white transition-all shadow-lg bg-primary rounded-2xl shadow-primary/30 hover:bg-orange-600 active:scale-95"
                  >
                    {status === 'loading' && <Loader2 className="animate-spin" />}
                    {locale === 'en' ? 'Confirm Order' : 'Siparişi Onayla'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}