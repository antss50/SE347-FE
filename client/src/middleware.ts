import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];
  const protectedRoutes = ['/dashboard', '/profile']; // Thêm các route cần bảo vệ

  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    '/:path*', 
    '/profile/:path*',
    '/auth/login', 
    '/auth/register',
    '/auth/forgot-password'
  ],
};