import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getMountainDateString } from "../utils/getMountainDate";
import UserSidebar from "../components/UserSidebar";
import StatsCarousel from "../components/StatsCarousel";
import FriendsSidebar from "../components/FriendsSidebar";
import ProfileMenu from "../components/ProfileMenu";

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkRanking() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/login");
          return;
        }

        const today = getMountainDateString();
        const { data: ranking } = await supabase
          .from("user_rankings")
          .select("id")
          .eq("user_id", user.id)
          .eq("date", today)
          .single();

        if (!ranking) {
          navigate("/rank");
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to check today's ranking:", err);
        setLoading(false);
      }
    }

    checkRanking();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen p-4 bg-gray-900 flex flex-col items-center justify-center">
        <ProfileMenu />
        <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl w-full max-w-md mx-auto text-center">
          <p className="text-gray-400">Checking today's ranking status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative flex flex-col">
      <div className="absolute top-4 right-4 z-50">
        <ProfileMenu />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-6 items-start md:items-center w-full max-w-7xl">

          <div className="order-1 md:order-2 bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-8 flex flex-col justify-center min-h-[450px]">
            <StatsCarousel />
          </div>

          <div className="order-2 md:order-1 bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-8 flex flex-col min-h-[400px]">
            <UserSidebar />
          </div>

          <div className="order-3 md:order-3 bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-8 flex flex-col min-h-[400px]">
            <FriendsSidebar />
          </div>

        </div>
      </div>
    </div>
  );
}
