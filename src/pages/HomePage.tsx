import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getMountainDateString } from "../utils/getMountainDate";
import FriendsSidebar from "../components/FriendsSidebar";
import ProfileMenu from "../components/ProfileMenu";
import GlobalAveragePanel from "../components/GlobalAveragePanel";

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkRanking() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate("/login");

      const today = getMountainDateString();
      const { data: ranking } = await supabase
        .from("user_rankings")
        .select("id")
        .eq("user_id", user.id)
        .eq("date", today)
        .single();

      if (!ranking) navigate("/rank");
      else setLoading(false);
    }

    checkRanking();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen p-4 bg-gray-900 flex items-center justify-center relative">
        <div className="absolute top-4 right-4">
          <ProfileMenu />
        </div>
        <p className="text-gray-400">Checking today’s ranking…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <div className="absolute top-4 right-4">
        <ProfileMenu />
      </div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlobalAveragePanel />
          <FriendsSidebar />
        </div>
      </div>
    </div>
  );
}