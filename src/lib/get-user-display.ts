import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
    normalizeFullName,
    resolveDisplayName,
    getFirstNameFromFullName,
} from "@/lib/display-name";

export type UserDisplayInfo = {
    displayName: string;
    firstName: string;
};

/**
 * Resolve a clean display name from profile + auth metadata.
 * Optionally persists a deduplicated name to public.users when it fixes duplicates.
 */
export async function getUserDisplayInfo(
    supabase: SupabaseClient,
    user: User
): Promise<UserDisplayInfo> {
    const { data: profile } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

    const metadataName =
        typeof user.user_metadata?.full_name === "string"
            ? user.user_metadata.full_name
            : null;

    const displayName = resolveDisplayName({
        profileFullName: profile?.full_name,
        metadataFullName: metadataName,
        email: user.email,
    });

    const storedRaw = profile?.full_name?.trim() || metadataName?.trim() || "";
    const normalizedStored = normalizeFullName(storedRaw);

    if (
        normalizedStored &&
        profile &&
        normalizedStored !== normalizeFullName(profile.full_name)
    ) {
        await supabase
            .from("users")
            .update({
                full_name: normalizedStored,
                updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);
    }

    return {
        displayName,
        firstName: getFirstNameFromFullName(displayName),
    };
}
