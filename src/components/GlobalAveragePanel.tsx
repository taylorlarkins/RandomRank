import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { getMountainDateString } from "../utils/getMountainDate";
import { formatFullDate } from "../utils/formatFullDate";

type Row = {
  item_index: number;
  item_text: string;
  average_rank: number | null;
  rankings_count: number;
};

export default function GlobalAveragePanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [userRanks, setUserRanks] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [totalRankings, setTotalRankings] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const today = getMountainDateString();

      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      // Global averages
      const { data: avg } = await supabase.rpc("global_average_for_date", {
        p_date: today,
      });

      // Determine total submissions (max of rankings_count)
      let maxRanks = 0;
      if (avg) {
        maxRanks = avg.reduce(
          (m: number, r: Row) => Math.max(m, r.rankings_count || 0),
          0
        );
      }

      // User ranking lookup
      const { data: userRanking } = await supabase
        .from("user_rankings")
        .select("id")
        .eq("user_id", userData.user.id)
        .eq("date", today)
        .maybeSingle();

      let map: Record<number, number> = {};
      if (userRanking) {
        const { data: items } = await supabase
          .from("user_ranking_items")
          .select("item_index, rank_position")
          .eq("ranking_id", userRanking.id);

        (items ?? []).forEach((i) => (map[i.item_index] = i.rank_position));
      }

      setUserRanks(map);
      setRows(avg ?? []);
      setTotalRankings(maxRanks);
      setLoading(false);
    }

    load();
  }, []);

  const todayFormatted = formatFullDate(getMountainDateString());

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-2">Global Rankings</h2>

      <div className="bg-gray-800/80 p-4 rounded-2xl border border-gray-700 shadow-xl flex flex-col h-full">
        {/* Header */}
        <div className="text-center mb-3">
          <p className="text-white font-bold text-sm">{todayFormatted}</p>

          <p className="text-gray-400 text-xs mt-1">
            Average ranking for today's items across all players.
          </p>

          {totalRankings > 0 && (
            <p className="text-gray-400 text-xs mt-1">
              Based on{" "}
              <span className="text-purple-400 font-semibold">
                {totalRankings}
              </span>{" "}
              {totalRankings === 1 ? "submission" : "submissions"}.
            </p>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400 text-sm">Loading global averages…</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400 text-sm text-center">
              No submissions yet today. Be the first!
            </p>
          </div>
        ) : (
          <ul className="space-y-1.5 mt-1">
            {rows.map((row, idx) => (
              <li
                key={row.item_index}
                className="bg-gray-900/60 border border-gray-700 rounded-lg p-2 px-3 flex justify-between items-center text-sm"
              >
                {/* Left side: rank number + text */}
                <div className="flex items-center space-x-2">
                  <span className="text-purple-400 font-semibold w-5 text-right">
                    {idx + 1}.
                  </span>
                  <span className="text-white truncate max-w-[150px] sm:max-w-[180px]">
                    {row.item_text}
                  </span>
                </div>

                {/* Right side: stats */}
                <div className="text-right text-[0.65rem] text-gray-300 leading-tight">
                  <div>
                    avg:{" "}
                    <span className="text-white font-bold">
                      {row.average_rank?.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    Your Ranking:{" "}
                    <span className="text-purple-400 font-semibold">
                      {userRanks[row.item_index] ?? "—"}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
