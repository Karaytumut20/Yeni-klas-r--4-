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
    <div className="sticky z-30 py-2 border-b shadow-sm top-16 bg-surface/95 backdrop-blur-sm border-gray-200/50">
      <div className="flex gap-3 px-4 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => onSelect('all')}
          className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all duration-300
            ${activeId === 'all'
              ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
              : 'bg-white text-gray-600 border border-gray-200'}`}
        >
          {locale === 'en' ? 'All' : 'Tümü'}
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all duration-300
              ${activeId === cat.id
                ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            {locale === 'en' ? cat.name_en : cat.name_tr}
          </button>
        ))}
      </div>
    </div>
  );
}