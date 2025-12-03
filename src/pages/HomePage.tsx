import UserSidebar from "../components/UserSidebar";
import StatsCarousel from "../components/StatsCarousel";
import FriendsSidebar from "../components/friends/FriendsSidebar";
import ProfileMenu from "../components/ProfileMenu";

export default function HomePage() {
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
