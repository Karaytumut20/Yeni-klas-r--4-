'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

interface Category {
  id: string;
  name_tr: string;
  name_en: string;
}

interface CategoryNavProps {
  categories: Category[];
  activeId: string;
  onSelect: (id: string) => void;
  locale: string;
  isDesktop?: boolean;
}

export default function CategoryNav({ categories, activeId, onSelect, locale, isDesktop = false }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const buttonClass = (id: string) => cn(
    "flex items-center rounded-xl transition-all duration-300 font-bold border cursor-pointer",
    isDesktop
      ? "w-full px-4 py-3 text-left border-transparent hover:bg-gray-100"
      : "flex-shrink-0 px-5 py-2.5 text-sm border",

    activeId === id
      ? isDesktop
        ? "bg-orange-50 text-[#FF6B00] border-orange-100 shadow-sm"
        : "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg scale-105"
      : "bg-white text-gray-500 border-transparent hover:bg-gray-50"
  );

  const containerClass = isDesktop
    ? "flex flex-col space-y-2 w-full"
    : "flex gap-3 px-6 overflow-x-auto no-scrollbar scroll-smooth py-4";

  const allLabel = locale === 'en' ? 'All' : 'Tümü';

  return (
    <div className={cn(isDesktop ? "sticky top-24" : "sticky top-[72px] z-30 bg-gray-50/95 backdrop-blur-md border-b border-gray-200/50")}>
      {!isDesktop && <div className="absolute inset-y-0 right-0 w-12 pointer-events-none bg-gradient-to-l from-gray-50 to-transparent" />}

      <div ref={scrollRef} className={containerClass}>
        <button
          onClick={() => onSelect('all')}
          className={buttonClass('all')}
        >
          {isDesktop && <span className="mr-3 text-lg">🍽️</span>}
          {allLabel}
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={buttonClass(cat.id)}
          >
            {isDesktop && <span className="mr-3 text-lg opacity-70">👉</span>}
            {locale === 'en' ? cat.name_en : cat.name_tr}
            {isDesktop && activeId === cat.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}