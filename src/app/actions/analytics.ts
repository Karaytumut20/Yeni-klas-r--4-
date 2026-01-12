'use server';

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getDashboardStats() {
  // 1. Toplam Gelir (Tamamlanan Siparişler)
  const completedOrders = await prisma.order.findMany({
    where: { status: 'COMPLETED' },
    select: { total: true }
  });

  const totalRevenue = completedOrders.reduce((acc, order) => acc + parseFloat(order.total.toString()), 0);

  // 2. Toplam Sipariş Sayısı
  const totalOrders = await prisma.order.count();

  // 3. Aktif Masalar (En az 1 bekleyen siparişi olan masalar)
  const activeTablesCount = await prisma.table.count({
    where: {
      orders: {
        some: {
          status: { in: ['PENDING', 'PREPARING', 'READY'] }
        }
      }
    }
  });

  const totalTables = await prisma.table.count();

  // 4. Günlük Sipariş (Bugün oluşturulanlar)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dailyOrders = await prisma.order.count({
    where: {
      createdAt: { gte: today }
    }
  });

  return {
    revenue: totalRevenue,
    orders: totalOrders,
    activeTables: `${activeTablesCount}/${totalTables}`,
    dailyOrders: dailyOrders
  };
}

export async function getSalesChartData() {
  // Son 7 günün satış verilerini hazırla
  // Not: SQLite'da gelişmiş tarih fonksiyonları kısıtlı olduğu için JS tarafında grupluyoruz.
  // Production'da (PostgreSQL/MySQL) raw SQL ile daha performanslı yapılabilir.

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: sevenDaysAgo },
      status: 'COMPLETED'
    },
    select: {
      createdAt: true,
      total: true
    }
  });

  // Günlere göre grupla
  const salesMap = new Map<string, number>();

  // Son 7 günün boş şablonunu oluştur
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayName = d.toLocaleDateString('tr-TR', { weekday: 'short' }); // Pzt, Sal...
    salesMap.set(dayName, 0);
  }

  // Verileri doldur
  orders.forEach(order => {
    const dayName = order.createdAt.toLocaleDateString('tr-TR', { weekday: 'short' });
    const current = salesMap.get(dayName) || 0;
    salesMap.set(dayName, current + parseFloat(order.total.toString()));
  });

  // Grafik formatına çevir
  return Array.from(salesMap).map(([name, sales]) => ({ name, sales }));
}