"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import EasypaisaModal from "@/components/payment/EasypaisaModal";

export default function DashboardQueryEffects() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        if (searchParams.get("payment") === "submitted") {
            toast.success(
                "Payment submitted! We will verify within 1–2 hours and activate Premium on your dashboard.",
                { duration: 6000 }
            );
            const url = new URL(window.location.href);
            url.searchParams.delete("payment");
            router.replace(url.pathname + (url.search || ""), { scroll: false });
        }
    }, [searchParams, router]);

    useEffect(() => {
        if (searchParams.get("upgrade") === "1") {
            setShowPaymentModal(true);
        }
    }, [searchParams]);

    const closeModal = () => {
        setShowPaymentModal(false);
        if (searchParams.get("upgrade") === "1") {
            router.replace("/dashboard", { scroll: false });
        }
    };

    return (
        <EasypaisaModal
            isOpen={showPaymentModal}
            onClose={closeModal}
            redirectAfterSubmit="/dashboard?payment=submitted"
        />
    );
}
