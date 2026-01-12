/**
 * QR MENU PRO - FIX COMPILATION ERROR
 * Amaç: "not-found.tsx doesn't have a root layout" hatasını gidermek.
 */

const fs = require("fs");
const path = require("path");

const filePath = path.join(process.cwd(), "src/app/not-found.tsx");

const fixedContent = `
import Link from 'next/link';

// Next.js'de Multiple Root Layouts kullanıldığında,
// root seviyesindeki not-found sayfası kendi html/body etiketlerini tanımlamalıdır.
export default function NotFound() {
  return (
    <html lang="tr">
      <body className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50">
        <div className="w-full max-w-md p-4 space-y-6">
          <div className="space-y-2">
            <h1 className="font-black select-none text-9xl text-primary/20">404</h1>
            <h2 className="-mt-8 text-2xl font-bold text-gray-800">Sayfa Bulunamadı</h2>
            <p className="text-gray-500">Aradığınız sayfa silinmiş, taşınmış veya hiç var olmamış olabilir.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/tr"
              className="px-6 py-3 font-bold text-gray-700 transition bg-white border border-gray-200 shadow-sm rounded-xl hover:bg-gray-50 hover:shadow-md active:scale-95"
            >
              Menüye Dön
            </Link>
            <Link
              href="/admin"
              className="px-6 py-3 font-bold text-white transition shadow-lg bg-primary rounded-xl hover:bg-orange-600 shadow-primary/30 active:scale-95"
            >
              Admin Paneli
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
`;

fs.writeFileSync(filePath, fixedContent.trim());
console.log("✅ DÜZELTİLDİ: src/app/not-found.tsx (Root Layout eklendi)");
console.log("🚀 Şimdi 'npm run dev' komutunu tekrar çalıştırabilirsiniz.");
