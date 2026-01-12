'use client';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

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
}

export default function ProductCard({ product, locale }: ProductCardProps) {
  const { addToCart } = useCart();

  const name = locale === 'en' ? product.name_en : product.name_tr;
  const desc = locale === 'en' ? product.desc_en : product.desc_tr;
  const price = parseFloat(product.price.toString()).toFixed(0);

  return (
    <div className="flex gap-4 p-3 bg-white border border-gray-100 shadow-sm rounded-2xl">
      <div className="relative flex-shrink-0 w-24 h-24 overflow-hidden bg-gray-100 rounded-xl">
        {product.image ? (
          <Image src={product.image} alt={name} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-2xl">🍔</div>
        )}
      </div>

      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="mb-1 font-bold leading-tight text-gray-800">{name}</h3>
          <p className="text-xs text-gray-500 line-clamp-2">{desc}</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-primary">{price} ₺</span>
          <button
            onClick={() => addToCart(product, locale)}
            className="flex items-center justify-center w-8 h-8 text-white transition rounded-full shadow-md bg-secondary active:scale-90 hover:bg-primary"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}