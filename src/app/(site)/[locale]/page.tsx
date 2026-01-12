import { PrismaClient } from "@prisma/client";
import { getTranslations } from 'next-intl/server';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import WaiterButton from '@/components/WaiterButton';
import MenuContainer from './MenuContainer';
import { CartProvider } from '@/context/CartContext';
import CartSheet from '@/components/menu/CartSheet';

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

  const serializedCategories = categories.map(cat => ({
    ...cat,
    products: cat.products.map(prod => ({
      ...prod,
      price: prod.price.toString()
    }))
  }));

  return (
    <CartProvider>
      <main className="relative max-w-md min-h-screen pb-24 mx-auto overflow-hidden shadow-2xl bg-surface">
        <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 shadow-sm bg-white/80 backdrop-blur-md">
          <div>
            <h1 className="text-xl font-black tracking-tight text-gray-800">QR MENU</h1>
            {tableName && (
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                {tableName}
              </span>
            )}
          </div>
          <LanguageSwitcher />
        </header>

        <MenuContainer
          categories={serializedCategories}
          locale={locale}
        />

        {searchParams.tableId && (
          <WaiterButton tableId={searchParams.tableId} />
        )}

        {/* Sepet Bileşeni */}
        <CartSheet locale={locale} />

      </main>
    </CartProvider>
  );
}