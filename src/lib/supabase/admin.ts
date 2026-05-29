import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Service-role Supabase client for trusted server-only reads/writes.
 * Returns null when env vars are missing (caller should fall back to anon + RLS).
 */
export function createAdminClient(): SupabaseClient | null {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
        return null
    }

    return createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}
