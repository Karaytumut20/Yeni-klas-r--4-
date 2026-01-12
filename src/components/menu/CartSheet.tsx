'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/app/actions/order';
import { ShoppingBag, X, CheckCircle, Loader2 } from 'lucide-react';
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
      {/* Yüzen Sepet Butonu */}
      {!isOpen && items.length > 0 && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed z-50 flex items-center gap-3 px-6 py-3 text-white -translate-x-1/2 rounded-full shadow-xl bottom-6 left-1/2 bg-primary animate-bounce-short"
        >
          <div className="flex items-center justify-center w-6 h-6 text-xs font-bold bg-white rounded-full text-primary">
            {items.reduce((a, b) => a + b.quantity, 0)}
          </div>
          <span className="font-bold">Sepeti Gör</span>
          <span className="opacity-80">|</span>
          <span className="font-bold">{total.toFixed(0)} ₺</span>
        </button>
      )}

      {/* Sepet Paneli (Overlay) */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end sm:justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full p-6 bg-white shadow-2xl sm:max-w-md sm:mx-auto rounded-t-2xl sm:rounded-2xl animate-slide-up">

            {/* Kapat Butonu */}
            <button onClick={() => setIsOpen(false)} className="absolute text-gray-400 top-4 right-4 hover:text-gray-600">
              <X size={24} />
            </button>

            <h2 className="flex items-center gap-2 mb-4 text-xl font-bold">
              <ShoppingBag className="text-primary" />
              {locale === 'en' ? 'Your Order' : 'Siparişiniz'}
            </h2>

            {/* Ürün Listesi */}
            {items.length === 0 ? (
              <div className="py-8 text-center text-gray-500">Sepetiniz boş.</div>
            ) : (
              <div className="max-h-[40vh] overflow-y-auto space-y-4 mb-4 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between pb-2 border-b">
                    <div>
                      <div className="font-bold text-gray-800">{item.name}</div>
                      <div className="text-xs font-bold text-primary">{item.quantity} x {item.price} ₺</div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="px-2 py-1 text-xs text-red-400 rounded bg-red-50">
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Alt Toplam ve Buton */}
            {items.length > 0 && (
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-4 text-lg font-bold">
                  <span>Toplam</span>
                  <span className="text-primary">{total.toFixed(0)} ₺</span>
                </div>

                {status === 'success' ? (
                  <div className="flex items-center justify-center gap-2 p-4 font-bold text-green-700 bg-green-100 rounded-xl">
                    <CheckCircle /> Sipariş Alındı!
                  </div>
                ) : (
                  <button
                    onClick={handleOrder}
                    disabled={status === 'loading'}
                    className="flex items-center justify-center w-full gap-2 py-4 text-lg font-bold text-white transition bg-secondary rounded-xl hover:bg-gray-800"
                  >
                    {status === 'loading' && <Loader2 className="animate-spin" />}
                    {locale === 'en' ? 'Place Order' : 'Siparişi Onayla'}
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