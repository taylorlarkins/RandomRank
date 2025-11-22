import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { title: "Today's Ranking Summary", content: "Chart or graphic goes here." },
  { title: "How Your Friends Ranked", content: "Comparison visualization." },
  { title: "Your Historical Trends", content: "Line chart or heatmap." },
];

export default function StatsCarousel() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((index - 1 + slides.length) % slides.length);
  const next = () => setIndex((index + 1) % slides.length);

  const slide = slides[index];

  return (
    <div className="relative w-full max-w-2xl">

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20
                   p-3 bg-gray-800/80 hover:bg-gray-800 
                   rounded-full shadow-2xl border border-gray-700
                   transition"
      >
        <ChevronLeft className="text-white" />
      </button>

      <div className="bg-gray-800/80 backdrop-blur-md
                      p-10 rounded-2xl border border-gray-700 
                      shadow-2xl text-center">
        <h2 className="text-2xl font-semibold text-white mb-4">{slide.title}</h2>
        <p className="text-gray-400">{slide.content}</p>
      </div>

      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20
                   p-3 bg-gray-800/80 hover:bg-gray-800 
                   rounded-full shadow-2xl border border-gray-700
                   transition"
      >
        <ChevronRight className="text-white" />
      </button>

    </div>
  );
}
