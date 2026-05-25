import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Using Outfit as requested for modern/romantic feel
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SplashScreen from "@/components/SplashScreen";
import { Toaster } from "sonner"; // Assuming sonner was installed

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.loveylink.net"),
  title: "LoveyLink - Create Your Romantic Love Page",
  description: "Share your love story with a beautiful, custom web page. Include photos, music, and your unique journey.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "LoveyLink - Create Your Romantic Love Page",
    description: "Share your love story with a beautiful, custom web page. Include photos, music, and your unique journey.",
    url: "https://www.loveylink.net",
    siteName: "LoveyLink",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "LoveyLink logo" }],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased min-h-screen flex flex-col`}>
        <SplashScreen />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
