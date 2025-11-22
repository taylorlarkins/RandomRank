export default function IncomingRequests() {
  // Example static mock requests
  const mockRequests = [
    { id: 1, username: "samantha" },
    { id: 2, username: "kai" },
  ];

  return (
    <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-gray-700">

      <h2 className="text-2xl font-semibold mb-4 text-white">Incoming Requests</h2>

      <div className="flex flex-col gap-3">
        {mockRequests.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between bg-gray-800 p-4 rounded-xl border border-gray-700"
          >
            <span className="text-white font-medium">{user.username}</span>

            <div className="flex gap-2">
              <button
                onClick={() => alert(`Accepted ${user.username}`)}
                className="p-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition"
              >
                Accept
              </button>
              <button
                onClick={() => alert(`Declined ${user.username}`)}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold transition"
              >
                Decline
              </button>
            </div>
          </div>
        ))}

        {mockRequests.length === 0 && (
          <p className="text-gray-500 text-sm text-center">
            No incoming requests right now.
          </p>
        )}
      </div>

    </div>
  );
}
