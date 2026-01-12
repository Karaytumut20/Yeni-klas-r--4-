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