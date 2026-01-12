'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const toggleLanguage = () => {
    const newLocale = locale === 'tr' ? 'en' : 'tr';
    // URL'deki dil segmentini değiştir
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.replace(newPath);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition"
    >
      <Globe size={16} />
      {locale.toUpperCase()}
    </button>
  );
}