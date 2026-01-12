/**
 * QR MENU PRO - CHART TYPE ERROR FIX SCRIPT
 * Amaç: admin/SalesChart.tsx dosyasındaki Recharts Tooltip formatter tip hatasını gidermek.
 * Çalıştırmak için: node fix_chart.js
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

const salesChartContent = `
'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SalesChartProps {
  data: { name: string; sales: number }[];
}

export default function SalesChart({ data }: SalesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Veri yok
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{fill: '#9CA3AF', fontSize: 12}}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{fill: '#9CA3AF', fontSize: 12}}
          tickFormatter={(value) => \`₺\${value}\`}
        />
        <Tooltip
          contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
          formatter={(value: any) => [\`₺\${value}\`, 'Satış']}
        />
        <Area
          type="monotone"
          dataKey="sales"
          stroke="#FF6B00"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorSales)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
`;

console.log("🚀 Grafik Bileşeni Düzeltmesi Başlatılıyor...");
writeFile("src/components/admin/SalesChart.tsx", salesChartContent);
console.log(
  "🎉 İşlem tamamlandı. Şimdi 'npm run build' komutunu tekrar çalıştırabilirsiniz."
);
