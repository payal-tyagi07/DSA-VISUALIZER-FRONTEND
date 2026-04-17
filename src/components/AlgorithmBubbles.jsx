import React, { useState, useMemo } from 'react';
import topics from '../data/a2zTopics';

// Flatten all algorithms
const getAllAlgorithms = () => {
  const algorithms = [];
  for (const step of topics) {
    for (const subtopic of step.subtopics) {
      for (const problem of subtopic.problems) {
        algorithms.push({
          id: problem.id,
          name: problem.name,
          stepName: step.name,
          visualizable: problem.visualizable,
        });
      }
    }
  }
  return algorithms;
};

// Category → color mapping (dark themes)
const getBubbleColor = (stepName) => {
  if (stepName.includes('Sort')) return 'from-blue-900/80 to-blue-800/80 border-blue-500/30';
  if (stepName.includes('Search')) return 'from-emerald-900/80 to-emerald-800/80 border-emerald-500/30';
  if (stepName.includes('Array')) return 'from-purple-900/80 to-purple-800/80 border-purple-500/30';
  if (stepName.includes('String')) return 'from-pink-900/80 to-pink-800/80 border-pink-500/30';
  if (stepName.includes('Linked')) return 'from-amber-900/80 to-amber-800/80 border-amber-500/30';
  if (stepName.includes('Recursion')) return 'from-indigo-900/80 to-indigo-800/80 border-indigo-500/30';
  if (stepName.includes('Bit')) return 'from-gray-800/80 to-gray-700/80 border-gray-500/30';
  if (stepName.includes('Stack')) return 'from-red-900/80 to-red-800/80 border-red-500/30';
  if (stepName.includes('Window')) return 'from-teal-900/80 to-teal-800/80 border-teal-500/30';
  if (stepName.includes('Heap')) return 'from-orange-900/80 to-orange-800/80 border-orange-500/30';
  if (stepName.includes('Greedy')) return 'from-yellow-900/80 to-yellow-800/80 border-yellow-500/30';
  if (stepName.includes('Tree')) return 'from-lime-900/80 to-lime-800/80 border-lime-500/30';
  if (stepName.includes('Graph')) return 'from-cyan-900/80 to-cyan-800/80 border-cyan-500/30';
  if (stepName.includes('DP')) return 'from-rose-900/80 to-rose-800/80 border-rose-500/30';
  return 'from-slate-800/80 to-slate-700/80 border-slate-500/30';
};

const AlgorithmBubbles = ({ onSelectAlgorithm }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const algorithms = useMemo(() => getAllAlgorithms(), []);

  const filteredAlgorithms = searchQuery.trim()
    ? algorithms.filter(algo =>
        algo.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : algorithms;

  return (
    <div className="h-full w-full bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] overflow-auto">
      {/* Sticky search bar */}
      <div className="sticky top-0 z-10 p-6 backdrop-blur-md bg-black/40 border-b border-white/10">
        <div className="max-w-2xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search algorithm bubbles... (e.g., bubble, binary, koko)"
            className="w-full px-6 py-3 text-lg rounded-full bg-black/50 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-center text-xs text-gray-400 mt-2">
            {filteredAlgorithms.length} / {algorithms.length} algorithms floating
          </p>
        </div>
      </div>

      {/* Bubble cloud */}
      <div className="p-6">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {filteredAlgorithms.map((algo, idx) => {
            // Random size between 90px and 160px
            const size = 90 + (idx % 70);
            // Random animation delay and duration
            const delay = (idx * 0.02) % 2;
            const duration = 4 + (idx % 5);
            const colorClass = getBubbleColor(algo.stepName);
            
            return (
              <div
                key={algo.id}
                onClick={() => onSelectAlgorithm(algo)}
                className={`
                  relative flex items-center justify-center text-center rounded-full 
                  bg-gradient-to-br ${colorClass} 
                  border backdrop-blur-sm cursor-pointer 
                  transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-white/10
                  shadow-md
                `}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  animation: `float ${duration}s infinite ease-in-out`,
                  animationDelay: `${delay}s`,
                }}
              >
                <span className="text-white text-xs md:text-sm font-medium px-2 break-words">
                  {algo.name}
                </span>
                {/* subtle glow on hover */}
                <div className="absolute inset-0 rounded-full bg-white/0 hover:bg-white/5 transition-all pointer-events-none"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
};

export default AlgorithmBubbles;