/**
 * QR MENU ULTIMATE - PHASE 3: ADMIN UI & DASHBOARD
 * Amaç: Admin paneli için UI bileşenleri seti ve profesyonel Dashboard sayfası.
 */

const fs = require("fs");
const path = require("path");

const PROJECT_DIR = process.cwd();

// Renkli Konsol
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  bright: "\x1b[1m",
};
const log = (msg, color = colors.reset) =>
  console.log(`${color}${msg}${colors.reset}`);

log(`\nHQ: FAZ 3 BAŞLATILIYOR... [ADMIN UI & DASHBOARD]`, colors.bright);

// Dosya Yazma Yardımcısı
const writeFile = (filePath, content) => {
  const fullPath = path.join(PROJECT_DIR, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content.trim());
};

// ---------------------------------------------------------
// 1. ADMIN UI BİLEŞENLERİ (COMPONENTS)
// ---------------------------------------------------------
log("\n🎨 UI Bileşenleri oluşturuluyor...", colors.blue);

// StatCard (İstatistik Kartı)
const statCardComp = `
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: "primary" | "secondary" | "success" | "warning";
}

export default function StatCard({ title, value, icon: Icon, trend, color = "primary" }: StatCardProps) {
  const colorClasses = {
    primary: "bg-orange-50 text-orange-600",
    secondary: "bg-gray-100 text-gray-600",
    success: "bg-green-50 text-green-600",
    warning: "bg-yellow-50 text-yellow-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className={\`p-3 rounded-lg \${colorClasses[color]}\`}>
          <Icon size={24} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-xs">
          <span className={trend.startsWith('+') ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
            {trend}
          </span>
          <span className="text-gray-400 ml-1">geçen aya göre</span>
        </div>
      )}
    </div>
  );
}
`;

writeFile("src/components/admin/StatCard.tsx", statCardComp);

// PageHeader (Sayfa Başlığı)
const pageHeaderComp = `
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
      <div className="flex gap-3">
        {children}
      </div>
    </div>
  );
}
`;

writeFile("src/components/admin/PageHeader.tsx", pageHeaderComp);

// ---------------------------------------------------------
// 2. GELİŞMİŞ DASHBOARD SAYFASI
// ---------------------------------------------------------
log("\n📊 Dashboard sayfası güncelleniyor...", colors.blue);

const dashboardPage = `
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
`;

writeFile("src/app/(panel)/admin/page.tsx", dashboardPage);

// ---------------------------------------------------------
// 3. ADMIN LAYOUT İYİLEŞTİRMESİ
// ---------------------------------------------------------
log("\n📐 Sidebar ve Layout güncelleniyor...", colors.blue);

const adminLayout = `
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  QrCode,
  LogOut,
  Menu,
  Coffee,
  ChevronRight,
  Settings
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Kategoriler', icon: Coffee, href: '/admin/categories' },
    { name: 'Ürünler', icon: UtensilsCrossed, href: '/admin/products' },
    { name: 'Masalar & QR', icon: QrCode, href: '/admin/tables' },
    { name: 'Ayarlar', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={\`fixed inset-y-0 left-0 z-50 bg-[#1A1A1A] text-white transition-all duration-300 ease-in-out flex flex-col
          \${isSidebarOpen ? 'w-64' : 'w-20'}
          lg:relative\`}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          {isSidebarOpen ? (
            <span className="font-bold text-xl tracking-wider text-primary">QR MASTER</span>
          ) : (
            <span className="font-bold text-xl mx-auto text-primary">Q</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={\`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
                  \${isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'}\`}
              >
                <div className="relative">
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && <div className="absolute -right-1 -top-1 w-2 h-2 bg-white rounded-full" />}
                </div>

                {isSidebarOpen && (
                  <span className="font-medium flex-1">{item.name}</span>
                )}

                {isSidebarOpen && isActive && <ChevronRight size={16} />}
              </Link>
            )
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-800">
           <button
             onClick={() => window.location.href = '/api/auth/signout'}
             className={\`flex items-center gap-3 p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all w-full
               \${!isSidebarOpen && 'justify-center'}\`}
           >
             <LogOut size={22} />
             {isSidebarOpen && <span className="font-medium">Çıkış Yap</span>}
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-800">Admin</p>
                <p className="text-xs text-gray-500">Süper Yönetici</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border-2 border-primary/20">
               A
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
`;

writeFile("src/app/(panel)/admin/layout.tsx", adminLayout);

log("\n✨ FAZ 3 TAMAMLANDI! ✨", colors.green);
log(`\nSıradaki Adım:`, colors.bright);
log(
  `1. 'npm run dev' çalışıyorsa yenilemeye gerek yok (Next.js otomatik günceller).`
);
log(`2. http://localhost:3000/admin adresine giderek YENİ DASHBOARD'u incele.`);
log(
  `\nPanelin görselliği güzelleştikten sonra 'Devam' yazarsan FAZ 4'e (Menü Motoru) geçeriz!`,
  colors.blue
);
