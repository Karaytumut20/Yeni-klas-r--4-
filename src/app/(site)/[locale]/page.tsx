import { PrismaClient } from "@prisma/client";
import { getTranslations } from 'next-intl/server';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import WaiterButton from '@/components/WaiterButton';
import MenuContainer from './MenuContainer';
import { CartProvider } from '@/context/CartContext';

const prisma = new PrismaClient();

interface Props {
  params: { locale: string };
  searchParams: { tableId?: string };
}

export default async function MenuPage({ params: { locale }, searchParams }: Props) {
  const t = await getTranslations('Index');

  const categories = await prisma.category.findMany({
    include: { products: { where: { isAvailable: true } } },
    orderBy: { createdAt: 'asc' }
  });

  let tableName = "";
  if (searchParams.tableId) {
    const table = await prisma.table.findUnique({ where: { id: searchParams.tableId } });
    if (table) tableName = `Masa ${table.number}`;
  }

  // Veri serileştirme
  const serializedCategories = categories.map(cat => ({
    ...cat,
    products: cat.products.map(prod => ({
      ...prod,
      price: prod.price.toString()
    }))
  }));

  return (
    <CartProvider>
      <main className="min-h-screen pb-24 bg-gray-50 lg:pb-0">
        {/* pb-24 mobilde sepet butonu altında içerik kalmasın diye */}

        {/* Navbar */}
        <header className="sticky top-0 z-40 w-full border-b border-gray-200 glass-panel">
          <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#FF6B00] rounded-lg flex items-center justify-center text-white font-black text-lg">
                Q
              </div>
              <h1 className="hidden text-xl font-black tracking-tight text-gray-900 sm:block">
                QR<span className="text-[#FF6B00]">MENU</span>
              </h1>
              {tableName && (
                <span className="px-3 py-1 ml-2 text-xs font-bold text-gray-600 bg-gray-100 border border-gray-200 rounded-full">
                  📍 {tableName}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        <MenuContainer
          categories={serializedCategories}
          locale={locale}
        />

        {searchParams.tableId && (
          <WaiterButton tableId={searchParams.tableId} />
        )}

      </main>
    </CartProvider>
  );
}