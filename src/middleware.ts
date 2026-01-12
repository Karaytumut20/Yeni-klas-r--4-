import { withAuth } from "next-auth/middleware";
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ['en', 'tr'],
  defaultLocale: 'tr'
});

const authMiddleware = withAuth(
  // onSuccess: Giriş başarılıysa ne olsun?
  function onSuccess(req) {
    // Admin rotası için dil yönlendirmesi (intlMiddleware) YAPMA.
    // Çünkü /admin rotası [locale] klasörünün dışında, globaldir.
    // Direkt olarak sayfaya gitmesine izin ver.
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null
    },
    pages: {
      signIn: '/auth/login'
    }
  }
);

export default function middleware(req: NextRequest) {
  // Admin ve API rotalarını koru
  const isAuthRoute = req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/api/admin');

  if (isAuthRoute) {
    return (authMiddleware as any)(req);
  }

  // Diğer tüm rotalarda (Müşteri ekranı vb.) dil çevirisi yap
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/', '/(tr|en)/:path*', '/admin/:path*', '/api/admin/:path*']
};