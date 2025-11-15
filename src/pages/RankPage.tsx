import { useState } from "react";
import { Reorder } from "framer-motion";

interface RankPageProps {
  dailyItems: string[];
}

const RankPage: React.FC<RankPageProps> = ({ dailyItems }) => {
  const [items, setItems] = useState(dailyItems);

  const handleSubmit = () => {
    console.log("Submitted ranking:", items);
    alert("Your ranking has been submitted!");
  };

  return (
    <div className="min-h-screen p-4 bg-gray-900 flex flex-col items-center justify-center">
      <div className="bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl shadow-2xl w-full max-w-md mx-auto">
        <h1 className="text-white text-lg font-bold text-center mb-2">
          November 14th, 2025
        </h1>
        <p className="text-gray-400 text-center mb-4 text-sm">
          Drag the items to reorder from most liked (top) to least liked (bottom).
        </p>

        <Reorder.Group
          axis="y"
          values={items}
          onReorder={setItems}
          className="flex flex-col gap-2 w-full items-center"
        >
          {items.map((item, index) => (
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
          className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold p-3 rounded-lg transition"
        >
          Submit Ranking
        </button>
      </div>
    </div>
  );
};

export default RankPage;
