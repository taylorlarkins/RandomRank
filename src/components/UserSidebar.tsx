export default function UserSidebar() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Your Profile</h2>
        <div className="bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-gray-700">
          <p className="text-gray-400">Username: <span className="text-white">taylor</span></p>
          <p className="text-gray-400">Streak: <span className="text-purple-400">5 days</span></p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Your Stats</h2>
        <div className="bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-gray-700">
          <p className="text-gray-400">Friend Agreement: 72%</p>
          <p className="text-gray-400">Total Days Played: 14</p>
        </div>
      </div>
    </div>
  );
}
