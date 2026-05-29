"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

export default function AnimatedMockup() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % 2);
        }, 5500); // 5.5 seconds to give time to read the quote
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative mx-auto border-gray-800 bg-black border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl flex flex-col overflow-hidden">
            {/* Phone side buttons */}
            <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
            <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>

            {/* Screen Frame */}
            <div className="rounded-[2rem] overflow-x-hidden overflow-y-auto w-full h-full bg-black relative scrollbar-hide">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="w-full h-full"
                    >
                        {currentIndex === 0 ? (
                            // Format 1: Juliet
                            <div className="flex flex-col items-center w-full h-full pt-14 px-4 overflow-hidden">
                                <Heart className="w-16 h-16 text-pink-heart fill-pink-heart mb-6 shadow-sm shadow-pink-heart/30" />
                                <h2 className="font-bold text-3xl text-[#ff3366] mb-4 tracking-tight">
                                    For my love
                                </h2>
                                <div className="text-center mb-6">
                                    <p className="text-gray-400 text-sm mb-1">To my dearest,</p>
                                    <h3 className="font-serif text-3xl text-[#ff3366]">Juliet</h3>
                                </div>
                                <div className="w-full flex-1 mt-2 mb-[-2px] rounded-t-3xl overflow-hidden border-2 border-white/90 shadow-2xl relative">
                                    <motion.img
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 1.5, delay: 0.3 }}
                                        src="https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=1000&auto=format&fit=crop&grayscale=true"
                                        alt="Couple Hands"
                                        className="w-full h-full object-cover grayscale"
                                    />
                                </div>
                            </div>
                        ) : (
                            // Format 2: Romeo
                            <div className="flex flex-col items-center w-full min-h-full px-5 py-12 pb-20 justify-center">
                                {/* Gray Quote Card */}
                                <div className="bg-[#a3a3a3] rounded-3xl p-6 w-full shadow-2xl flex flex-col mb-6">
                                    <p className="font-serif italic text-[#2c3e50] text-[15px] leading-relaxed text-center font-medium">
                                        "Every moment with you feels like a beautiful dream I never want to
                                        wake up from. Your smile lights up the darkest days, and your love
                                        makes everything feel possible. I just want you to know... in this
                                        world, my heart always chooses you." ❤️ "
                                    </p>

                                    <div className="w-full h-px bg-white/40 my-6"></div>

                                    <div className="text-center">
                                        <p className="text-[10px] text-[#5c6f84] font-bold tracking-[0.2em] uppercase mb-2">
                                            With all my love
                                        </p>
                                        <h3 className="font-bold text-2xl text-[#ff3366] tracking-tight">Romeo</h3>
                                    </div>
                                </div>

                                {/* Spotify Embed */}
                                <div className="w-full shadow-2xl rounded-2xl overflow-hidden border border-white/5 opacity-90 hover:opacity-100 transition-opacity">
                                    <iframe
                                        style={{ borderRadius: "12px", background: "transparent" }}
                                        src="https://open.spotify.com/embed/track/5XeFesFbtLpXzIVDNQP22n?utm_source=generator&theme=0"
                                        width="100%"
                                        height="152"
                                        frameBorder="0"
                                        allowFullScreen={false}
                                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                        loading="lazy"
                                    ></iframe>
                                </div>

                                {/* Footer branding */}
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center text-[10px] text-gray-500 font-medium">
                                    Created with <Heart className="w-3 h-3 text-pink-heart fill-pink-heart mx-1" /> using LoveyLink
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
