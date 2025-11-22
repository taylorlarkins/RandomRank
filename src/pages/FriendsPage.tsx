"use client";

import { useState } from "react";
import { UserPlus, UserCheck, UserMinus, ArrowLeft } from "lucide-react";

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [foundUsers, setFoundUsers] = useState<string[]>([]);
  const [friendRequests, setFriendRequests] = useState<string[]>([
    "Alice Winters",
    "David Collins",
  ]);
  const [friends, setFriends] = useState<string[]>([
    "John Smith",
    "Emma Johnson",
  ]);

  const mockUsers = [
    "John Smith",
    "Emma Johnson",
    "Alice Winters",
    "David Collins",
    "Megan Brown",
    "Chris Evans",
    "Sarah Parker",
  ];

  const handleSearch = () => {
    const results = mockUsers.filter(
      (u) =>
        u.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !friends.includes(u)
    );
    setFoundUsers(results);
  };

  const sendFriendRequest = (user: string) => {
    setFriendRequests([...friendRequests, user]);
    setFoundUsers(foundUsers.filter((u) => u !== user));
  };

  const acceptRequest = (user: string) => {
    setFriends([...friends, user]);
    setFriendRequests(friendRequests.filter((r) => r !== user));
  };

  const removeFriend = (user: string) => {
    setFriends(friends.filter((f) => f !== user));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 flex flex-col items-center overflow-x-hidden">
      {/* Back Button */}
      <div className="w-full max-w-2xl mb-6">
        <button className="flex items-center gap-2 bg-gray-800/80 hover:bg-gray-800 p-3 rounded-lg transition border border-gray-700 shadow-xl w-fit">
          <ArrowLeft className="text-purple-500" />
          <span className="text-gray-300">Back to Home</span>
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">Manage Friends</h1>

      {/* Outer Card*/}
      <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl w-full max-w-2xl space-y-8 border border-gray-700">

        {/* Search Users */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Search Users</h2>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by name..."
              className="flex-1 min-w-[180px] p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold p-3 rounded-lg transition w-full sm:w-auto"
            >
              Search
            </button>
          </div>

          {/* Search Results */}
          {foundUsers.length > 0 && (
            <div className="mt-4 space-y-3">
              <h3 className="text-gray-400 text-sm">Results:</h3>
              {foundUsers.map((user) => (
                <div
                  key={user}
                  className="flex flex-wrap justify-between items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <span className="flex-1">{user}</span>
                  <button
                    onClick={() => sendFriendRequest(user)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition w-full sm:w-auto justify-center"
                  >
                    <UserPlus size={18} />
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Friend Requests */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Friend Requests</h2>

          {friendRequests.length === 0 ? (
            <p className="text-gray-500 text-sm">No pending requests</p>
          ) : (
            <div className="space-y-3">
              {friendRequests.map((user) => (
                <div
                  key={user}
                  className="flex flex-wrap justify-between items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <span className="flex-1">{user}</span>
                  <button
                    onClick={() => acceptRequest(user)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition w-full sm:w-auto justify-center"
                  >
                    <UserCheck size={18} />
                    Accept
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Friends */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Your Friends</h2>

          {friends.length === 0 ? (
            <p className="text-gray-500 text-sm">You have no friends added</p>
          ) : (
            <div className="space-y-3">
              {friends.map((user) => (
                <div
                  key={user}
                  className="flex flex-wrap justify-between items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <span className="flex-1">{user}</span>
                  <button
                    onClick={() => removeFriend(user)}
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition w-full sm:w-auto justify-center"
                  >
                    <UserMinus size={18} />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
