import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
    try {
        const { searchParams, origin } = new URL(request.url)
        const code = searchParams.get('code')
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type') as EmailOtpType | null
        
        // if "next" is in param, use it
        const next = searchParams.get('next') ?? '/dashboard'

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

                console.log("  OTP Verification Success. Redirecting to:", next);

                if (isLocalEnv) {
                    return NextResponse.redirect(`${origin}${next}`)
                } else if (forwardedHost) {
                    return NextResponse.redirect(`https://${forwardedHost}${next}`)
                } else {
                    return NextResponse.redirect(`${origin}${next}`)
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

                console.log("  Exchange Success. Redirecting to:", next);

                if (isLocalEnv) {
                    // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                    return NextResponse.redirect(`${origin}${next}`)
                } else if (forwardedHost) {
                    return NextResponse.redirect(`https://${forwardedHost}${next}`)
                } else {
                    return NextResponse.redirect(`${origin}${next}`)
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
