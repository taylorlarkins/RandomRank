import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

type FriendSummary = {
  friend_id: string;
  friend_username: string | null;
  overall_agreement: number | null;
  today_agreement: number | null;
};

export default function FriendsSidebar() {
  const [friends, setFriends] = useState<FriendSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData?.user) {
        setLoading(false);
        return;
      }

      const { data: overall, error: overallErr } = await supabase.rpc(
        "friend_agreements"
      );
      if (overallErr) {
        console.error(overallErr);
      }

      const { data: today, error: todayErr } = await supabase.rpc(
        "friend_agreements_today"
      );
      if (todayErr) {
        console.error(todayErr);
      }

      const merged: FriendSummary[] = (overall ?? []).map((row: any) => ({
        friend_id: row.friend_id,
        friend_username: row.friend_username,
        overall_agreement: row.agreement_percent ?? null,
        today_agreement:
          today?.find((t: any) => t.friend_id === row.friend_id)
            ?.today_agreement ?? null,
      }));

      if (mounted) {
        setFriends(merged);
        setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-xl font-semibold">Friends</h2>
        <Link to="/friends" className="text-purple-400">
          <UserPlus size={19} />
        </Link>
      </div>
      <div className="bg-gray-800/80 p-4 rounded-2xl border border-gray-700 shadow-xl flex flex-col h-full">
        {loading ? (
          <p className="text-gray-400 text-sm text-center flex-1 flex items-center justify-center">
            Loading…
          </p>
        ) : friends.length === 0 ? (
          <p className="text-gray-400 text-sm text-center flex-1 flex items-center justify-center">
            You have no friends yet
          </p>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {friends.map((f) => (
              <div
                key={f.friend_id}
                className="bg-gray-900/60 border border-gray-700 rounded-xl p-3 text-sm"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold">{f.friend_username}</span>
                  <Link
                    to={`/compare/${f.friend_id}`}
                    className="text-purple-400 text-xs hover:underline"
                  >
                    compare
                  </Link>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Today: {f.today_agreement ?? "—"}%</span>
                  <span>Overall: {f.overall_agreement ?? "—"}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
