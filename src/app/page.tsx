import Link from "next/link";
import { Heart, Share2, QrCode, Star, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import AnimatedMockup from "@/components/home/AnimatedMockup";

// Force dynamic rendering since we check auth with cookies
export const dynamic = "force-dynamic";

export default async function Home() {
  let user = null;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } else {
      console.error("Missing Supabase Environment Variables in Home Page");
    }
  } catch (error) {
    console.error("Home Page Auth Check Error:", error);
  }

  return (
    <div
      data-home-page
      className="flex flex-col min-h-screen bg-black text-white font-sans"
    >
      {/* Top Banner — subtle, not neon */}
      <div className="bg-zinc-900/90 border-b border-rose-300/15 py-2 text-center text-rose-100/90 text-sm font-medium tracking-wide">
        <span className="mr-2 opacity-80">✨</span>
        Create a beautiful love page — simple and romantic
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-32 overflow-hidden">
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(201, 163, 177, 0.12) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 90% 60%, rgba(154, 122, 134, 0.08) 0%, transparent 50%)",
          }}
        />
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-20 left-10 text-rose-300/25 animate-bounce delay-100">
            <Heart size={40} className="fill-current" />
          </div>
          <div className="absolute top-40 right-20 text-rose-300/20 animate-pulse">
            <Heart size={60} className="fill-current" />
          </div>
          <div className="absolute bottom-20 left-1/4 text-rose-300/20 animate-bounce delay-700">
            <Heart size={30} className="fill-current" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full border border-rose-200/20 bg-rose-950/30 text-rose-100/90 text-sm backdrop-blur-sm">
                <Heart className="w-4 h-4 mr-2 fill-current opacity-80" />
                Want to start?
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight selection:bg-rose-900 selection:text-white">
                Declare your love <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-200/95 via-rose-100/80 to-white/70">
                  for someone special!
                </span>
              </h1>

              <p className="text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Create a personalized page for who you love and surprise that person with a special declaration that will last forever.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link
                  href={user ? "/dashboard" : "/register"}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-lg text-white bg-gradient-to-r from-rose-800/90 to-rose-600/80 hover:from-rose-700/90 hover:to-rose-500/80 border border-rose-300/25 shadow-lg shadow-black/40 transition-all transform hover:scale-[1.02]"
                >
                  <Heart className="w-5 h-5 mr-3 heart-white fill-current" />
                  {user ? "Go to Dashboard" : "Create my page"}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </div>

              <div className="bg-background-card/50 backdrop-blur-md p-4 rounded-xl border border-white/10 inline-block text-left mt-8 max-w-sm">
                <div className="flex text-yellow-400/90 mb-1">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-sm font-medium text-gray-300">Loved by couples worldwide</p>
                <p className="text-xs text-gray-500 mt-1">Join 10,000+ happy couples</p>
              </div>
            </div>

            <div className="flex-1 relative flex justify-center lg:justify-end">
              <div className="absolute -left-10 top-1/4 bg-zinc-900/80 border border-white/10 px-4 py-2.5 rounded-xl text-xs text-gray-300 z-20 hidden md:block backdrop-blur-sm">
                <span className="text-rose-300/80">♥</span> Live love pages
              </div>
              <div className="absolute -right-5 top-1/3 bg-zinc-900/80 border border-white/10 px-4 py-2.5 rounded-xl text-xs text-gray-300 z-20 hidden md:block backdrop-blur-sm">
                Animated & beautiful <span className="text-rose-300/80">♥</span>
              </div>
              <div className="absolute -right-2 bottom-1/4 bg-background-card/80 border border-white/10 px-3 py-2 rounded-lg text-[10px] text-gray-400 z-20 hidden md:block backdrop-blur-md">
                Our relationship — couple love pages
              </div>

              <AnimatedMockup />
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 bg-background-card border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-rose-200/70 font-semibold tracking-wide uppercase text-sm mb-2">
              How it works
            </h2>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Create your surprise in 3 steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
              icon={<Star className="h-8 w-8 text-rose-300/80" />}
              title="1. Customize"
              description="Choose your colors, photos, and write a message from your heart."
            />
            <FeatureCard
              icon={<QrCode className="h-8 w-8 text-rose-300/80" />}
              title="2. Generate QR"
              description="Get a unique QR code automatically created for your page."
            />
            <FeatureCard
              icon={<Share2 className="h-8 w-8 text-rose-300/80" />}
              title="3. Surprise!"
              description="Share the link or print the QR code to surprise your love."
            />
          </div>
        </div>
      </section>

      <footer className="py-8 bg-black text-center text-gray-600 text-sm border-t border-white/10">
        <p>© {new Date().getFullYear()} LoveyLink. All rights reserved.</p>
        <div className="mt-4">
          <Link
            href="/login"
            className="text-gray-700 hover:text-gray-500 transition-colors text-xs"
          >
            Admin Login
          </Link>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-8 bg-black/50 rounded-2xl border border-white/10 hover:border-rose-200/20 transition-colors group">
      <div className="mb-6 p-4 bg-rose-950/25 rounded-xl inline-block group-hover:bg-rose-950/40 transition-colors border border-rose-200/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
