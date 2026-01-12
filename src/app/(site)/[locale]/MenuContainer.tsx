'use client';

import { useState } from 'react';
import CategoryNav from '@/components/menu/CategoryNav';
import ProductCard from '@/components/menu/ProductCard';
import { Search } from 'lucide-react';

export default function MenuContainer({ categories, locale }: { categories: any[], locale: string }) {
  const [activeCat, setActiveCat] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtreleme Mantığı
  const filteredProducts = categories.flatMap(cat => {
    // Kategori Filtresi
    if (activeCat !== 'all' && cat.id !== activeCat) return [];

    // Arama Filtresi ve Ürün Dönüşümü
    return cat.products.filter((p: any) => {
      const name = locale === 'en' ? p.name_en : p.name_tr;
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  return (
    <>
      {/* Kategori Navigasyonu */}
      <CategoryNav
        categories={categories}
        activeId={activeCat}
        onSelect={setActiveCat}
        locale={locale}
      />

      {/* Arama Çubuğu */}
      <div className="px-4 mt-4">
        <div className="relative">
          <Search className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" size={18} />
          <input
            type="text"
            placeholder={locale === 'en' ? "Search for food..." : "Yemek ara..."}
            className="w-full py-3 pl-10 pr-4 text-sm bg-white border-none shadow-sm outline-none rounded-xl focus:ring-2 focus:ring-primary/20"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Ürün Listesi */}
      <div className="px-4 mt-6 space-y-4 min-h-[50vh]">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))
        ) : (
          <div className="py-10 text-center text-gray-400">
            <p>😔</p>
            <p className="mt-2 text-sm">Aradığınız ürün bulunamadı.</p>
          </div>
        )}
      </div>
    </>
  );
}