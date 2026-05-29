"use client";

import { Check, Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import EasypaisaModal from "@/components/payment/EasypaisaModal";

export default function PricingPage() {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const router = useRouter();

    return (
        <div className="min-h-screen bg-black py-20 px-4">
            <EasypaisaModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} />

            <div className="max-w-3xl mx-auto text-center mb-16">
                <h1 className="text-4xl font-bold text-white mb-4">Simple, Romantic Pricing</h1>
                <p className="text-xl text-gray-400">Unlock endless possibilities for your love story.</p>
            </div>

            <div className="max-w-lg mx-auto bg-background-card rounded-3xl shadow-2xl overflow-hidden border border-white/10 transform hover:scale-105 transition-transform duration-300">
                <div className="px-6 py-8 sm:p-10 sm:pb-6 relative border-b border-white/5">
                    <div className="absolute top-0 right-0 bg-button-gradient text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">
                        Best Value
                    </div>
                    <div className="flex justify-center">
                        <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-red-900/30 text-red-400 border border-red-500/20">
                            Premium Plan
                        </span>
                    </div>
                    <div className="mt-4 flex flex-col items-center">
                        <div className="flex items-center gap-3 justify-center">
                            <span className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">PKR 500</span>
                            <span className="px-3 py-1 bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 text-xs font-bold rounded-full border border-red-500/30 uppercase tracking-wider shadow-lg">
                                Save 50%
                            </span>
                        </div>
                        <div className="text-gray-400 text-sm font-medium mt-2">
                            Regularly <span className="line-through decoration-gray-500">PKR 1000</span> / month
                        </div>
                    </div>
                    <p className="mt-5 text-lg text-gray-400 text-center">
                        Everything you need to create the perfect digital gift.
                    </p>
                </div>
                <div className="px-6 pt-6 pb-8 sm:px-10 sm:pt-6 sm:pb-8 bg-black/50">
                    <ul className="space-y-4">
                        {[
                            "Unlimited Love Pages",
                            "Custom QR Code Styles",
                            "Advanced Analytics (Who viewed & when)",
                            "Priority Support",
                            "Theme Customization",
                            "Remove 'Love Link' Branding"
                        ].map((feature) => (
                            <li key={feature} className="flex items-start">
                                <div className="flex-shrink-0">
                                    <Check className="h-6 w-6 text-green-500" aria-hidden="true" />
                                </div>
                                <p className="ml-3 text-base text-gray-300">{feature}</p>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-8">
                        <button
                            onClick={() => setShowPaymentModal(true)}
                            className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-button-gradient hover:opacity-90 shadow-lg shadow-red-900/40 transition-all font-bold"
                        >
                            <Heart className="h-5 w-5 mr-2 fill-current" />
                            Pay with Easypaisa
                        </button>
                        <p className="text-center text-xs text-gray-500 mt-4">
                            Manual verification usually takes 1-2 hours.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
