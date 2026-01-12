'use client';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface Product {
  id: string;
  name_tr: string;
  name_en: string;
  desc_tr: string | null;
  desc_en: string | null;
  price: any;
  image: string | null;
  isAvailable?: boolean;
}

interface ProductCardProps {
  product: Product;
  locale: string;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, locale, viewMode = 'list' }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const name = locale === 'en' ? product.name_en : product.name_tr;
  const desc = locale === 'en' ? product.desc_en : product.desc_tr;
  const price = parseFloat(product.price.toString());

  const handleAdd = () => {
    setIsAdded(true);
    addToCart(product, locale);
    setTimeout(() => setIsAdded(false), 300);
  };

  const isGrid = viewMode === 'grid';

  return (
    <div
      className={cn(
        "group relative bg-white border border-gray-100 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-orange-100",
        isGrid ? "flex flex-col h-full" : "flex flex-row gap-4 p-3 items-center"
      )}
    >
      {/* Görsel Alanı */}
      <div className={cn(
        "relative overflow-hidden bg-gray-100 shrink-0",
        isGrid ? "w-full aspect-[4/3]" : "w-28 h-28 rounded-2xl"
      )}>
        {product.image ? (
          <Image
            src={product.image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-4xl text-gray-300 bg-gray-50">
            🍽️
          </div>
        )}

        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
              {locale === 'en' ? 'SOLD OUT' : 'TÜKENDİ'}
            </span>
          </div>
        )}
      </div>

      {/* İçerik */}
      <div className={cn(
        "flex flex-col flex-1",
        isGrid ? "p-5" : "py-1 pr-2"
      )}>
        <div className="flex-1">
          <h3 className={cn("font-bold text-gray-900 leading-tight group-hover:text-[#FF6B00] transition-colors", isGrid ? "text-lg mb-2" : "text-base mb-1")}>
            {name}
          </h3>
          <p className="text-sm leading-relaxed text-gray-500 line-clamp-2">
            {desc}
          </p>
        </div>

        <div className={cn("flex items-center justify-between mt-4")}>
          <span className="text-xl font-black tracking-tight text-gray-900">
            {price.toFixed(0)}<span className="text-sm text-[#FF6B00] ml-0.5">₺</span>
          </span>

          <Button
            size="icon"
            onClick={handleAdd}
            disabled={!product.isAvailable}
            className={cn(
              "rounded-full shadow-lg shadow-orange-500/20 transition-transform",
              isAdded ? "scale-90 bg-green-500" : ""
            )}
          >
            <Plus size={20} strokeWidth={3} className={cn("transition-transform", isAdded && "rotate-90")} />
          </Button>
        </div>
      </div>
    </div>
  );
}