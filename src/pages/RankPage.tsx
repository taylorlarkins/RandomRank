import { useEffect, useState } from "react";
import { Reorder } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getDailyItems } from "../lib/getDailyItems";
import { submitRanking } from "../lib/submitRanking";

const RankPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadItems() {
      try {
        const fetched = await getDailyItems();
        setItems(fetched);
      } catch (err: any) {
        setError("Failed to load today's ranking items.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, []);

  const handleSubmit = async () => {
    if (!items) return;

    setSubmitting(true);
    setError(null);

    try {
      await submitRanking(items);
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to submit your ranking.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading…
      </div>
    );
  }

  if (error && !items) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  function formatPrettyDate(date: Date): string {
    const day = date.getDate();
    const suffix =
      day === 1 || day === 21 || day === 31
        ? "st"
        : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
        ? "rd"
        : "th";

    return date
      .toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
      .replace(String(day), `${day}${suffix}`);
  }

  const today = formatPrettyDate(new Date());

  return (
    <div className="min-h-screen p-4 bg-gray-900 flex flex-col items-center justify-center">
      <div className="bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl shadow-2xl w-full max-w-md mx-auto">
        <h1 className="text-white text-lg font-bold text-center mb-2">
          {today}
        </h1>

        <p className="text-gray-400 text-center mb-4 text-sm">
          Drag the items to reorder from most liked (top) to least liked (bottom).
        </p>

        <Reorder.Group
          axis="y"
          values={items!}
          onReorder={setItems}
          className="flex flex-col gap-2 w-full items-center"
        >
          {items!.map((item, index) => (
            <Reorder.Item
              key={item}
              value={item}
              dragElastic={0}
              className="bg-gray-800 p-2 rounded-lg border border-gray-700 text-white text-sm w-full max-w-[190px] cursor-grab flex items-center"
            >
              <span className="w-6 text-right mr-2 font-bold">{index + 1}.</span>
              <span className="flex-1 text-center">{item}</span>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`mt-4 w-full ${
            submitting ? "bg-gray-600" : "bg-purple-600 hover:bg-purple-700"
          } text-white font-semibold p-3 rounded-lg transition`}
        >
          {submitting ? "Submitting…" : "Submit Ranking"}
        </button>

        {error && (
          <p className="mt-2 text-red-400 text-sm text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default RankPage;
