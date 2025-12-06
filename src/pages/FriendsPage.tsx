import { useEffect, useState } from "react";
import {
  UserPlus,
  UserCheck,
  UserMinus,
  Home
} from "lucide-react";
import { supabase } from "../supabaseClient";
import ProfileMenu from "../components/ProfileMenu";
import { Link } from "react-router-dom";

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
      loadIncomingRequests(currentUserId)
    ]);
  }

  async function loadFriends(currentUserId: string) {
    const { data: rows } = await supabase
      .from("friendships")
      .select(`
        user_a,
        user_b,
        profiles_a: user_a ( id, username ),
        profiles_b: user_b ( id, username )
      `)
      .or(`user_a.eq.${currentUserId},user_b.eq.${currentUserId}`);

    const list: Profile[] = [];
    (rows || []).forEach((r: any) => {
      if (r.user_a === currentUserId && r.profiles_b) list.push(r.profiles_b);
      else if (r.user_b === currentUserId && r.profiles_a)
        list.push(r.profiles_a);
    });

    setFriends(list);
  }

  async function loadOutgoingRequests(currentUserId: string) {
    const { data } = await supabase
      .from("friend_requests")
      .select("recipient, profiles:recipient ( id, username )")
      .eq("requester", currentUserId)
      .eq("status", "pending");

    setFriendRequests((data || []).map((r: any) => r.profiles));
  }

  async function loadIncomingRequests(currentUserId: string) {
    const { data } = await supabase
      .from("friend_requests")
      .select("requester, profiles:requester ( id, username )")
      .eq("recipient", currentUserId)
      .eq("status", "pending");

    setIncomingRequests((data || []).map((r: any) => r.profiles));
  }

  // SEARCH
  const handleSearch = async () => {
    if (!userId) return;
    if (!searchQuery.trim()) return setFoundUsers([]);

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username")
      .ilike("username", `%${searchQuery}%`)
      .limit(30);

    const results: Profile[] = (profiles || []).filter(
      (p: any) => p.id !== userId
    );

    const { data: friRows } = await supabase
      .from("friendships")
      .select("user_a, user_b")
      .or(`user_a.eq.${userId},user_b.eq.${userId}`);

    const friendIds = new Set<string>();
    (friRows || []).forEach((r: any) => {
      if (r.user_a === userId) friendIds.add(r.user_b);
      else friendIds.add(r.user_a);
    });

    const { data: outRows } = await supabase
      .from("friend_requests")
      .select("recipient")
      .eq("requester", userId)
      .eq("status", "pending");

    const outgoingIds = new Set<string>(
      (outRows || []).map((r: any) => r.recipient)
    );

    setFoundUsers(
      results.filter((p) => !friendIds.has(p.id) && !outgoingIds.has(p.id))
    );
  };

  // SEND REQUEST
  const sendFriendRequest = async (recipient: Profile) => {
    if (!userId) return;

    await supabase
      .from("friend_requests")
      .delete()
      .or(
        `and(requester.eq.${userId},recipient.eq.${recipient.id}),` +
          `and(requester.eq.${recipient.id},recipient.eq.${userId})`
      );

    await supabase.from("friend_requests").insert({
      requester: userId,
      recipient: recipient.id,
      status: "pending"
    });

    await loadOutgoingRequests(userId);
    setFoundUsers((f) => f.filter((u) => u.id !== recipient.id));
  };

  // ACCEPT
  const acceptRequest = async (requester: Profile) => {
    if (!userId) return;

    const [a, b] = [userId, requester.id].sort();
    await supabase.from("friendships").insert({ user_a: a, user_b: b });

    await supabase
      .from("friend_requests")
      .delete()
      .eq("requester", requester.id)
      .eq("recipient", userId);

    await reloadAll(userId);
  };

  // DECLINE
  const declineRequest = async (requester: Profile) => {
    if (!userId) return;

    await supabase
      .from("friend_requests")
      .delete()
      .eq("requester", requester.id)
      .eq("recipient", userId);

    await loadIncomingRequests(userId);
  };

  // REMOVE FRIEND
  const removeFriend = async (friend: Profile) => {
    if (!userId) return;

    await supabase
      .from("friendships")
      .delete()
      .or(
        `and(user_a.eq.${userId},user_b.eq.${friend.id}),` +
          `and(user_a.eq.${friend.id},user_b.eq.${userId})`
      );

    await supabase
      .from("friend_requests")
      .delete()
      .or(
        `and(requester.eq.${userId},recipient.eq.${friend.id}),` +
          `and(requester.eq.${friend.id},recipient.eq.${userId})`
      );

    await loadFriends(userId);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">

      {/* Top-left Home button */}
      <div className="absolute top-4 left-4">
        <Link
          to="/"
          className="bg-gray-800 border border-gray-700 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-700"
        >
          <Home size={20} className="text-white" />
        </Link>
      </div>

      {/* Top-right ProfileMenu */}
      <div className="absolute top-4 right-4">
        <ProfileMenu />
      </div>

      {/* Page Content Centered */}
      <div className="min-h-screen flex flex-col items-center justify-center p-4">

        {/* ⭐ Centered Title Above Panel ⭐ */}
        <h1 className="text-xl font-bold mb-4 text-center">
          Manage Friends
        </h1>

        {/* Main Panel */}
        <div className="w-full max-w-2xl bg-gray-800/80 border border-gray-700 rounded-2xl p-6 shadow-xl">

          {/* Scrollable Panel Body */}
          <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2">

            {/* SEARCH USERS */}
            <section>
              <h2 className="text-lg font-semibold mb-3">Search Users</h2>
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  placeholder="Search by username"
                  className="flex-1 min-w-[160px] p-2 rounded-lg bg-gray-900 border border-gray-700 text-sm text-white focus:ring-2 focus:ring-purple-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm"
                >
                  Search
                </button>
              </div>

              {foundUsers.length > 0 && (
                <div className="mt-3 space-y-2">
                  <h3 className="text-gray-400 text-xs">Results:</h3>
                  {foundUsers.map((u) => (
                    <div
                      key={u.id}
                      className="flex justify-between items-center p-3 bg-gray-900/60 border border-gray-700 rounded-xl text-sm"
                    >
                      <span>{u.username}</span>
                      <button
                        onClick={() => sendFriendRequest(u)}
                        className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg text-sm"
                      >
                        <UserPlus size={16} /> Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* SENT REQUESTS */}
            <section>
              <h2 className="text-lg font-semibold mb-2">Requests You Sent</h2>
              {friendRequests.length === 0 ? (
                <p className="text-gray-500 text-xs">No pending requests</p>
              ) : (
                <div className="space-y-2">
                  {friendRequests.map((u) => (
                    <div
                      key={u.id}
                      className="flex justify-between items-center p-3 bg-gray-900/60 border border-gray-700 rounded-xl text-sm"
                    >
                      <span>{u.username}</span>
                      <span className="text-gray-400 text-xs">Pending</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* INCOMING REQUESTS */}
            <section>
              <h2 className="text-lg font-semibold mb-2">Incoming Requests</h2>
              {incomingRequests.length === 0 ? (
                <p className="text-gray-500 text-xs">No incoming requests</p>
              ) : (
                <div className="space-y-2">
                  {incomingRequests.map((u) => (
                    <div
                      key={u.id}
                      className="flex justify-between items-center p-3 bg-gray-900/60 border border-gray-700 rounded-xl text-sm"
                    >
                      <span>{u.username}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => acceptRequest(u)}
                          className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg text-sm"
                        >
                          <UserCheck size={16} /> Accept
                        </button>
                        <button
                          onClick={() => declineRequest(u)}
                          className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg text-sm"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* FRIEND LIST */}
            <section>
              <h2 className="text-lg font-semibold mb-2">Your Friends</h2>
              {friends.length === 0 ? (
                <p className="text-gray-500 text-xs">You have no friends yet</p>
              ) : (
                <div className="space-y-2">
                  {friends.map((u) => (
                    <div
                      key={u.id}
                      className="flex justify-between items-center p-3 bg-gray-900/60 border border-gray-700 rounded-xl text-sm"
                    >
                      <span>{u.username}</span>
                      <button
                        onClick={() => removeFriend(u)}
                        className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg text-sm"
                      >
                        <UserMinus size={16} /> Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}