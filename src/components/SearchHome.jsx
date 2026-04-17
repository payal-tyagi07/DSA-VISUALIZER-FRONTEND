// src/components/SearchHome.jsx
import React, { useState } from 'react';
import SearchBarWithSuggestions from './SearchBarWithSuggestions';

const SearchHome = ({ onSelectAlgorithm }) => {
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = {
    'Sorting': ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Insertion Sort', 'Selection Sort'],
    'Searching': ['Binary Search', 'Lower Bound', 'Upper Bound', 'Search in Rotated Sorted Array'],
    'Arrays': ['Kadane\'s Algorithm', 'Two Sum', 'Container With Most Water', 'Trapping Rain Water'],
    'Dynamic Programming': ['Climbing Stairs', 'House Robber', 'Coin Change', 'Longest Common Subsequence'],
    'Graphs': ['BFS', 'DFS', 'Dijkstra\'s Algorithm', 'Topological Sort'],
    'Binary Search': ['Koko Eating Bananas', 'Aggressive Cows', 'Book Allocation', 'Ship Capacity']
  };

  const handleSuggestion = (algoName) => {
    onSelectAlgorithm({ name: algoName, id: algoName.toLowerCase().replace(/ /g, '-') });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="mb-6">
        <LogoIcon />
      </div>
      <h1 className="text-4xl font-bold text-[#569cd6] dark:text-[#9cdcfe] mb-2">AlgoScape</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Visualize algorithms, understand deeply.</p>

      <SearchBarWithSuggestions
        onSelectAlgorithm={onSelectAlgorithm}
        placeholder="Search any algorithm... (try 'bin' for Binary Search, 'koko' for Koko)"
        compact={false}
      />

      <p className="text-xs text-gray-500 mt-3">
        💡 Sub‑word search: "bin" → Binary Search, "koko" → Koko Eating Bananas, "aggr" → Aggressive Cows
      </p>

      {/* Category filters */}
      <div className="w-full max-w-3xl mt-8">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {Object.keys(categories).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-3 py-1 text-sm rounded-full transition ${
                activeCategory === cat
                  ? 'bg-[#569cd6] text-white'
                  : 'bg-[#2d2d2d] hover:bg-[#3c3c3c] text-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {activeCategory && (
          <div className="bg-[#1e1e1e] rounded-xl p-4 border border-[#3c3c3c]">
            <h3 className="text-[#9cdcfe] font-medium mb-3 text-left">{activeCategory}</h3>
            <div className="flex flex-wrap gap-2">
              {categories[activeCategory].map(algo => (
                <button
                  key={algo}
                  onClick={() => handleSuggestion(algo)}
                  className="px-3 py-1.5 text-sm bg-[#2d2d2d] hover:bg-[#569cd6] rounded-lg text-gray-300 hover:text-white transition"
                >
                  {algo}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Popular quick links */}
      <div className="flex flex-wrap justify-center gap-2 mt-6">
        {['Binary Search', 'Bubble Sort', 'Kadane', 'DFS', 'Dijkstra', 'Coin Change'].map(s => (
          <button
            key={s}
            onClick={() => handleSuggestion(s)}
            className="px-3 py-1 text-sm bg-[#2d2d2d] hover:bg-[#3c3c3c] rounded-full text-gray-300 transition"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};

const LogoIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="16" fill="#0e639c" />
    <path d="M20 32L28 24L20 16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M44 32L36 24L44 16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M28 44L36 36L28 28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="32" cy="32" r="2" fill="white"/>
    <path d="M48 44L52 40L48 36" stroke="#9cdcfe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M16 44L12 40L16 36" stroke="#9cdcfe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

export default SearchHome;