import "@/app/globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

export default async function SiteLayout({children, params: {locale}}: {children: React.ReactNode, params: {locale: string}}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-surface">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}