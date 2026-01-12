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
        className={`fixed inset-y-0 left-0 z-50 bg-[#1A1A1A] text-white transition-all duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? 'w-64' : 'w-20'}
          lg:relative`}
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
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
                  ${isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
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
             className={`flex items-center gap-3 p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all w-full
               ${!isSidebarOpen && 'justify-center'}`}
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