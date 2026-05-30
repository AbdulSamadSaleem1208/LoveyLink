import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isOwnerEmail, isAdminRole } from '@/lib/admin'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value),
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Do NOT use supabase.auth.getSession() here.
    // getSession() reads from cookies without validation.
    // getUser() sends a request to Supabase Auth server to validate
    // the session and refresh it if needed, ensuring per-request isolation.
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // If user is not authenticated and trying to access protected routes,
    // redirect to login
    const protectedPaths = ['/dashboard', '/admin', '/create']
    const isProtectedRoute = protectedPaths.some(path =>
        request.nextUrl.pathname.startsWith(path)
    )

    if (!user && isProtectedRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // Logged-in users: pricing/payment flows live on the dashboard
    if (user && request.nextUrl.pathname === '/pricing') {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        url.searchParams.set('upgrade', '1')
        return NextResponse.redirect(url)
    }

    // Logged-in users: admins → admin panel, others → dashboard
    const guestAuthPaths = ['/login', '/register', '/forgot-password']
    if (user && guestAuthPaths.includes(request.nextUrl.pathname)) {
        const url = request.nextUrl.clone()
        if (isOwnerEmail(user.email)) {
            url.pathname = '/admin'
        } else {
            const { data: adminRole } = await supabase
                .from('admin_roles')
                .select('role')
                .eq('user_id', user.id)
                .maybeSingle()
            url.pathname =
                adminRole && isAdminRole(adminRole.role) ? '/admin' : '/dashboard'
        }
        url.search = ''
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public assets (images, svgs, etc.)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
