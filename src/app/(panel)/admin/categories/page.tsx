import { PrismaClient } from "@prisma/client";
import { createCategory, deleteCategory } from "@/app/actions/categories";
import PageHeader from "@/components/admin/PageHeader";
import { Trash2, Plus, Layers } from "lucide-react";

const prisma = new PrismaClient();

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <PageHeader
        title="Kategoriler"
        subtitle="Menü başlıklarını buradan yönetebilirsiniz."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Sol: Ekleme Formu */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl h-fit">
          <h2 className="flex items-center gap-2 mb-4 text-lg font-bold">
            <Plus className="p-1 text-white rounded-full bg-primary" size={24} />
            Yeni Kategori
          </h2>
          <form action={createCategory} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Kategori Adı (TR)</label>
              <input name="name_tr" required className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary" placeholder="Örn: Ana Yemekler" />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Category Name (EN)</label>
              <input name="name_en" required className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. Main Courses" />
            </div>
            <button className="w-full py-2 text-white transition rounded-lg bg-secondary hover:bg-gray-800">
              Ekle
            </button>
          </form>
        </div>

        {/* Sağ: Liste */}
        <div className="space-y-4 lg:col-span-2">
          {categories.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-white border border-gray-300 border-dashed rounded-xl">
              <Layers className="mx-auto mb-2 opacity-20" size={48} />
              Henüz hiç kategori eklenmemiş.
            </div>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-4 transition bg-white border border-gray-100 shadow-sm rounded-xl group hover:border-primary/30">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 font-bold rounded-lg bg-orange-50 text-primary">
                    {cat.name_tr.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{cat.name_tr}</h3>
                    <p className="text-xs text-gray-500">{cat.name_en} • {cat._count.products} Ürün</p>
                  </div>
                </div>

                <form action={deleteCategory.bind(null, cat.id)}>
                  <button className="p-2 text-gray-400 transition rounded-lg hover:text-red-500 hover:bg-red-50">
                    <Trash2 size={18} />
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}