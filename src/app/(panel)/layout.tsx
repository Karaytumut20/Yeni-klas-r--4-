import "@/app/globals.css";
export default function PanelLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen text-gray-900">{children}</body>
    </html>
  );
}