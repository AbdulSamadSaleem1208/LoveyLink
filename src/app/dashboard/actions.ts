"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function deleteLovePage(pageId: string) {
    const start = Date.now();
    console.log(`[Delete] Starting delete for ${pageId}`);

    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.log(`[Delete] Unauthorized attempt`);
            return { error: "Unauthorized" };
        }

        // Initialize Admin Client to bypass RLS for deletion (ensures cascading works correctly)
        const supabaseAdmin = createSupabaseAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // Perform the delete using admin client
        const { error, count } = await supabaseAdmin
            .from('love_pages')
            .delete({ count: 'exact' })
            .eq('id', pageId)
            .eq('user_id', user.id); // Guardrail to ensure user only deletes their own

        if (error) {
            console.error("Delete Page Error:", error);
            return { error: "Failed to delete page from database" };
        }

        if (count === 0) {
            console.warn(`[Delete] No rows affected for page ${pageId}`);
            // This might happen if the page was already deleted or IDs don't match
        }

        console.log(`[Delete] Success. Operation took ${Date.now() - start}ms`);

        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error("Delete Page Exception:", error);
        return { error: "An unexpected error occurred" };
    }
}
