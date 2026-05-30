import type { SupabaseClient } from "@supabase/supabase-js";
import { isOwnerEmail, isAdminRole } from "@/lib/admin";

import type { User } from "@supabase/supabase-js";

/** Where to send this account after login (admins → /admin, users → /dashboard). */
export async function getPostLoginPathForUser(
    supabase: SupabaseClient,
    user: User
): Promise<string> {
    if (isOwnerEmail(user.email)) {
        return "/admin";
    }

    const { data: adminRole } = await supabase
        .from("admin_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

    if (adminRole && isAdminRole(adminRole.role)) {
        return "/admin";
    }

    return "/dashboard?welcome=1";
}

/** Where to send a user right after login (admins → panel, everyone else → dashboard). */
export async function getPostLoginPath(
    supabase: SupabaseClient
): Promise<string> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return "/login";
    }

    return getPostLoginPathForUser(supabase, user);
}

export async function isAdminUser(supabase: SupabaseClient): Promise<boolean> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;
    if (isOwnerEmail(user.email)) return true;

    const { data: adminRole } = await supabase
        .from("admin_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

    return !!adminRole && isAdminRole(adminRole.role);
}
