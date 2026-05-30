"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function deleteLovePage(pageId: string | string[]) {
    const start = Date.now();
    const ids = Array.isArray(pageId) ? pageId : [pageId];
    console.log(`[Delete] Starting delete for ${ids.length} pages: ${ids.join(', ')}`);

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
            .in('id', ids) // Use .in() for multiple IDs
            .eq('user_id', user.id); // Guardrail to ensure user only deletes their own

        if (error) {
            console.error("Delete Page Error:", error);
            return { error: "Failed to delete pages from database" };
        }

        console.log(`[Delete] Success. Deleted ${count} rows. Operation took ${Date.now() - start}ms`);

        revalidatePath('/dashboard');
        return { success: true, count };
    } catch (error) {
        console.error("Delete Page Exception:", error);
        return { error: "An unexpected error occurred" };
    }
}
