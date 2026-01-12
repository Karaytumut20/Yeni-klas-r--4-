import "@/app/globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

export default async function SiteLayout({children, params: {locale}}: {children: React.ReactNode, params: {locale: string}}) {
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className="bg-surface min-h-screen">{children}</body>
    </html>
  );
}