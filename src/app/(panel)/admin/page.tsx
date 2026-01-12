import { getDashboardStats, getSalesChartData } from '@/app/actions/analytics';
import PageHeader from '@/components/admin/PageHeader';
import StatCard from '@/components/admin/StatCard';
import SalesChart from '@/components/admin/SalesChart'; // Yeni bileşen
import { Users, DollarSign, ShoppingBag, Activity, TrendingUp } from 'lucide-react';

// Her girişte veriyi tazele
export const revalidate = 0;

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const chartData = await getSalesChartData();

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <PageHeader
        title="Genel Bakış"
        subtitle="Restoranınızın canlı performans raporu."
      >
        <div className="flex items-center gap-2 px-3 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          CANLI
        </div>
      </PageHeader>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Toplam Gelir"
          value={`₺${stats.revenue.toFixed(0)}`}
          icon={DollarSign}
          trend="+12%"
          color="success"
        />
        <StatCard
          title="Toplam Sipariş"
          value={stats.orders}
          icon={ShoppingBag}
          trend="+5%"
          color="primary"
        />
        <StatCard
          title="Aktif Masalar"
          value={stats.activeTables}
          icon={Users}
          color="warning"
        />
        <StatCard
          title="Günlük Sipariş"
          value={stats.dailyOrders}
          icon={Activity}
          trend="Bugün"
          color="secondary"
        />
      </div>

      {/* Alt Bölümler (Grid) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* Sol Geniş Alan: Grafik */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm lg:col-span-2 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="flex items-center gap-2 font-bold text-gray-800">
              <TrendingUp size={20} className="text-primary" />
              Haftalık Satış Grafiği
            </h3>
          </div>

          <div className="w-full h-72">
            <SalesChart data={chartData} />
          </div>
        </div>

        {/* Sağ Dar Alan: Sistem Durumu */}
        <div className="flex flex-col justify-between p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div>
            <h3 className="mb-4 font-bold text-gray-800">Sistem Özeti</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <p className="mb-1 text-xs font-bold text-gray-500 uppercase">En Çok Satan</p>
                <p className="font-bold text-gray-800">Veriler toplanıyor...</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <p className="mb-1 text-xs font-bold text-gray-500 uppercase">Ortalama Sepet</p>
                <p className="font-bold text-gray-800">
                  {stats.orders > 0 ? `₺${(stats.revenue / stats.orders).toFixed(0)}` : '0₺'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-8 border-t">
            <h4 className="mb-3 text-xs font-bold text-gray-400 uppercase">Veritabanı</h4>
            <div className="flex items-center gap-2 p-2 text-sm text-green-600 rounded-lg bg-green-50">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Bağlantı Kararlı
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}