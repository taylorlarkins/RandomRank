"use client";

import { ArrowLeft } from "lucide-react";

interface ComparisonPageProps {
  date: string;
  yourRanking: string[];
  friendRanking: string[];
  friendName: string;
}

export default function ComparisonPage({
  date,
  yourRanking,
  friendRanking,
  friendName,
}: ComparisonPageProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 flex flex-col items-center">

      {/* Back Button */}
      <div className="w-full max-w-4xl mb-4">
        <button className="flex items-center gap-2 bg-gray-800/80 hover:bg-gray-800 p-2 rounded-lg transition border border-gray-700 shadow-md w-fit">
          <ArrowLeft className="text-purple-500" size={18} />
          <span className="text-gray-300 text-sm">Back to Home</span>
        </button>
      </div>

      {/* Page Header */}
      <h1 className="text-2xl font-bold mb-1 text-center">{date}</h1>
      <p className="text-gray-400 text-center mb-4 text-sm">
        Compare your rankings with <span className="text-purple-500">{friendName}</span>
      </p>

      {/* Main Container */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Your Ranking Card */}
        <div className="bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-700 flex flex-col">
          <h2 className="text-lg font-semibold text-center mb-3">Your Ranking</h2>
          <div className="flex flex-col gap-1.5">
            {yourRanking.map((item, index) => (
              <div
                key={item}
                className="bg-gray-800 p-2 rounded-lg border border-gray-700 text-white flex items-center text-xs sm:text-sm"
              >
                <span className="w-5 text-right mr-2 font-bold">{index + 1}.</span>
                <span className="flex-1">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Friend's Ranking Card */}
        <div className="bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-700 flex flex-col">
          <h2 className="text-lg font-semibold text-center mb-3">{friendName}'s Ranking</h2>
          <div className="flex flex-col gap-1.5">
            {friendRanking.map((item, index) => (
              <div
                key={item}
                className="bg-gray-800 p-2 rounded-lg border border-gray-700 text-white flex items-center text-xs sm:text-sm"
              >
                <span className="w-5 text-right mr-2 font-bold">{index + 1}.</span>
                <span className="flex-1">{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
