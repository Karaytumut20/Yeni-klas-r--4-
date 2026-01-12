import { PrismaClient } from "@prisma/client";
import { updateOrderStatus, deleteOrder } from "@/app/actions/admin-orders";
import PageHeader from "@/components/admin/PageHeader";
import { Clock, CheckCircle2, ChefHat, Trash2, RefreshCcw } from "lucide-react";

const prisma = new PrismaClient();

// Otomatik yenileme için (Basit polling alternatifi olarak server component'te revalidate)
export const revalidate = 0; // Sayfa her girişte sunucudan taze veri çeker

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: { include: { product: true } },
      table: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const statusColors: any = {
    PENDING: "bg-red-50 border-red-200",
    PREPARING: "bg-yellow-50 border-yellow-200",
    COMPLETED: "bg-green-50 border-green-200 opacity-70",
  };

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <PageHeader
        title="Sipariş Takibi"
        subtitle="Anlık gelen siparişleri buradan yönetebilirsiniz."
      >
        <a href="/admin/orders" className="flex items-center gap-2 px-3 py-2 text-sm transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          <RefreshCcw size={16} /> Yenile
        </a>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {orders.map((order) => (
          <div key={order.id} className={`p-5 rounded-xl border-2 shadow-sm relative transition-all ${statusColors[order.status] || "bg-white border-gray-100"}`}>

            {/* Kart Başlığı */}
            <div className="flex items-start justify-between pb-3 mb-4 border-b border-black/5">
              <div>
                <span className="text-lg font-bold text-gray-800">Masa {order.table?.number}</span>
                <p className="text-xs text-gray-500">{order.createdAt.toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-primary">{parseFloat(order.total.toString()).toFixed(0)}₺</span>
              </div>
            </div>

            {/* Ürün Listesi */}
            <div className="pr-2 mb-6 space-y-2 overflow-y-auto max-h-40 custom-scrollbar">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    <span className="mr-2 font-bold text-primary">{item.quantity}x</span>
                    {item.product.name_tr}
                  </span>
                  <span className="text-gray-400">{parseFloat(item.price.toString()) * item.quantity}₺</span>
                </div>
              ))}
            </div>

            {/* Aksiyon Butonları */}
            <div className="grid grid-cols-3 gap-2">
              {order.status !== 'PENDING' && (
                <form action={updateOrderStatus.bind(null, order.id, 'PENDING')}>
                  <button className="flex flex-col items-center justify-center w-full p-2 text-red-500 transition bg-white border rounded-lg hover:bg-red-50" title="Beklemeye Al">
                    <Clock size={20} />
                    <span className="text-[10px] font-bold mt-1">BEKLİYOR</span>
                  </button>
                </form>
              )}

              {order.status !== 'PREPARING' && (
                <form action={updateOrderStatus.bind(null, order.id, 'PREPARING')}>
                  <button className="flex flex-col items-center justify-center w-full p-2 text-yellow-600 transition bg-white border rounded-lg hover:bg-yellow-50" title="Hazırlanıyor">
                    <ChefHat size={20} />
                    <span className="text-[10px] font-bold mt-1">HAZIRLANIYOR</span>
                  </button>
                </form>
              )}

              {order.status !== 'COMPLETED' && (
                <form action={updateOrderStatus.bind(null, order.id, 'COMPLETED')}>
                  <button className="flex flex-col items-center justify-center w-full p-2 text-green-600 transition bg-white border rounded-lg hover:bg-green-50" title="Tamamla">
                    <CheckCircle2 size={20} />
                    <span className="text-[10px] font-bold mt-1">TAMAMLANDI</span>
                  </button>
                </form>
              )}

              <form action={deleteOrder.bind(null, order.id)}>
                 <button className="flex flex-col items-center justify-center w-full h-full p-2 text-gray-400 transition bg-white border rounded-lg hover:bg-gray-100" title="Sil">
                    <Trash2 size={20} />
                 </button>
              </form>
            </div>

            {/* Durum Etiketi */}
            <div className="absolute top-0 right-0 -mt-2 -mr-2">
              {order.status === 'PENDING' && <span className="px-2 py-1 text-xs text-white bg-red-500 rounded-full shadow-sm animate-pulse">YENİ</span>}
            </div>

          </div>
        ))}

        {orders.length === 0 && (
          <div className="py-20 text-center text-gray-400 col-span-full">
            <Clock size={48} className="mx-auto mb-4 opacity-20" />
            <p>Henüz aktif sipariş yok.</p>
          </div>
        )}
      </div>
    </div>
  );
}