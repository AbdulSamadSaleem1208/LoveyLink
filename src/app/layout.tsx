import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://loveylink.net"),
  title: "LoveyLink - Create Your Romantic Love Page",
  description: "Share your love story with a beautiful, custom web page. Include photos, music, and your unique journey.",
  icons: {
    icon: [
      { url: "/favicon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-48.png",
  },
  openGraph: {
    title: "LoveyLink - Create Your Romantic Love Page",
    description: "Share your love story with a beautiful, custom web page. Include photos, music, and your unique journey.",
    url: "https://loveylink.net",
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
        <SiteChrome>{children}</SiteChrome>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
