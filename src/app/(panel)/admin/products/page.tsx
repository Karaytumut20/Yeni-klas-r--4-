import { PrismaClient } from "@prisma/client";
import { createProduct, deleteProduct, toggleProductStatus } from "@/app/actions/products";
import PageHeader from "@/components/admin/PageHeader";
import { Trash2, Plus, Image as ImageIcon, Check, X } from "lucide-react";

const prisma = new PrismaClient();

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });

  const categories = await prisma.category.findMany();

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <PageHeader
        title="Ürünler"
        subtitle={`Toplam ${products.length} ürün listeleniyor.`}
      />

      {/* Ekleme Formu (Collapse veya Modal yapılabilir, şimdilik basit tutuyoruz) */}
      <div className="p-6 mb-8 bg-white border border-gray-100 shadow-sm rounded-xl">
        <h2 className="mb-4 text-lg font-bold text-gray-800">Hızlı Ürün Ekle</h2>
        <form action={createProduct} className="grid items-end grid-cols-1 gap-4 md:grid-cols-4">
          <div className="md:col-span-1">
             <label className="block mb-1 text-xs text-gray-500">Kategori Seç</label>
             <select name="categoryId" className="w-full border p-2.5 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary outline-none" required>
               <option value="">Seçiniz...</option>
               {categories.map(c => <option key={c.id} value={c.id}>{c.name_tr}</option>)}
             </select>
          </div>
          <div className="md:col-span-1">
            <label className="block mb-1 text-xs text-gray-500">Ürün Adı (TR)</label>
            <input name="name_tr" required className="w-full border p-2.5 rounded-lg outline-primary" placeholder="Adana Kebap" />
          </div>
          <div className="md:col-span-1">
             <label className="block mb-1 text-xs text-gray-500">Product Name (EN)</label>
             <input name="name_en" required className="w-full border p-2.5 rounded-lg outline-primary" placeholder="Spicy Kebab" />
          </div>
          <div className="md:col-span-1">
            <label className="block mb-1 text-xs text-gray-500">Fiyat (₺)</label>
            <input name="price" type="number" step="0.01" required className="w-full border p-2.5 rounded-lg outline-primary" placeholder="250" />
          </div>
          <div className="md:col-span-4">
             <input name="desc_tr" className="w-full border p-2.5 rounded-lg outline-primary" placeholder="Kısa açıklama (isteğe bağlı)" />
          </div>

          <button className="w-full py-3 font-medium text-white transition rounded-lg md:col-span-4 bg-secondary hover:bg-gray-800">
            + Ürünü Kaydet
          </button>
        </form>
      </div>

      {/* Ürün Listesi Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="overflow-hidden transition bg-white border border-gray-100 shadow-sm rounded-xl group hover:shadow-md">
            <div className="relative h-40 bg-gray-100">
              {/* Resim alanı (Demo) */}
              <div className="w-full h-full bg-center bg-cover" style={{backgroundImage: `url('${product.image || ''}')`}}></div>
              <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-gray-600 uppercase tracking-wide">
                {product.category.name_tr}
              </div>
              {!product.isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center font-bold text-white bg-black/50 backdrop-blur-sm">
                  TÜKENDİ
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-800 line-clamp-1" title={product.name_tr}>{product.name_tr}</h3>
                <span className="text-lg font-bold text-primary">{parseFloat(product.price.toString()).toFixed(0)}₺</span>
              </div>
              <p className="text-xs text-gray-400 mb-4 line-clamp-2 min-h-[2.5em]">
                {product.desc_tr || "Açıklama yok."}
              </p>

              <div className="flex items-center justify-between pt-3 border-t">
                <form action={toggleProductStatus.bind(null, product.id, product.isAvailable)}>
                  <button className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${product.isAvailable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {product.isAvailable ? <Check size={14}/> : <X size={14}/>}
                    {product.isAvailable ? 'Stokta' : 'Yok'}
                  </button>
                </form>

                <form action={deleteProduct.bind(null, product.id)}>
                   <button className="p-1 text-gray-300 transition hover:text-red-500"><Trash2 size={18} /></button>
                </form>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="py-12 text-center text-gray-400 border border-dashed col-span-full bg-gray-50 rounded-xl">
            <ImageIcon className="mx-auto mb-2 opacity-30" size={48} />
            <p>Listeniz boş. Yukarıdan ilk ürününüzü ekleyin.</p>
          </div>
        )}
      </div>
    </div>
  );
}