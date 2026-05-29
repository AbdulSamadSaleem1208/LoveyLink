"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getSessionSubscriptionStatus } from "@/app/actions";

type Props = {
    initialIsPremium: boolean;
    initialLabel: string;
};

const POLL_MS = 8_000;

export default function SubscriptionStatusPoller({
    initialIsPremium,
    initialLabel,
}: Props) {
    const router = useRouter();
    const isPremiumRef = useRef(initialIsPremium);
    const labelRef = useRef(initialLabel);

    useEffect(() => {
        isPremiumRef.current = initialIsPremium;
        labelRef.current = initialLabel;
    }, [initialIsPremium, initialLabel]);

    useEffect(() => {
        const poll = async () => {
            const result = await getSessionSubscriptionStatus();
            if (!result.loggedIn) return;

            const wasPremium = isPremiumRef.current;
            const nowPremium = result.isPremium;
            const prevLabel = labelRef.current;
            const newLabel = result.label ?? (nowPremium ? "Premium" : "Free");

            if (wasPremium !== nowPremium || prevLabel !== newLabel) {
                isPremiumRef.current = nowPremium;
                labelRef.current = newLabel;
                router.refresh();

                if (wasPremium && !nowPremium) {
                    toast.info(
                        result.message ??
                            `Your plan was updated to ${newLabel}. Premium features are now off.`
                    );
                } else if (!wasPremium && nowPremium) {
                    toast.success("Premium is now active on your account.");
                } else if (!wasPremium && !nowPremium && prevLabel !== newLabel) {
                    toast.info(`Your plan status is now: ${newLabel}.`);
                }
            }
        };

        void poll();
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
