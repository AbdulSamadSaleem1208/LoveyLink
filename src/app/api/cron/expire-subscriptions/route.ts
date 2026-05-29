import { NextResponse } from "next/server";
import { expireDueSubscriptions } from "@/lib/subscription-expiration";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await expireDueSubscriptions();

    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
        ok: true,
        expiredCount: result.expiredCount,
    });
}
