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