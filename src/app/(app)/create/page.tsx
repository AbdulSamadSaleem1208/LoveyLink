"use client";

import { useState, useEffect } from "react";
import { checkSubscriptionStatus, getSessionSubscriptionStatus } from "@/app/actions";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Upload, Music, ArrowRight, ArrowLeft, Loader2, Play, Pause } from "lucide-react";
import LovePageRenderer from "@/components/love-page/LovePageRenderer";
import { toast } from "sonner";
import Link from "next/link";
import { buildLovePageSlug } from "@/lib/slug";
import ThemePresetPicker from "@/components/create/ThemePresetPicker";
import { visibleInputClass } from "@/lib/form-input-styles";
import CreateFormField from "@/components/create/CreateFormField";
import {
    validateLovePageBasics,
    isLovePageBasicsValid,
    basicsCompletionCount,
    MIN_MESSAGE_LENGTH,
    type LovePageFieldErrors,
} from "@/lib/love-page-form-validation";

interface LovePageData {
    title: string;
    sender_name: string;
    recipient_name: string;
    message: string;
    theme: string;
    images: string[];
    music_url: string;
}

export default function CreateLovePage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<LovePageFieldErrors>({});

    const [formData, setFormData] = useState<LovePageData>({
        title: "",
        sender_name: "",
        recipient_name: "",
        message: "",
        theme: "#FF6B9D",
        images: [],
        music_url: ""
    });

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error("Please login to create a page");
                router.push("/login");
            }
        };
        checkUser();

        let wasPremium: boolean | null = null;
        const pollSubscription = async () => {
            const result = await getSessionSubscriptionStatus();
            if (!result.loggedIn) return;
            if (wasPremium === null) {
                wasPremium = result.isPremium;
                return;
            }
            if (wasPremium && !result.isPremium) {
                toast.info(
                    result.message ??
                        "Your premium access was updated. You may need to upgrade again to publish."
                );
            }
            wasPremium = result.isPremium;
        };

        pollSubscription();
        const interval = setInterval(pollSubscription, 20000);
        const onFocus = () => void pollSubscription();
        window.addEventListener("focus", onFocus);

        return () => {
            clearInterval(interval);
            window.removeEventListener("focus", onFocus);
        };
    }, [router]);

    const patchFormData = (patch: Partial<LovePageData>) => {
        setFormData((prev) => ({ ...prev, ...patch }));
    };

    const clearFieldError = (key: keyof LovePageFieldErrors) => {
        setFieldErrors((prev) => {
            if (!prev[key]) return prev;
            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    const tryNextStep = () => {
        if (step === 1) {
            const errors = validateLovePageBasics(formData);
            if (Object.keys(errors).length > 0) {
                setFieldErrors(errors);
                const first = Object.values(errors)[0];
                toast.error(first ?? "Please complete all required fields");
                return;
            }
            setFieldErrors({});
        }
        setStep((s) => Math.min(s + 1, 4));
    };

    const tryGoToPreview = () => {
        const errors = validateLovePageBasics(formData);
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            toast.error("Complete required fields before preview");
            setStep(1);
            return;
        }
        setFieldErrors({});
        setStep(4);
    };

    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    const basicsComplete = isLovePageBasicsValid(formData);
    const basicsProgress = basicsCompletionCount(formData);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const remaining = 5 - formData.images.length;
        if (remaining <= 0) {
            toast.error("Maximum 5 photos allowed");
            return;
        }

        setUploading(true);
        const files = Array.from(e.target.files).slice(0, remaining);
        const newImages: string[] = [];
        const supabase = createClient();

        try {
            const uploadPromises = files.map(async (file) => {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('love-page-assets')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('love-page-assets')
                    .getPublicUrl(filePath);

                return publicUrl;
            });

            const uploadedUrls = await Promise.all(uploadPromises);

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls]
            }));
            toast.success("Images uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Error uploading images");
        } finally {
            setUploading(false);
        }
    };

    const handlePublish = async () => {
        setPublishing(true);
        const supabase = createClient();

        try {
            // Get current user
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                console.error("Auth error:", authError);
                toast.error("You must be logged in to publish");
                // Save state to localstorage here if needed
                router.push("/login");
                return;
            }

            // Check Subscription Status (Server-Side)
            const { isPremium } = await checkSubscriptionStatus();

            if (!isPremium) {
                toast.error("Upgrade to Premium to publish & unlock QR code");
                // Optional: redirect to pricing after a short delay
                setTimeout(() => router.push("/dashboard?upgrade=1"), 1500);
                return;
            }

            const errors = validateLovePageBasics(formData);
            if (Object.keys(errors).length > 0) {
                setFieldErrors(errors);
                toast.error("Cannot publish — fill in all required fields");
                setPublishing(false);
                setStep(1);
                return;
            }
            setFieldErrors({});

            const slug = buildLovePageSlug(formData.recipient_name);

            // Convert Spotify URL to embed format if needed
            let musicUrl = formData.music_url;
            if (musicUrl) {
                const trackMatch = musicUrl.match(/track\/([a-zA-Z0-9]+)/);
                if (trackMatch && !musicUrl.includes('/embed/')) {
                    musicUrl = `https://open.spotify.com/embed/track/${trackMatch[1]}`;
                }
            }

            const payload = {
                user_id: user.id,
                slug: slug,
                title: formData.title,
                recipient_name: formData.recipient_name,
                sender_name: formData.sender_name,
                message: formData.message,
                images: formData.images,
                music_url: musicUrl,
                theme_config: {
                    primaryColor: formData.theme,
                    backgroundColor: "#000000",
                    fontFamily: "var(--font-outfit)",
                },
                published: true
            };

            console.log("Publishing payload:", payload);

            const { data, error } = await supabase
                .from('love_pages')
                .insert(payload)
                .select()
                .single();

            if (error) {
                console.error("Supabase insert error:", error);
                toast.error(`Failed to publish: ${error.message}`);
                throw error;
            }

            toast.success("Love Page Created!");
            router.push(`/dashboard/success/${data.id}`);
        } catch (error) {
            console.error("Publishing exception:", error);
            toast.error("An unexpected error occurred while publishing");
        } finally {
            setPublishing(false);
        }
    };

    return (
        <div className="flex flex-col text-white -m-4 sm:-m-6 lg:-m-8 min-h-[calc(100dvh-8rem)]">
            <div className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-md border-b border-white/10 py-3 px-4 sm:px-6 shrink-0">
                <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <Link
                            href="/dashboard"
                            className="text-gray-400 hover:text-white transition-colors shrink-0 p-2 rounded-lg hover:bg-white/5"
                            aria-label="Back to dashboard"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-wider text-pink-heart font-semibold">
                                Step {step} of 4
                            </p>
                            <h1 className="text-base sm:text-lg font-bold text-white truncate">
                                Create Love Page
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0" aria-label={`Step ${step} of 4`}>
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className={`h-2.5 rounded-full transition-all duration-300 ${
                                    step === i
                                        ? "w-8 sm:w-10 bg-gradient-to-r from-pink-heart to-red-primary shadow-lg shadow-pink-heart/50"
                                        : step > i
                                          ? "w-5 sm:w-7 bg-pink-heart/70"
                                          : "w-5 sm:w-7 bg-zinc-700/90 border border-white/15"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="max-w-2xl mx-auto rounded-2xl border border-white/10 bg-zinc-900/40 p-5 sm:p-8">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-white mb-1">The basics</h2>
                                    <p className="text-gray-400 text-sm">
                                        Required fields must be filled before you can publish.
                                    </p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                                            <div
                                                className="h-full bg-pink-heart transition-all duration-300"
                                                style={{ width: `${(basicsProgress / 4) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500 shrink-0">
                                            {basicsProgress}/4
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <CreateFormField
                                        id="page-title"
                                        label="Page title"
                                        required
                                        value={formData.title}
                                        onChange={(v) => {
                                            patchFormData({ title: v });
                                            clearFieldError("title");
                                        }}
                                        placeholder="e.g. For My Love"
                                        error={fieldErrors.title}
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <CreateFormField
                                            id="sender-name"
                                            label="Your name"
                                            required
                                            value={formData.sender_name}
                                            onChange={(v) => {
                                                patchFormData({ sender_name: v });
                                                clearFieldError("sender_name");
                                            }}
                                            placeholder="Your name"
                                            error={fieldErrors.sender_name}
                                        />
                                        <CreateFormField
                                            id="recipient-name"
                                            label="Their name"
                                            required
                                            value={formData.recipient_name}
                                            onChange={(v) => {
                                                patchFormData({ recipient_name: v });
                                                clearFieldError("recipient_name");
                                            }}
                                            placeholder="Their name"
                                            error={fieldErrors.recipient_name}
                                        />
                                    </div>
                                    <CreateFormField
                                        id="message"
                                        label="Your message"
                                        required
                                        as="textarea"
                                        rows={5}
                                        value={formData.message}
                                        onChange={(v) => {
                                            patchFormData({ message: v });
                                            clearFieldError("message");
                                        }}
                                        placeholder="Write something from your heart…"
                                        error={fieldErrors.message}
                                    />
                                    <p
                                        className={`text-xs mt-1 ${
                                            formData.message.trim().length >= MIN_MESSAGE_LENGTH
                                                ? "text-green-400/90"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {formData.message.trim().length}/{MIN_MESSAGE_LENGTH}{" "}
                                        characters (message minimum)
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-white mb-1">Memories</h2>
                                    <p className="text-gray-400 text-sm">
                                        <span className="text-gray-500">Optional</span> — add up to 5
                                        photos, or skip and continue.
                                    </p>
                                </div>

                                <div className="flex flex-col items-center space-y-4">
                                    <div className="w-full max-w-sm">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-2xl cursor-pointer bg-background-card hover:bg-white/5 transition-colors relative overflow-hidden group">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                {uploading ? (
                                                    <Loader2 className="w-8 h-8 text-red-primary animate-spin" />
                                                ) : (
                                                    <>
                                                        <Upload className="w-8 h-8 text-gray-400 mb-2 group-hover:text-white transition-colors" />
                                                        <p className="mb-2 text-sm text-gray-400"><span className="font-semibold text-white">Click to upload</span></p>
                                                        <p className="text-xs text-gray-500">PNG, JPG or GIF (Max 5)</p>
                                                    </>
                                                )}
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
                                        </label>
                                    </div>

                                    {formData.images.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
                                            {formData.images.map((img, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={img} alt={`Uploaded ${idx}`} className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                                        className="absolute top-1 right-1 bg-black/50 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-white mb-1">Set the mood</h2>
                                    <p className="text-gray-400 text-sm">
                                        Pick a color theme. Music is optional.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-1">
                                        Color theme
                                        <span className="ml-2 text-[10px] font-semibold uppercase text-pink-heart">
                                            Required
                                        </span>
                                    </label>
                                    <ThemePresetPicker
                                        selected={formData.theme}
                                        onSelect={(primary) => patchFormData({ theme: primary })}
                                    />
                                </div>

                                <div className="mt-8">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Spotify Track URL (Optional)</label>
                                    <div className="relative">
                                        <Music className="absolute top-3 left-3 w-5 h-5 text-gray-500" />
                                        <input
                                            type="text"
                                            value={formData.music_url}
                                            onChange={(e) =>
                                                patchFormData({ music_url: e.target.value })
                                            }
                                            onInput={(e) =>
                                                patchFormData({
                                                    music_url: (e.target as HTMLInputElement).value,
                                                })
                                            }
                                            className={`${visibleInputClass} pl-10`}
                                            placeholder="https://open.spotify.com/track/..."
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Paste a Spotify track link to add background music</p>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                {!basicsComplete && (
                                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                                        Complete required fields on step 1 before publishing.
                                    </div>
                                )}
                                {basicsComplete && (
                                    <div className="rounded-xl border border-green-500/25 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                                        Ready to publish — all required fields are filled.
                                    </div>
                                )}
                            <div className="h-[min(520px,55vh)] border border-white/10 rounded-2xl overflow-hidden bg-black relative"
                            >
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-black/60 backdrop-blur px-4 py-1 rounded-full text-xs text-white border border-white/10">
                                    Preview Mode
                                </div>
                                <LovePageRenderer
                                    data={{
                                        title: formData.title,
                                        sender_name: formData.sender_name,
                                        recipient_name: formData.recipient_name,
                                        message: formData.message,
                                        images: formData.images,
                                        music_url: formData.music_url,
                                        theme_config: {
                                            primaryColor: formData.theme,
                                            backgroundColor: "#000000",
                                            fontFamily: "var(--font-outfit)",
                                        }
                                    }}
                                    preview={true}
                                />
                            </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="sticky bottom-0 z-20 bg-zinc-950/95 backdrop-blur-md border-t border-white/10 py-3 px-4 sm:px-6 shrink-0 safe-bottom">
                <div className="max-w-2xl mx-auto flex justify-between gap-3">
                    {step > 1 ? (
                        <button
                            onClick={prevStep}
                            className="px-6 py-2 border border-white/10 rounded-xl text-white hover:bg-white/5 transition-colors font-medium"
                        >
                            Back
                        </button>
                    ) : (
                        <div></div>
                    )}

                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={tryNextStep}
                            className={`px-8 py-2.5 bg-button-gradient text-white rounded-xl hover:opacity-90 transition-all font-bold shadow-lg shadow-pink-heart/20 ${
                                step === 1 && !basicsComplete
                                    ? "opacity-70"
                                    : ""
                            }`}
                        >
                            Continue
                        </button>
                    ) : step === 3 ? (
                        <button
                            type="button"
                            onClick={tryGoToPreview}
                            className={`px-8 py-2.5 bg-button-gradient text-white rounded-xl hover:opacity-90 transition-all font-bold shadow-lg shadow-pink-heart/20 ${
                                !basicsComplete ? "opacity-70" : ""
                            }`}
                        >
                            Preview & publish
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handlePublish}
                            disabled={publishing}
                            className="px-8 py-2.5 bg-button-gradient text-white rounded-xl hover:opacity-90 transition-all font-bold shadow-lg shadow-pink-heart/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {publishing ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Publish page"
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
