import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { EmailOtpType } from '@supabase/supabase-js'
import { getPostLoginPathForUser } from '@/lib/admin-session'

function safeRedirectPath(next: string | null): string {
    if (!next || !next.startsWith('/') || next.startsWith('//')) {
        return '/dashboard'
    }
    return next
}

async function resolveAuthRedirect(next: string) {
    if (next.startsWith('/update-password')) {
        return next
    }

    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return next
    }

    if (next === '/dashboard' || next.startsWith('/dashboard?')) {
        return getPostLoginPathForUser(supabase, user)
    }

    return next
}

export async function GET(request: Request) {
    try {
        const { searchParams, origin } = new URL(request.url)
        const code = searchParams.get('code')
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type') as EmailOtpType | null
        
        const next = safeRedirectPath(searchParams.get('next'))

        console.log("Auth Callback Triggered.");
        console.log("  URL:", request.url);
        console.log("  Next Param:", next);
        console.log("  Code Present:", !!code);
        console.log("  Token Hash Present:", !!token_hash, "Type:", type);

        const supabase = await createClient()

        if (token_hash && type) {
            console.log("  Using OTP Token Hash Flow");
            const { error } = await supabase.auth.verifyOtp({
                type,
                token_hash,
            })

            if (!error) {
                const forwardedHost = request.headers.get('x-forwarded-host') 
                const isLocalEnv = process.env.NODE_ENV === 'development'
                const destination = await resolveAuthRedirect(next)

                console.log("  OTP Verification Success. Redirecting to:", destination);

                if (isLocalEnv) {
                    return NextResponse.redirect(`${origin}${destination}`)
                } else if (forwardedHost) {
                    return NextResponse.redirect(`https://${forwardedHost}${destination}`)
                } else {
                    return NextResponse.redirect(`${origin}${destination}`)
                }
            } else {
                console.error("Auth Error verifying OTP:", error)
                return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)
            }
        }

        if (code) {
            console.log("  Using PKCE Code Exchange Flow");
            const { error } = await supabase.auth.exchangeCodeForSession(code)

            if (!error) {
                const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
                const isLocalEnv = process.env.NODE_ENV === 'development'
                const destination = await resolveAuthRedirect(next)

                console.log("  Exchange Success. Redirecting to:", destination);

                if (isLocalEnv) {
                    return NextResponse.redirect(`${origin}${destination}`)
                } else if (forwardedHost) {
                    return NextResponse.redirect(`https://${forwardedHost}${destination}`)
                } else {
                    return NextResponse.redirect(`${origin}${destination}`)
                }
            } else {
                console.error("Auth Error exchanging code:", error)
                return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)
            }
        }
    } catch (error: any) {
        console.error("Auth Callback Exception:", error);
        const { origin } = new URL(request.url)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=UnexpectedError`);
    }

    // return the user to an error page with instructions
    const { origin } = new URL(request.url)
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=NoCodeProvided`)
}
