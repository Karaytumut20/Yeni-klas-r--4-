import PageHeader from '@/components/admin/PageHeader';
import StatCard from '@/components/admin/StatCard';
import { Users, DollarSign, ShoppingBag, Activity, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Genel Bakış"
        subtitle="Restoranınızın anlık durumunu buradan takip edebilirsiniz."
      >
        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
          Rapor İndir
        </button>
      </PageHeader>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Toplam Gelir"
          value="₺124,500"
          icon={DollarSign}
          trend="+12%"
          color="success"
        />
        <StatCard
          title="Toplam Sipariş"
          value="1,245"
          icon={ShoppingBag}
          trend="+5%"
          color="primary"
        />
        <StatCard
          title="Aktif Masalar"
          value="12/20"
          icon={Users}
          color="warning"
        />
        <StatCard
          title="Günlük Ziyaret"
          value="854"
          icon={Activity}
          trend="+18%"
          color="secondary"
        />
      </div>

      {/* Alt Bölümler (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Sol Geniş Alan: Son Siparişler vb. */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              Satış Grafiği
            </h3>
            <select className="text-sm border-none bg-gray-50 rounded-md px-2 py-1 text-gray-600 focus:ring-0">
              <option>Bu Hafta</option>
              <option>Bu Ay</option>
            </select>
          </div>

          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm">Grafik Bileşeni Faz 9'da eklenecek</p>
          </div>
        </div>

        {/* Sağ Dar Alan: Hızlı İşlemler / Uyarılar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 mb-4">Hızlı Durum</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-red-700">Bekleyen Garson Çağrısı</span>
              </div>
              <span className="font-bold text-red-700">3</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
              <span className="text-sm font-medium text-blue-700">Açık Siparişler</span>
              <span className="font-bold text-blue-700">8</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Sistem Durumu</h4>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Veritabanı Bağlı
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}