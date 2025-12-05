"use client";

import { useEffect, useState } from "react";
import { UserPlus, UserCheck, UserMinus, ArrowLeft } from "lucide-react";
import { supabase } from "../supabaseClient";

type Profile = { id: string; username: string };

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [foundUsers, setFoundUsers] = useState<Profile[]>([]);
  const [friendRequests, setFriendRequests] = useState<Profile[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<Profile[]>([]);
  const [friends, setFriends] = useState<Profile[]>([]);
  const [, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function init() {
      setLoading(true);
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData?.user) {
        console.error("Not authenticated", userErr);
        setLoading(false);
        return;
      }
      const uid = userData.user.id;
      if (!mounted) return;
      setUserId(uid);
      await reloadAll(uid);
      setLoading(false);
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  async function reloadAll(currentUserId: string) {
    await Promise.all([
      loadFriends(currentUserId),
      loadOutgoingRequests(currentUserId),
      loadIncomingRequests(currentUserId),
    ]);
  }

  async function loadFriends(currentUserId: string) {
    const { data: rows, error } = await supabase
      .from("friendships")
      .select(`
        user_a,
        user_b,
        profiles_a: user_a ( id, username ),
        profiles_b: user_b ( id, username )
      `)
      .or(`user_a.eq.${currentUserId},user_b.eq.${currentUserId}`);

    if (error) {
      console.error("loadFriends error", error);
      return;
    }

    const friendsList: Profile[] = [];
    (rows || []).forEach((r: any) => {
      if (r.user_a === currentUserId && r.profiles_b) friendsList.push(r.profiles_b);
      else if (r.user_b === currentUserId && r.profiles_a) friendsList.push(r.profiles_a);
    });

    setFriends(friendsList);
  }

  async function loadOutgoingRequests(currentUserId: string) {
    const { data, error } = await supabase
      .from("friend_requests")
      .select("recipient, profiles:recipient ( id, username )")
      .eq("requester", currentUserId)
      .eq("status", "pending");

    if (error) {
      console.error("loadOutgoingRequests error", error);
      return;
    }

    setFriendRequests((data || []).map((r: any) => r.profiles));
  }

  async function loadIncomingRequests(currentUserId: string) {
    const { data, error } = await supabase
      .from("friend_requests")
      .select("requester, profiles:requester ( id, username )")
      .eq("recipient", currentUserId)
      .eq("status", "pending");

    if (error) {
      console.error("loadIncomingRequests error", error);
      return;
    }

    setIncomingRequests((data || []).map((r: any) => r.profiles));
  }

  // SEARCH
  const handleSearch = async () => {
    if (!userId) return;
    if (!searchQuery.trim()) {
      setFoundUsers([]);
      return;
    }

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, username")
      .ilike("username", `%${searchQuery}%`)
      .limit(30);

    if (error) {
      console.error("profile search error", error);
      return;
    }

    const results: Profile[] = (profiles || []).filter((p: any) => p.id !== userId);

    // fetch current friends
    const { data: friRows } = await supabase
      .from("friendships")
      .select("user_a, user_b")
      .or(`user_a.eq.${userId},user_b.eq.${userId}`);

    const friendIds = new Set<string>();
    (friRows || []).forEach((r: any) => {
      if (r.user_a === userId) friendIds.add(r.user_b);
      else friendIds.add(r.user_a);
    });

    // fetch outgoing pending requests
    const { data: outRows } = await supabase
      .from("friend_requests")
      .select("recipient")
      .eq("requester", userId)
      .eq("status", "pending");

    const outgoingIds = new Set<string>((outRows || []).map((r: any) => r.recipient));

    setFoundUsers(results.filter((p) => !friendIds.has(p.id) && !outgoingIds.has(p.id)));
  };

  // SEND REQUEST
  const sendFriendRequest = async (recipient: Profile) => {
    if (!userId) return;

    try {
      // Delete any previous request between the two users (both directions)
      await supabase
        .from("friend_requests")
        .delete()
        .or(
          `and(requester.eq.${userId},recipient.eq.${recipient.id}),` +
          `and(requester.eq.${recipient.id},recipient.eq.${userId})`
        );

      // Insert fresh pending request
      const { error } = await supabase
        .from("friend_requests")
        .insert({
          requester: userId,
          recipient: recipient.id,
          status: "pending",
        });

      if (error) {
        console.error(error);
        alert("Could not send request: " + error.message);
        return;
      }

      await loadOutgoingRequests(userId);
      setFoundUsers((f) => f.filter((u) => u.id !== recipient.id));
    } catch (err) {
      console.error(err);
    }
  };

  // ACCEPT incoming request
  const acceptRequest = async (requester: Profile) => {
    if (!userId) return;

    // Ensure users are stored in a sorted, normalized order
    const [a, b] = [userId, requester.id].sort();

    try {
      // Create friendship
      const { error: insertErr } = await supabase
        .from("friendships")
        .insert({ user_a: a, user_b: b });

      if (insertErr) {
        console.error("friend insert error", insertErr);
        return;
      }

      // Remove the old friend request
      const { error: deleteErr } = await supabase
        .from("friend_requests")
        .delete()
        .eq("requester", requester.id)
        .eq("recipient", userId);

      if (deleteErr) console.error("delete request error", deleteErr);

      await reloadAll(userId);
    } catch (err) {
      console.error(err);
    }
  };

  // DECLINE incoming request
  const declineRequest = async (requester: Profile) => {
    if (!userId) return;

    const { error } = await supabase
      .from("friend_requests")
      .delete()
      .eq("requester", requester.id)
      .eq("recipient", userId);

    if (error) console.error(error);

    await loadIncomingRequests(userId);
  };


  // REMOVE FRIEND
  const removeFriend = async (friend: Profile) => {
    if (!userId) return;

    // Remove friendship row
    const { error: friendshipErr } = await supabase
      .from("friendships")
      .delete()
      .or(
        `and(user_a.eq.${userId},user_b.eq.${friend.id}),` +
        `and(user_a.eq.${friend.id},user_b.eq.${userId})`
      );

    if (friendshipErr) console.error("remove friend error", friendshipErr);

    // Delete any old friend requests between the two users
    const { error: reqErr } = await supabase
      .from("friend_requests")
      .delete()
      .or(
        `and(requester.eq.${userId},recipient.eq.${friend.id}),` +
        `and(requester.eq.${friend.id},recipient.eq.${userId})`
      );

    if (reqErr) console.error("delete friend_request error", reqErr);

    await loadFriends(userId);
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-2xl mb-6">
        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center gap-2 bg-gray-800/80 hover:bg-gray-800 p-3 rounded-lg transition border border-gray-700 shadow-xl w-fit"
        >
          <ArrowLeft className="text-purple-500" />
          <span className="text-gray-300">Back to Home</span>
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">Manage Friends</h1>

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
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
                  key={user.id}
                  className="flex flex-wrap justify-between items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <span className="flex-1">{user.username}</span>
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

        {/* Friend Requests (outgoing) */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Friend Requests Sent</h2>

          {friendRequests.length === 0 ? (
            <p className="text-gray-500 text-sm">No pending requests</p>
          ) : (
            <div className="space-y-3">
              {friendRequests.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-wrap justify-between items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <span className="flex-1">{user.username}</span>
                  <div className="text-gray-400 text-sm">Pending</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Incoming Requests */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Incoming Requests</h2>

          {incomingRequests.length === 0 ? (
            <p className="text-gray-500 text-sm">No incoming requests right now.</p>
          ) : (
            <div className="space-y-3">
              {incomingRequests.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-wrap justify-between items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <span className="flex-1">{user.username}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => acceptRequest(user)}
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition w-full sm:w-auto justify-center"
                    >
                      <UserCheck size={18} />
                      Accept
                    </button>
                    <button
                      onClick={() => declineRequest(user)}
                      className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition w-full sm:w-auto justify-center"
                    >
                      Decline
                    </button>
                  </div>
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
                  key={user.id}
                  className="flex flex-wrap justify-between items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <span className="flex-1">{user.username}</span>
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
