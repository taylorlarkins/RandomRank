import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function FriendsSidebar() {
  const [friends, setFriends] = useState<{ id: string; username: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const {
        data: userData,
        error: userErr
      } = await supabase.auth.getUser();

      if (userErr || !userData?.user) {
        setLoading(false);
        return;
      }
      const userId = userData.user.id;

      const { data: rows, error } = await supabase
        .from("friendships")
        .select(`
          user_a,
          user_b,
          created_at,
          profiles_a: user_a ( id, username ),
          profiles_b: user_b ( id, username )
        `);

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const other: { id: string; username: string }[] = [];
      (rows || []).forEach((r: any) => {
        if (r.user_a === userId && r.profiles_b) other.push(r.profiles_b);
        else if (r.user_b === userId && r.profiles_a) other.push(r.profiles_a);
      });

      if (mounted) {
        setFriends(other);
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-semibold text-white">Friends</h2>
        <Link
          to="/friends"
          className="text-sm text-purple-400 hover:underline"
        >
          add friends
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="text-gray-400">Loading…</div>
        ) : friends.length === 0 ? (
          <div className="text-gray-400">You have no friends yet</div>
        ) : (
          friends.map((f) => (
            <div
              key={f.id}
              className="bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-gray-700"
            >
              <p className="text-white font-semibold">{f.username}</p>
              <p className="text-gray-400 text-sm">Agreement: —</p>
                View Full Comparison
            </div>
          ))
        )}
      </div>
    </div>
  );
}