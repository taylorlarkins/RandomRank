export default function FriendsList() {
  // Example static friend list
  const mockFriends = [
    { id: 1, username: "alex" },
    { id: 2, username: "jamie" },
    { id: 3, username: "riley" },
  ];

  return (
    <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-gray-700">

      <h2 className="text-2xl font-semibold mb-4 text-white">Your Friends</h2>

      <div className="flex flex-col gap-3">
        {mockFriends.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between bg-gray-800 p-4 rounded-xl border border-gray-700"
          >
            <span className="text-white font-medium">{user.username}</span>

            <button
              onClick={() => alert(`Removed friend ${user.username}`)}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold transition"
            >
              Remove
            </button>
          </div>
        ))}

        {mockFriends.length === 0 && (
          <p className="text-gray-500 text-sm text-center">You have no friends yet.</p>
        )}
      </div>

    </div>
  );
}
