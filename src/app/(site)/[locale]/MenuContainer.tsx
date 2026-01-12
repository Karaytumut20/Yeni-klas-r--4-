'use client';

import { useState } from 'react';
import CategoryNav from '@/components/menu/CategoryNav';
import ProductCard from '@/components/menu/ProductCard';
import { Search } from 'lucide-react';

export default function MenuContainer({ categories, locale }: { categories: any[], locale: string }) {
  const [activeCat, setActiveCat] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = categories.flatMap(cat => {
    if (activeCat !== 'all' && cat.id !== activeCat) return [];
    return cat.products.filter((p: any) => {
      const name = locale === 'en' ? p.name_en : p.name_tr;
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  return (
    <>
      {/* Hero Search Section */}
      <div className="px-6 pt-4 pb-6 bg-surface">
        <h2 className="mb-4 text-2xl font-black leading-tight text-gray-900">
          {locale === 'en' ? 'What would you like\nto eat today? 😋' : 'Bugün ne yemek\nistersiniz? 😋'}
        </h2>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="text-gray-400 transition-colors group-focus-within:text-primary" size={20} />
          </div>
          <input
            type="text"
            placeholder={locale === 'en' ? "Search food, drinks..." : "Yemek, içecek ara..."}
            className="w-full py-4 pl-12 pr-4 font-medium text-gray-800 transition-all bg-white border-2 border-transparent shadow-sm outline-none rounded-2xl focus:border-primary/20 focus:shadow-lg focus:shadow-primary/10 placeholder:text-gray-400"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <CategoryNav
        categories={categories}
        activeId={activeCat}
        onSelect={setActiveCat}
        locale={locale}
      />

      {/* Products List */}
      <div className="px-5 mt-6 pb-32 space-y-5 min-h-[60vh]">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product: any, index: number) => (
            <div key={product.id} className="animate-fade-in">
              <ProductCard product={product} locale={locale} index={index} />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center py-20 text-center opacity-50">
            <div className="mb-4 text-6xl">🔍</div>
            <p className="font-medium text-gray-500">Sonuç bulunamadı.</p>
          </div>
        )}
      </div>
    </>
  );
}