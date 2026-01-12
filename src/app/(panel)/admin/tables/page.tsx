import { PrismaClient } from "@prisma/client";
import { createTable, deleteTable } from "@/app/actions/tables";
import PageHeader from "@/components/admin/PageHeader";
import { Trash2, Plus, QrCode, Download, ExternalLink } from "lucide-react";
import Image from "next/image";

const prisma = new PrismaClient();

export default async function TablesPage() {
  const tables = await prisma.table.findMany({
    orderBy: { number: 'asc' },
    include: { _count: { select: { requests: true } } }
  });

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <PageHeader
        title="Masalar & QR Kodlar"
        subtitle={`Toplam ${tables.length} masa tanımlı.`}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* SOL: Masa Ekleme Formu */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl h-fit">
          <h2 className="flex items-center gap-2 mb-4 text-lg font-bold">
            <Plus className="p-1 text-white rounded-full bg-primary" size={24} />
            Yeni Masa Ekle
          </h2>
          <form action={createTable} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Masa Numarası</label>
              <input
                name="number"
                type="number"
                required
                className="w-full p-3 text-lg font-bold text-center border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                placeholder="Örn: 5"
              />
            </div>
            <button className="w-full py-3 font-medium text-white transition rounded-lg bg-secondary hover:bg-gray-800">
              Oluştur ve QR Üret
            </button>
          </form>

          <div className="p-4 mt-6 text-sm text-blue-700 rounded-lg bg-blue-50">
            <p className="flex items-start gap-2">
              <span className="text-xl">💡</span>
              Masa oluşturduğunuzda QR kod otomatik olarak üretilir ve sağ tarafta listelenir.
            </p>
          </div>
        </div>

        {/* SAĞ: Masa Listesi ve QR Kartları */}
        <div className="lg:col-span-2">
          {tables.length === 0 ? (
            <div className="p-12 text-center text-gray-500 bg-white border border-gray-300 border-dashed rounded-xl">
              <QrCode className="mx-auto mb-3 opacity-20" size={64} />
              <p>Henüz hiç masa oluşturulmamış.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {tables.map((table) => (
                <div key={table.id} className="flex flex-col items-center p-4 text-center transition bg-white border border-gray-100 shadow-sm rounded-xl group hover:shadow-md">

                  {/* Masa No */}
                  <div className="flex items-center justify-between w-full pb-2 mb-3 border-b">
                    <span className="text-lg font-bold text-gray-800">Masa {table.number}</span>
                    <form action={deleteTable.bind(null, table.id)}>
                      <button className="text-gray-300 transition hover:text-red-500"><Trash2 size={18} /></button>
                    </form>
                  </div>

                  {/* QR Kod Alanı */}
                  <div className="relative w-32 h-32 p-1 mb-3 bg-white border rounded-lg">
                    {table.qrCode && table.qrCode !== "pending" ? (
                      <Image
                        src={table.qrCode}
                        alt={`Masa ${table.number} QR`}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-xs text-gray-400 bg-gray-100 rounded animate-pulse">
                        QR Bekleniyor...
                      </div>
                    )}
                  </div>

                  {/* Aksiyon Butonları */}
                  <div className="flex w-full gap-2">
                    <a
                      href={table.qrCode || '#'}
                      download={`Masa-${table.number}-QR.png`}
                      className="flex items-center justify-center flex-1 gap-1 px-3 py-2 text-xs font-bold transition rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white"
                    >
                      <Download size={14} /> İndir
                    </a>
                    {/* Test için link */}
                    <a
                      href={`/tr?tableId=${table.id}`}
                      target="_blank"
                      className="px-3 py-2 text-gray-600 transition bg-gray-100 rounded-lg hover:bg-gray-200"
                      title="Test Et"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}