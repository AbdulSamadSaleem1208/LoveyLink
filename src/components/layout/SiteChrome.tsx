"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SplashScreen from "@/components/SplashScreen";

/** Marketing chrome (splash, navbar, footer) — hidden on admin and auth flows. */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() ?? "";

    const isAdmin = pathname.startsWith("/admin");
    const isAuth =
        pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/forgot-password") ||
        pathname.startsWith("/update-password");

    const isAppShell =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/create");

    const showMarketingChrome = !isAdmin && !isAuth && !isAppShell;

    return (
        <>
            {showMarketingChrome && <SplashScreen />}
            {showMarketingChrome && <Navbar />}
            <main className="flex-grow">{children}</main>
            {showMarketingChrome && <Footer />}
        </>
    );
}
