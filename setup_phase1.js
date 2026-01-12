/**
 * QR MENU PRO - ADMIN LAYOUT FIX
 * Amaç: Admin panel sidebar'ının mobilde kapanmama ve responsive sorununu çözmek.
 * Çalıştırmak için: node fix_admin_layout.js
 */

const fs = require("fs");
const path = require("path");

function writeFile(filePath, content) {
  try {
    const absolutePath = path.join(process.cwd(), filePath);
    const dirname = path.dirname(absolutePath);
    if (!fs.existsSync(dirname)) fs.mkdirSync(dirname, { recursive: true });
    fs.writeFileSync(absolutePath, content.trim());
    console.log(`✅ Güncellendi: ${filePath}`);
  } catch (err) {
    console.error(`❌ Hata (${filePath}):`, err);
  }
}

const adminLayoutContent = `
'use client';
import { useState, useEffect } from 'react';
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
  Settings,
  ShoppingBag,
  X
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Varsayılan açık başlasın (Desktop için)
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Ekran boyutunu izle
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false); // Mobilde başlangıçta kapalı olsun
      } else {
        setSidebarOpen(true); // Desktopta başlangıçta açık olsun
      }
    };

    // İlk yüklemede kontrol et
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sayfa değişince mobilde menüyü kapat
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Siparişler', icon: ShoppingBag, href: '/admin/orders' },
    { name: 'Kategoriler', icon: Coffee, href: '/admin/categories' },
    { name: 'Ürünler', icon: UtensilsCrossed, href: '/admin/products' },
    { name: 'Masalar & QR', icon: QrCode, href: '/admin/tables' },
    { name: 'Ayarlar', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* MOBILE OVERLAY (Sadece mobilde ve menü açıksa görünür) */}
      <div
        className={\`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden \${
          isSidebarOpen && isMobile ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }\`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* SIDEBAR */}
      <aside
        className={\`
          fixed lg:static inset-y-0 left-0 z-50
          flex flex-col bg-[#1A1A1A] text-white
          transition-all duration-300 ease-in-out shadow-xl lg:shadow-none
          \${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'}
        \`}
      >
        {/* Logo Area */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800 shrink-0">
          {isSidebarOpen ? (
            <span className="text-xl font-bold tracking-wider truncate text-primary">QR MASTER</span>
          ) : (
            <span className="mx-auto text-xl font-bold text-primary">Q</span>
          )}
          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 text-gray-400 lg:hidden hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={\`
                  flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                  \${isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                \`}
                title={!isSidebarOpen ? item.name : ''}
              >
                <div className="relative shrink-0">
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {item.href === '/admin/orders' && (
                    <div className="absolute -right-1 -top-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1A1A1A]" />
                  )}
                </div>

                <span className={\`
                  font-medium whitespace-nowrap transition-all duration-300
                  \${isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute left-10'}
                \`}>
                  {item.name}
                </span>

                {isSidebarOpen && isActive && (
                  <ChevronRight size={16} className="ml-auto opacity-70" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-800 shrink-0">
           <button
             onClick={() => window.location.href = '/api/auth/signout'}
             className={\`
               flex items-center gap-3 p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all w-full
               \${!isSidebarOpen && 'justify-center'}
             \`}
             title="Çıkış Yap"
           >
             <LogOut size={22} className="shrink-0" />
             {isSidebarOpen && <span className="font-medium whitespace-nowrap">Çıkış Yap</span>}
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-col flex-1 h-screen min-w-0 overflow-hidden">
        {/* Header */}
        <header className="z-30 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 shadow-sm lg:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-600 transition rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-gray-200"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-sm font-semibold text-gray-500 lg:hidden">Yönetim Paneli</h2>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden leading-tight text-right md:block">
                <p className="text-sm font-bold text-gray-800">Admin</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Süper Yönetici</p>
             </div>
             <div className="flex items-center justify-center w-10 h-10 font-bold border-2 rounded-full bg-primary/10 text-primary border-primary/20">
               A
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 overflow-auto bg-gray-50 lg:p-0">
          {children}
        </main>
      </div>
    </div>
  );
}
`;

console.log("🚀 Admin Layout Düzeltmesi Başlatılıyor...");
writeFile("src/app/(panel)/admin/layout.tsx", adminLayoutContent);
console.log("🎉 Admin menüsü artık mobilde düzgün çalışıyor!");
