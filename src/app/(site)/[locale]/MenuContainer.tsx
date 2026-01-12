'use client';

import { useState } from 'react';
import CategoryNav from '@/components/menu/CategoryNav';
import ProductCard from '@/components/menu/ProductCard';
import CartSidebar from '@/components/menu/CartSidebar';
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
    <div className="min-h-screen px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">

      {/* 1. Header & Search (Responsive) */}
      <div className="flex flex-col justify-between gap-4 mb-8 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">
            {locale === 'en' ? 'Delicious Menu 😋' : 'Lezzetli Menü 😋'}
          </h2>
          <p className="mt-1 text-gray-500">
            {locale === 'en' ? 'Choose what you want to eat.' : 'Ne yemek istediğinizi seçin.'}
          </p>
        </div>

        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#FF6B00] transition-colors" />
          </div>
          <input
            type="text"
            placeholder={locale === 'en' ? "Search food..." : "Yemek ara..."}
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent transition-all shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 2. Main Grid Layout */}
      <div className="relative grid items-start grid-cols-1 gap-8 lg:grid-cols-12">

        {/* LEFT COLUMN: Categories (Desktop Sticky) */}
        <div className="hidden lg:block lg:col-span-2">
          <CategoryNav
            categories={categories}
            activeId={activeCat}
            onSelect={(id) => {
              setActiveCat(id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            locale={locale}
            isDesktop={true}
          />
        </div>

        {/* MIDDLE COLUMN: Products */}
        <div className="w-full space-y-6 lg:col-span-7">
          {/* Mobile Category Nav (Horizontal) */}
          <div className="-mx-4 lg:hidden sm:mx-0">
             <CategoryNav
              categories={categories}
              activeId={activeCat}
              onSelect={setActiveCat}
              locale={locale}
              isDesktop={false}
            />
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-fade-in">
              {filteredProducts.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                  viewMode="grid"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-gray-200 border-dashed rounded-3xl">
              <div className="mb-4 text-6xl">🔍</div>
              <h3 className="text-lg font-bold text-gray-900">Sonuç Bulunamadı</h3>
              <p className="text-gray-500">Farklı bir arama yapmayı deneyin.</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Cart (Desktop Sticky) */}
        <div className="hidden lg:block lg:col-span-3">
          <CartSidebar locale={locale} />
        </div>

      </div>

      {/* MOBILE CART (Fixed Bottom) */}
      <div className="lg:hidden">
        <CartSidebar locale={locale} isMobile={true} />
      </div>
    </div>
  );
}