/**
 * QR MENU PRO - FINAL FIX & SETUP SCRIPT
 * Amaç: Eksik bileşenleri oluşturmak, konfigürasyonu düzeltmek ve projeyi %100 çalışır hale getirmek.
 */

const fs = require("fs");
const path = require("path");

// Yardımcı Fonksiyon: Dosya Yazma/Güncelleme
function writeFile(filePath, content) {
  const fullPath = path.join(process.cwd(), filePath);
  const dir = path.dirname(fullPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(fullPath, content.trim());
  console.log(`✅ OLUŞTURULDU: ${filePath}`);
}

console.log("🛠️  QR MENU PROJE TAMİRİ VE KURULUMU BAŞLATILIYOR...\n");

// ----------------------------------------------------------------------
// 1. DÜZELTME: NEXT.CONFIG.JS (Resim İzinleri)
// ----------------------------------------------------------------------
const nextConfigFix = `
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
`;
writeFile("next.config.js", nextConfigFix);

// ----------------------------------------------------------------------
// 2. EKSİK DOSYA: LanguageSwitcher.tsx
// ----------------------------------------------------------------------
const languageSwitcherFix = `
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
    const newPath = pathname.replace(\`/\${locale}\`, \`/\${newLocale}\`);
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
`;
writeFile("src/components/LanguageSwitcher.tsx", languageSwitcherFix);

// ----------------------------------------------------------------------
// 3. EKSİK DOSYA: WaiterButton.tsx
// ----------------------------------------------------------------------
const waiterButtonFix = `
'use client';

import { useState } from 'react';
import { BellRing, CheckCircle2 } from 'lucide-react';

export default function WaiterButton({ tableId }: { tableId: string }) {
  const [status, setStatus] = useState<'idle' | 'calling' | 'called'>('idle');

  const callWaiter = async () => {
    setStatus('calling');
    // Simüle edilmiş garson çağırma isteği
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus('called');

    setTimeout(() => setStatus('idle'), 5000);
  };

  if (status === 'called') {
    return (
      <div className="fixed z-50 p-4 text-white bg-green-500 rounded-full shadow-lg bottom-24 right-6 animate-bounce">
        <CheckCircle2 size={24} />
      </div>
    );
  }

  return (
    <button
      onClick={callWaiter}
      disabled={status === 'calling'}
      className="fixed z-50 p-4 transition-all duration-300 bg-white border-2 rounded-full shadow-lg bottom-24 right-6 border-primary text-primary hover:bg-primary hover:text-white group"
    >
      <BellRing className={status === 'calling' ? 'animate-spin' : 'group-hover:animate-swing'} size={24} />
    </button>
  );
}
`;
writeFile("src/components/WaiterButton.tsx", waiterButtonFix);

// ----------------------------------------------------------------------
// 4. DÜZELTME: LAYOUT PROVIDER (i18n Context Hatası)
// ----------------------------------------------------------------------
const layoutFix = `
import "@/app/globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

export default async function SiteLayout({children, params: {locale}}: {children: React.ReactNode, params: {locale: string}}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-surface">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
`;
writeFile("src/app/(site)/[locale]/layout.tsx", layoutFix);

// ----------------------------------------------------------------------
// 5. YARDIMCI: UTILS (cn ve formatPrice)
// ----------------------------------------------------------------------
const utilsFix = `
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string) {
  const value = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
`;
writeFile("src/lib/utils.ts", utilsFix);

// ----------------------------------------------------------------------
// 6. PHASE 1 EKSİKLERİ (Ayarlar ve Loading Sayfaları)
// ----------------------------------------------------------------------

// Settings Server Action
const settingsAction = `
'use server';
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function updateProfile(formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const targetEmail = "admin@menu.com";

  const data: any = { name };
  if (password && password.length >= 6) {
    data.password = await hash(password, 12);
  }

  try {
    await prisma.user.update({
      where: { email: targetEmail },
      data: data
    });
    revalidatePath('/admin/settings');
    return { success: true, message: "Profil güncellendi" };
  } catch (error) {
    return { success: false, message: "Güncelleme başarısız" };
  }
}
`;
writeFile("src/app/actions/settings.ts", settingsAction);

// Settings Page
const settingsPage = `
import { PrismaClient } from "@prisma/client";
import { updateProfile } from "@/app/actions/settings";
import PageHeader from "@/components/admin/PageHeader";
import { User, Lock, Save } from "lucide-react";

const prisma = new PrismaClient();

export default async function SettingsPage() {
  const user = await prisma.user.findUnique({
    where: { email: "admin@menu.com" }
  });

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <PageHeader title="Ayarlar" subtitle="Yönetici profilinizi düzenleyin." />
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        <form action={updateProfile} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Yönetici Adı</label>
              <input name="name" defaultValue={user?.name || ""} className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">E-posta</label>
              <input name="email" defaultValue={user?.email || ""} disabled className="w-full p-3 text-gray-500 bg-gray-100 border rounded-lg" />
            </div>
          </div>
          <div className="pt-6 border-t border-gray-100">
            <h4 className="flex items-center gap-2 mb-4 font-bold text-gray-800"><Lock size={18} className="text-primary" /> Güvenlik</h4>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Yeni Şifre</label>
              <input type="password" name="password" placeholder="Boş bırakırsanız değişmez" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div className="flex justify-end pt-6">
            <button className="flex items-center gap-2 px-6 py-3 font-bold text-white transition rounded-lg bg-primary hover:bg-orange-600"><Save size={18} /> Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
}
`;
writeFile("src/app/(panel)/admin/settings/page.tsx", settingsPage);

// Admin Loading
const adminLoading = `
import { Loader2 } from "lucide-react";
export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3 text-primary">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-sm font-medium text-gray-500">Yükleniyor...</p>
      </div>
    </div>
  );
}
`;
writeFile("src/app/(panel)/loading.tsx", adminLoading);

// Menu Loading
const menuLoading = `
export default function Loading() {
  return (
    <div className="max-w-md min-h-screen p-4 pb-24 mx-auto space-y-4 bg-gray-50">
      <div className="w-full h-16 mb-6 bg-gray-200 rounded-lg animate-pulse"></div>
      <div className="flex gap-3 overflow-hidden">
        {[1,2,3,4].map(i => (
          <div key={i} className="flex-shrink-0 w-24 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        ))}
      </div>
      <div className="mt-6 space-y-4">
        {[1,2,3].map(i => (
          <div key={i} className="flex h-32 gap-4 p-3 bg-white border border-gray-100 rounded-2xl animate-pulse">
            <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
            <div className="flex-1 py-2 space-y-2">
              <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
              <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
`;
writeFile("src/app/(site)/[locale]/loading.tsx", menuLoading);

// Not Found Page
const notFoundPage = `
import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-50">
      <h1 className="font-black text-9xl text-primary/20">404</h1>
      <h2 className="mb-4 -mt-12 text-2xl font-bold text-gray-800">Sayfa Bulunamadı</h2>
      <div className="flex gap-4">
        <Link href="/tr" className="px-6 py-3 font-medium transition bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
          Menüye Dön
        </Link>
        <Link href="/admin" className="px-6 py-3 font-medium text-white transition bg-primary rounded-xl hover:bg-orange-600">
          Admin Paneli
        </Link>
      </div>
    </div>
  );
}
`;
writeFile("src/app/not-found.tsx", notFoundPage);

console.log("\n✅ KRİTİK HATALAR GİDERİLDİ VE EKSİK DOSYALAR OLUŞTURULDU.");
console.log("----------------------------------------------------------");
console.log("🚀 Lütfen sırasıyla şu komutları çalıştırın:");
console.log("1. npx prisma generate");
console.log("2. npx prisma db push");
console.log("3. npm run dev");
console.log("----------------------------------------------------------");
