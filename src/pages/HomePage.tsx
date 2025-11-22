import UserSidebar from "../components/UserSidebar";
import StatsCarousel from "../components/StatsCarousel";
import FriendsSidebar from "../components/friends/FriendsSidebar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
      
      {/* CENTER FIRST ON MOBILE */}
      <div className="order-1 md:order-2 md:w-3/5 p-6 flex items-center justify-center">
        <StatsCarousel />
      </div>

      {/* LEFT SIDEBAR (User) */}
      <div className="order-2 md:order-1 md:w-1/5 p-4 
                      bg-gray-800/80 backdrop-blur-md 
                      border-b md:border-b-0 md:border-r 
                      border-gray-700">
        <UserSidebar />
      </div>

      {/* RIGHT SIDEBAR (Friends) */}
      <div className="order-3 md:order-3 md:w-1/5 p-4 
                      bg-gray-800/80 backdrop-blur-md 
                      border-t md:border-t-0 md:border-l 
                      border-gray-700">
        <FriendsSidebar />
      </div>

    </div>
  );
}