'use client';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/app/actions/order';
import { Trash2, ShoppingBag, ArrowRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '../ui/Button';

export default function CartSidebar({ locale, isMobile = false }: { locale: string, isMobile?: boolean }) {
  const { items, total, removeFromCart, clearCart } = useCart();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const searchParams = useSearchParams();
  const tableId = searchParams.get('tableId');
  const [isOpen, setIsOpen] = useState(false);

  const handleOrder = async () => {
    if (!tableId) return alert(locale === 'en' ? 'Table not found!' : 'Masa bilgisi bulunamadı!');
    setStatus('loading');
    const res = await createOrder(tableId, items, total);
    if (res.success) {
      setStatus('success');
      clearCart();
      setTimeout(() => { setStatus('idle'); setIsOpen(false); }, 3000);
    } else {
      alert('Hata!'); setStatus('idle');
    }
  };

  if (isMobile) {
    if (items.length === 0) return null;
    return (
      <>
        {/* Floating Button */}
        {!isOpen && (
          <div className="fixed left-0 z-50 w-full px-6 bottom-6">
            <button
              onClick={() => setIsOpen(true)}
              className="w-full bg-[#1A1A1A] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between animate-fade-in hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#FF6B00] w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  {items.reduce((a, b) => a + b.quantity, 0)}
                </div>
                <div className="flex flex-col items-start gap-1 leading-none">
                  <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">{locale === 'en' ? 'Total' : 'Toplam'}</span>
                  <span className="text-lg font-bold">{total.toFixed(0)} ₺</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold">
                {locale === 'en' ? 'View Cart' : 'Sepeti Gör'} <ArrowRight size={16} />
              </div>
            </button>
          </div>
        )}

        {/* Mobile Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex flex-col justify-end">
            <div className="bg-white rounded-t-3xl h-[85vh] flex flex-col animate-slide-up overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <ShoppingBag className="text-[#FF6B00]" />
                  {locale === 'en' ? 'Your Order' : 'Siparişiniz'}
                </h2>
                <button onClick={() => setIsOpen(false)} className="p-2 font-bold text-gray-400 hover:text-gray-900">Kapat</button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <CartContent items={items} locale={locale} removeFromCart={removeFromCart} total={total} />
              </div>
              <div className="p-6 border-t bg-gray-50">
                 <CartActions status={status} handleOrder={handleOrder} locale={locale} total={total} />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm sticky top-24 h-fit min-h-[400px] flex flex-col">
      <h2 className="flex items-center gap-2 mb-6 text-xl font-black text-gray-900">
        <ShoppingBag className="text-[#FF6B00]" />
        {locale === 'en' ? 'Your Order' : 'Sipariş Özeti'}
      </h2>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 py-10 text-gray-400">
          <ShoppingBag size={64} className="opacity-10" />
          <p className="text-sm font-medium">Sepetiniz boş.</p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto mb-6 pr-2 max-h-[50vh] custom-scrollbar">
            <CartContent items={items} locale={locale} removeFromCart={removeFromCart} total={total} />
          </div>
          <div className="pt-6 mt-auto border-t border-gray-200 border-dashed">
            <CartActions status={status} handleOrder={handleOrder} locale={locale} total={total} />
          </div>
        </>
      )}
    </div>
  );
}

function CartContent({ items, locale, removeFromCart, total }: any) {
  return (
    <div className="space-y-4">
      {items.map((item: any) => (
        <div key={item.id} className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF6B00] flex items-center justify-center font-bold text-sm border border-orange-100">
              {item.quantity}x
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{item.name}</p>
              <p className="text-xs text-gray-500">{item.price} ₺</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">{(item.price * item.quantity).toFixed(0)} ₺</span>
            <button
              onClick={() => removeFromCart(item.id)}
              className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function CartActions({ status, handleOrder, locale, total }: any) {
  if (status === 'success') {
    return (
      <div className="p-6 text-center border border-green-100 bg-green-50 rounded-xl animate-fade-in">
        <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
        <h3 className="font-bold text-green-700">Sipariş Alındı!</h3>
        <p className="text-xs text-green-600">Mutfağa iletildi, hazırlanıyor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-lg font-bold text-gray-900">
        <span>Toplam</span>
        <span className="text-[#FF6B00] text-2xl">{total.toFixed(0)} ₺</span>
      </div>
      <Button
        onClick={handleOrder}
        isLoading={status === 'loading'}
        className="w-full py-6 text-lg shadow-orange-500/25"
      >
        {locale === 'en' ? 'Confirm Order' : 'Siparişi Onayla'}
      </Button>
    </div>
  );
}