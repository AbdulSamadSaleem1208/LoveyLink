"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getSessionSubscriptionStatus } from "@/app/actions";

type Props = {
    initialIsPremium: boolean;
};

const POLL_MS = 20_000;

export default function SubscriptionStatusPoller({ initialIsPremium }: Props) {
    const router = useRouter();
    const isPremiumRef = useRef(initialIsPremium);

    useEffect(() => {
        isPremiumRef.current = initialIsPremium;
    }, [initialIsPremium]);

    useEffect(() => {
        const poll = async () => {
            const result = await getSessionSubscriptionStatus();
            if (!result.loggedIn) return;

            const wasPremium = isPremiumRef.current;
            const nowPremium = result.isPremium;

            if (wasPremium !== nowPremium) {
                isPremiumRef.current = nowPremium;
                router.refresh();

                if (wasPremium && !nowPremium) {
                    toast.info(
                        result.message ??
                            "Your premium access was updated. Premium features are now off."
                    );
                } else if (!wasPremium && nowPremium) {
                    toast.success("Premium is now active on your account.");
                }
            }
        };

        const interval = setInterval(poll, POLL_MS);
        const onFocus = () => {
            void poll();
        };
        window.addEventListener("focus", onFocus);

        return () => {
            clearInterval(interval);
            window.removeEventListener("focus", onFocus);
        };
    }, [router]);

    return null;
}
