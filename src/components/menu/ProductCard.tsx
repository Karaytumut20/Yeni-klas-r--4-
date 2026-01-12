'use client';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

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
  index: number;
}

export default function ProductCard({ product, locale, index }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isPressed, setIsPressed] = useState(false);

  const name = locale === 'en' ? product.name_en : product.name_tr;
  const desc = locale === 'en' ? product.desc_en : product.desc_tr;
  const price = parseFloat(product.price.toString()).toFixed(0);

  const handleAdd = () => {
    setIsPressed(true);
    addToCart(product, locale);
    setTimeout(() => setIsPressed(false), 200);
  };

  return (
    <div
      className="group relative flex gap-4 p-4 bg-white border border-gray-100/50 shadow-sm rounded-[2rem] hover:shadow-lg transition-all duration-300 overflow-hidden"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Görsel Alanı */}
      <div className="relative overflow-hidden shadow-inner shrink-0 w-28 h-28 bg-gray-50 rounded-2xl">
        {product.image ? (
          <Image
            src={product.image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-3xl text-orange-200 bg-orange-50">
            🍽️
          </div>
        )}
      </div>

      {/* İçerik */}
      <div className="flex flex-col justify-between flex-1 py-1">
        <div>
          <h3 className="mb-1 text-lg font-bold leading-tight text-gray-900">{name}</h3>
          <p className="text-xs leading-relaxed text-gray-500 line-clamp-2">{desc}</p>
        </div>

        <div className="flex items-end justify-between mt-2">
          <span className="text-xl font-black tracking-tight text-gray-900">
            {price}<span className="text-sm align-top text-primary ml-0.5">₺</span>
          </span>

          <button
            onClick={handleAdd}
            className={`
              flex items-center justify-center w-10 h-10 rounded-full text-white shadow-lg shadow-primary/30
              transition-all duration-200 active:scale-90
              ${isPressed ? 'bg-green-500 rotate-90' : 'bg-primary hover:bg-orange-600'}
            `}
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}