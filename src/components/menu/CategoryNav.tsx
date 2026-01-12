'use client';

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
}

export default function CategoryNav({ categories, activeId, onSelect, locale }: CategoryNavProps) {
  return (
    <div className="sticky top-[72px] z-30 py-3 bg-surface/95 backdrop-blur-xl border-b border-gray-100/50">
      <div className="flex gap-3 px-6 overflow-x-auto no-scrollbar scroll-smooth">
        <button
          onClick={() => onSelect('all')}
          className={`
            flex-shrink-0 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 border
            ${activeId === 'all'
              ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-900/20 scale-105'
              : 'bg-white text-gray-500 border-transparent hover:bg-gray-100'}
          `}
        >
          {locale === 'en' ? 'All' : 'Tümü'}
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`
              flex-shrink-0 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 border
              ${activeId === cat.id
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-105'
                : 'bg-white text-gray-500 border-transparent hover:bg-gray-100'}
            `}
          >
            {locale === 'en' ? cat.name_en : cat.name_tr}
          </button>
        ))}
      </div>
    </div>
  );
}