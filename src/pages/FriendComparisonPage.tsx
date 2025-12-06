// File: /src/pages/FriendComparisonPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getMountainDateString } from "../utils/getMountainDate";
import { formatFullDate } from "../utils/formatFullDate";
import ProfileMenu from "../components/ProfileMenu";
import { Home } from "lucide-react";

type Row = {
  item_index: number;
  item: string;
  my_rank: number | null;
  friend_rank: number | null;
};

export default function FriendComparisonPage() {
  const { friendId } = useParams<{ friendId: string }>();

  const [date, setDate] = useState(getMountainDateString());
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [friendUsername, setFriendUsername] = useState("Friend");
  const [overallAgreement, setOverallAgreement] = useState<number | null>(null);

  const [hasMyData, setHasMyData] = useState<boolean | null>(null);
  const [hasFriendData, setHasFriendData] = useState<boolean | null>(null);

  useEffect(() => {
    if (!friendId) return;
    let mounted = true;

    async function load() {
      setLoading(true);

      // Fetch friend username
      const { data: p } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", friendId)
        .maybeSingle();
      if (mounted && p?.username) setFriendUsername(p.username);

      // Check rankings exist
      const { data: friendRanking } = await supabase
        .from("user_rankings")
        .select("id")
        .eq("user_id", friendId)
        .eq("date", date)
        .maybeSingle();

      const { data: auth } = await supabase.auth.getUser();
      let myRanking: any = null;
      if (auth?.user) {
        const { data: r } = await supabase
          .from("user_rankings")
          .select("id")
          .eq("user_id", auth.user.id)
          .eq("date", date)
          .maybeSingle();
        myRanking = r;
      }

      if (mounted) {
        setHasFriendData(!!friendRanking);
        setHasMyData(!!myRanking);
      }

      if (!friendRanking || !myRanking) {
        if (mounted) {
          setRows([]);
          setLoading(false);
        }
        return;
      }

      // Comparison RPC
      const { data, error } = await supabase.rpc("friend_day_comparison", {
        friend_id: friendId,
        day: date,
      });

      if (mounted) {
        setRows(error ? [] : data ?? []);
        setLoading(false);
      }

      // Overall agreement
      const { data: agreements } = await supabase.rpc("friend_agreements");
      if (mounted && agreements) {
        const row = agreements.find((a: any) => a.friend_id === friendId);
        setOverallAgreement(row?.agreement_percent ?? null);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [friendId, date]);

  const agreement = useMemo(() => {
    const valid = rows.filter(
      (r) => r.my_rank != null && r.friend_rank != null
    );
    if (valid.length <= 1) return null;

    const total = valid.reduce(
      (sum, r) => sum + Math.abs(r.my_rank! - r.friend_rank!),
      0
    );

    const sim = 1 - total / (valid.length * (valid.length - 1));
    return Math.round(sim * 100);
  }, [rows]);

  const formattedDate = formatFullDate(date);

  return (
    <div className="min-h-screen bg-gray-900 text-white relative p-3">

      {/* Home button */}
      <div className="absolute top-4 left-4">
        <Link
          to="/"
          className="bg-gray-800 border border-gray-700 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-700"
        >
          <Home size={20} className="text-white" />
        </Link>
      </div>

      {/* Profile menu */}
      <div className="absolute top-4 right-4">
        <ProfileMenu />
      </div>

      <div className="flex flex-col items-center mt-14">

        <h1 className="text-xl font-bold mb-1 text-center">
          Comparison with {friendUsername}
        </h1>

        <p className="text-gray-400 text-xs mb-2 text-center">
          Rankings for {formattedDate}
        </p>

        {/* Date Picker */}
        <div className="mb-2">
          <input
            type="date"
            className="bg-gray-800 text-white border border-gray-700 rounded-lg p-1.5 text-sm focus:ring-2 focus:ring-purple-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* ⭐ Inline Compact Agreement Row */}
        <div className="text-gray-300 text-xs mb-3 flex gap-3 text-center">
          <div>
            Today's Agreement:{" "}
            {agreement == null ? "—" : (
              <span className="text-purple-400 font-semibold">{agreement}%</span>
            )}
          </div>
          <div>
            Overall Agreement:{" "}
            {overallAgreement == null ? "—" : (
              <span className="text-purple-400 font-semibold">
                {overallAgreement}%
              </span>
            )}
          </div>
        </div>

        {/* Panels grid */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Your ranking */}
          <div className="flex flex-col h-full">
            <h2 className="text-lg font-semibold mb-1 text-center">Your Ranking</h2>
            <div className="bg-gray-800/80 p-3 rounded-2xl border border-gray-700 shadow-xl flex-1">

              {loading ? (
                <p className="text-gray-400 text-center text-sm">Loading…</p>
              ) : !hasMyData ? (
                <p className="text-gray-500 text-center text-sm">
                  No comparison for this date.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {rows
                    .slice()
                    .sort((a, b) => (a.my_rank ?? 999) - (b.my_rank ?? 999))
                    .map((r) => (
                      <li
                        key={r.item_index}
                        className="bg-gray-900/60 border border-gray-700 rounded-lg p-2 text-sm"
                      >
                        <span className="text-purple-400 font-semibold mr-2">
                          {r.my_rank ?? "—"}.
                        </span>
                        {r.item}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>

          {/* Friend ranking */}
          <div className="flex flex-col h-full">
            <h2 className="text-lg font-semibold mb-1 text-center">
              {friendUsername}'s Ranking
            </h2>

            <div className="bg-gray-800/80 p-3 rounded-2xl border border-gray-700 shadow-xl flex-1">
              {loading ? (
                <p className="text-gray-400 text-center text-sm">Loading…</p>
              ) : !hasFriendData ? (
                <p className="text-gray-500 text-center text-sm">
                    No comparison for this date.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {rows
                    .slice()
                    .sort((a, b) => (a.friend_rank ?? 999) - (b.friend_rank ?? 999))
                    .map((r) => (
                      <li
                        key={r.item_index}
                        className="bg-gray-900/60 border border-gray-700 rounded-lg p-2 text-sm"
                      >
                        <span className="text-purple-400 font-semibold mr-2">
                          {r.friend_rank ?? "—"}.
                        </span>
                        {r.item}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
