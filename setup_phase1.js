/**
 * QR MENU PRO - BUILD ERROR FIX SCRIPT
 * Amaç: admin/settings/page.tsx dosyasındaki TypeScript form action tip hatasını gidermek.
 * Hatayı çözen yöntem: Action'ı çağıran ve void döndüren bir wrapper fonksiyon eklemek.
 * Çalıştırmak için: node fix_build_error.js
 */

const fs = require("fs");
const path = require("path");

function writeFile(filePath, content) {
  try {
    const absolutePath = path.join(process.cwd(), filePath);
    const dirname = path.dirname(absolutePath);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }
    fs.writeFileSync(absolutePath, content.trim());
    console.log(`✅ Düzeltildi: ${filePath}`);
  } catch (err) {
    console.error(`❌ Hata (${filePath}):`, err);
  }
}

const settingsPageContent = `
import { PrismaClient } from "@prisma/client";
import { updateProfile } from "@/app/actions/settings";
import PageHeader from "@/components/admin/PageHeader";
import { User, Lock, Save } from "lucide-react";

const prisma = new PrismaClient();

export default async function SettingsPage() {
  const user = await prisma.user.findUnique({
    where: { email: "admin@menu.com" }
  });

  // Wrapper function to fix TypeScript error (Promise<void> return type match)
  async function handleUpdate(formData: FormData) {
    "use server";
    await updateProfile(formData);
  }

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <PageHeader title="Ayarlar" subtitle="Yönetici profilinizi düzenleyin." />
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        {/* action prop'una wrapper fonksiyon verildi */}
        <form action={handleUpdate} className="p-6 space-y-6">
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

console.log("🚀 Build Hatası Düzeltmesi Başlatılıyor...");
writeFile("src/app/(panel)/admin/settings/page.tsx", settingsPageContent);
console.log("🎉 İşlem tamamlandı. Şimdi tekrar build alabilirsiniz.");
