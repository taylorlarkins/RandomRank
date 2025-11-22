export default function FriendsSidebar() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold text-white">Friends <span className="text-xs p-2 text-purple-400">add more</span></h2>

      <div className="flex flex-col gap-3">
        <div className="bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-gray-700">
          <p className="text-white font-semibold">alex</p>
          <p className="text-gray-400 text-sm">Agreement: 68%</p>
          <p className="text-purple-400 text-sm">View Full Comparison</p>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-gray-700">
          <p className="text-white font-semibold">jamie</p>
          <p className="text-gray-400 text-sm">Agreement: 74%</p>
          <p className="text-purple-400 text-sm">View Full Comparison</p>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-gray-700">
          <p className="text-white font-semibold">riley</p>
          <p className="text-gray-400 text-sm">Agreement: 61%</p>
          <p className="text-purple-400 text-sm">View Full Comparison</p>
        </div>
      </div>
    </div>
  );
}
