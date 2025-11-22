import { useState } from "react";

export default function FriendsSearch() {
  const [query, setQuery] = useState("");

  // Example static mock data
  const results = query
    ? [
        { id: 1, username: "alex" },
        { id: 2, username: "jamie" },
      ]
    : [];

  return (
    <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-gray-700">

      <h2 className="text-2xl font-semibold mb-4 text-white">Search Users</h2>

      <input
        type="text"
        placeholder="Search by username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400
                   border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
      />

      <div className="flex flex-col gap-3">
        {results.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between bg-gray-800 p-4 rounded-xl border border-gray-700"
          >
            <span className="text-white font-medium">{user.username}</span>
            <button
              className="p-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition"
              onClick={() => alert(`Send friend request to ${user.username}`)}
            >
              Add
            </button>
          </div>
        ))}

        {!query && (
          <p className="text-gray-500 text-sm text-center">
            Start typing to search for users
          </p>
        )}
      </div>
    </div>
  );
}
