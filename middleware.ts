import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { isAdminUser } from '@/utils/auth/constants';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: Record<string, unknown>) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Refresh session if expired
  await supabase.auth.getSession();
  
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const { data } = await supabase.auth.getUser();
    
    console.log('[Middleware] Admin route access attempt:', {
      path: request.nextUrl.pathname,
      user: data.user ? {
        id: data.user.id,
        email: data.user.email,
        isAdmin: isAdminUser(data.user.id)
      } : null
    });
    
    // Check if user is authenticated and is admin
    if (!data.user || !isAdminUser(data.user.id)) {
      console.log('[Middleware] Unauthorized admin access, redirecting to login');
      // Only redirect if not already on the login page to prevent loops
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    console.log('[Middleware] Admin access granted');
  }
  
  // If on login page and already authenticated as admin, redirect to admin
  if (request.nextUrl.pathname === '/login') {
    const { data } = await supabase.auth.getUser();
    
    console.log('[Middleware] Login page access:', {
      user: data.user ? {
        id: data.user.id,
        email: data.user.email,
        isAdmin: isAdminUser(data.user.id)
      } : null
    });
    
    if (data.user && isAdminUser(data.user.id)) {
      console.log('[Middleware] Admin already logged in, redirecting to admin');
      // Get the redirectedFrom parameter or default to /admin
      const redirectTo = request.nextUrl.searchParams.get('redirectedFrom') || '/admin';
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
  }

  return response;
}

// Run middleware on all routes except static assets
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
