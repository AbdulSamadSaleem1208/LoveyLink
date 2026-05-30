import { createClient } from "@/lib/supabase/server";
import HomePageContent from "@/components/home/HomePageContent";

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

  return <HomePageContent isLoggedIn={!!user} />;
}
