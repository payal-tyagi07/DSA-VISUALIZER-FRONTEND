import React, { useState, useEffect } from 'react';

const BubbleSortEnhanced = () => {
  // Pseudocode lines (0-indexed)
  const pseudocodeLines = [
    "procedure bubbleSort(arr):",
    "  n = length(arr)",
    "  for i = 0 to n-1:",
    "    for j = 0 to n-i-2:",
    "      if arr[j] > arr[j+1]:",
    "        swap arr[j] and arr[j+1]",
    "  return arr"
  ];

const steps = [
  // ----- Initial -----
  {
    array: [9, 6, 4, 8, 2, 10, 1],
    comparing: [],
    swapping: [],
    sorted: [],
    description: "Starting array - unsorted",
    pseudocodeLine: 0
  },

  // ----- Pass 1 -----
  {
    array: [9, 6, 4, 8, 2, 10, 1],
    comparing: [0, 1],
    swapping: [],
    sorted: [],
    description: "Pass 1: Compare 9 and 6",
    pseudocodeLine: 4
  },
  {
    array: [6, 9, 4, 8, 2, 10, 1],
    comparing: [],
    swapping: [0, 1],
    sorted: [],
    description: "Swap 9 and 6 → [6, 9, 4, 8, 2, 10, 1]",
    pseudocodeLine: 5
  },
  {
    array: [6, 9, 4, 8, 2, 10, 1],
    comparing: [1, 2],
    swapping: [],
    sorted: [],
    description: "Pass 1: Compare 9 and 4",
    pseudocodeLine: 4
  },
  {
    array: [6, 4, 9, 8, 2, 10, 1],
    comparing: [],
    swapping: [1, 2],
    sorted: [],
    description: "Swap 9 and 4 → [6, 4, 9, 8, 2, 10, 1]",
    pseudocodeLine: 5
  },
  {
    array: [6, 4, 9, 8, 2, 10, 1],
    comparing: [2, 3],
    swapping: [],
    sorted: [],
    description: "Pass 1: Compare 9 and 8",
    pseudocodeLine: 4
  },
  {
    array: [6, 4, 8, 9, 2, 10, 1],
    comparing: [],
    swapping: [2, 3],
    sorted: [],
    description: "Swap 9 and 8 → [6, 4, 8, 9, 2, 10, 1]",
    pseudocodeLine: 5
  },
  {
    array: [6, 4, 8, 9, 2, 10, 1],
    comparing: [3, 4],
    swapping: [],
    sorted: [],
    description: "Pass 1: Compare 9 and 2",
    pseudocodeLine: 4
  },
  {
    array: [6, 4, 8, 2, 9, 10, 1],
    comparing: [],
    swapping: [3, 4],
    sorted: [],
    description: "Swap 9 and 2 → [6, 4, 8, 2, 9, 10, 1]",
    pseudocodeLine: 5
  },
  {
    array: [6, 4, 8, 2, 9, 10, 1],
    comparing: [4, 5],
    swapping: [],
    sorted: [],
    description: "Pass 1: Compare 9 and 10 (no swap)",
    pseudocodeLine: 4
  },
  {
    array: [6, 4, 8, 2, 9, 10, 1],
    comparing: [5, 6],
    swapping: [],
    sorted: [],
    description: "Pass 1: Compare 10 and 1",
    pseudocodeLine: 4
  },
  {
    array: [6, 4, 8, 2, 9, 1, 10],
    comparing: [],
    swapping: [5, 6],
    sorted: [6],
    description: "Swap 10 and 1 → 10 is now sorted (index 6)",
    pseudocodeLine: 5
  },

  // ----- Pass 2 -----
  {
    array: [6, 4, 8, 2, 9, 1, 10],
    comparing: [0, 1],
    swapping: [],
    sorted: [6],
    description: "Pass 2: Compare 6 and 4",
    pseudocodeLine: 4
  },
  {
    array: [4, 6, 8, 2, 9, 1, 10],
    comparing: [],
    swapping: [0, 1],
    sorted: [6],
    description: "Swap 6 and 4 → [4, 6, 8, 2, 9, 1, 10]",
    pseudocodeLine: 5
  },
  {
    array: [4, 6, 8, 2, 9, 1, 10],
    comparing: [1, 2],
    swapping: [],
    sorted: [6],
    description: "Pass 2: Compare 6 and 8 (no swap)",
    pseudocodeLine: 4
  },
  {
    array: [4, 6, 8, 2, 9, 1, 10],
    comparing: [2, 3],
    swapping: [],
    sorted: [6],
    description: "Pass 2: Compare 8 and 2",
    pseudocodeLine: 4
  },
  {
    array: [4, 6, 2, 8, 9, 1, 10],
    comparing: [],
    swapping: [2, 3],
    sorted: [6],
    description: "Swap 8 and 2 → [4, 6, 2, 8, 9, 1, 10]",
    pseudocodeLine: 5
  },
  {
    array: [4, 6, 2, 8, 9, 1, 10],
    comparing: [3, 4],
    swapping: [],
    sorted: [6],
    description: "Pass 2: Compare 8 and 9 (no swap)",
    pseudocodeLine: 4
  },
  {
    array: [4, 6, 2, 8, 9, 1, 10],
    comparing: [4, 5],
    swapping: [],
    sorted: [6],
    description: "Pass 2: Compare 9 and 1",
    pseudocodeLine: 4
  },
  {
    array: [4, 6, 2, 8, 1, 9, 10],
    comparing: [],
    swapping: [4, 5],
    sorted: [5, 6],
    description: "Swap 9 and 1 → 9 is now sorted (index 5)",
    pseudocodeLine: 5
  },

  // ----- Pass 3 -----
  {
    array: [4, 6, 2, 8, 1, 9, 10],
    comparing: [0, 1],
    swapping: [],
    sorted: [5, 6],
    description: "Pass 3: Compare 4 and 6 (no swap)",
    pseudocodeLine: 4
  },
  {
    array: [4, 6, 2, 8, 1, 9, 10],
    comparing: [1, 2],
    swapping: [],
    sorted: [5, 6],
    description: "Pass 3: Compare 6 and 2",
    pseudocodeLine: 4
  },
  {
    array: [4, 2, 6, 8, 1, 9, 10],
    comparing: [],
    swapping: [1, 2],
    sorted: [5, 6],
    description: "Swap 6 and 2 → [4, 2, 6, 8, 1, 9, 10]",
    pseudocodeLine: 5
  },
  {
    array: [4, 2, 6, 8, 1, 9, 10],
    comparing: [2, 3],
    swapping: [],
    sorted: [5, 6],
    description: "Pass 3: Compare 6 and 8 (no swap)",
    pseudocodeLine: 4
  },
  {
    array: [4, 2, 6, 8, 1, 9, 10],
    comparing: [3, 4],
    swapping: [],
    sorted: [5, 6],
    description: "Pass 3: Compare 8 and 1",
    pseudocodeLine: 4
  },
  {
    array: [4, 2, 6, 1, 8, 9, 10],
    comparing: [],
    swapping: [3, 4],
    sorted: [4, 5, 6],
    description: "Swap 8 and 1 → 8 is now sorted (index 4)",
    pseudocodeLine: 5
  },

  // ----- Pass 4 -----
  {
    array: [4, 2, 6, 1, 8, 9, 10],
    comparing: [0, 1],
    swapping: [],
    sorted: [4, 5, 6],
    description: "Pass 4: Compare 4 and 2",
    pseudocodeLine: 4
  },
  {
    array: [2, 4, 6, 1, 8, 9, 10],
    comparing: [],
    swapping: [0, 1],
    sorted: [4, 5, 6],
    description: "Swap 4 and 2 → [2, 4, 6, 1, 8, 9, 10]",
    pseudocodeLine: 5
  },
  {
    array: [2, 4, 6, 1, 8, 9, 10],
    comparing: [1, 2],
    swapping: [],
    sorted: [4, 5, 6],
    description: "Pass 4: Compare 4 and 6 (no swap)",
    pseudocodeLine: 4
  },
  {
    array: [2, 4, 6, 1, 8, 9, 10],
    comparing: [2, 3],
    swapping: [],
    sorted: [4, 5, 6],
    description: "Pass 4: Compare 6 and 1",
    pseudocodeLine: 4
  },
  {
    array: [2, 4, 1, 6, 8, 9, 10],
    comparing: [],
    swapping: [2, 3],
    sorted: [3, 4, 5, 6],
    description: "Swap 6 and 1 → 6 is now sorted (index 3)",
    pseudocodeLine: 5
  },

  // ----- Pass 5 -----
  {
    array: [2, 4, 1, 6, 8, 9, 10],
    comparing: [0, 1],
    swapping: [],
    sorted: [3, 4, 5, 6],
    description: "Pass 5: Compare 2 and 4 (no swap)",
    pseudocodeLine: 4
  },
  {
    array: [2, 4, 1, 6, 8, 9, 10],
    comparing: [1, 2],
    swapping: [],
    sorted: [3, 4, 5, 6],
    description: "Pass 5: Compare 4 and 1",
    pseudocodeLine: 4
  },
  {
    array: [2, 1, 4, 6, 8, 9, 10],
    comparing: [],
    swapping: [1, 2],
    sorted: [2, 3, 4, 5, 6],
    description: "Swap 4 and 1 → 4 is now sorted (index 2)",
    pseudocodeLine: 5
  },

  // ----- Pass 6 -----
  {
    array: [2, 1, 4, 6, 8, 9, 10],
    comparing: [0, 1],
    swapping: [],
    sorted: [2, 3, 4, 5, 6],
    description: "Pass 6: Compare 2 and 1",
    pseudocodeLine: 4
  },
  {
    array: [1, 2, 4, 6, 8, 9, 10],
    comparing: [],
    swapping: [0, 1],
    sorted: [0, 1, 2, 3, 4, 5, 6],
    description: "Swap 2 and 1 → array fully sorted!",
    pseudocodeLine: 5
  },

  // ----- Final -----
  {
    array: [1, 2, 4, 6, 8, 9, 10],
    comparing: [],
    swapping: [],
    sorted: [0, 1, 2, 3, 4, 5, 6],
    description: "Bubble sort complete! 🎉",
    pseudocodeLine: 6
  }
];

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const getBgColor = (index) => {
    if (steps[currentStep].comparing?.includes(index)) return 'bg-yellow-500';
    if (steps[currentStep].swapping?.includes(index)) return 'bg-orange-500';
    if (steps[currentStep].sorted?.includes(index)) return 'bg-green-600';
    return 'bg-blue-500';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl transition-all duration-300 font-mono border border-[#222222]">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Bubble Sort Visualization</h2>
        <p className="text-[#9cdcfe]">
          Initial: <span className="text-[#ce9178]">[9, 6, 4, 8, 2, 10, 1]</span>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="flex justify-center gap-3 flex-wrap">
            {steps[currentStep].array.map((num, idx) => (
              <div
                key={idx}
                className={`w-16 h-16 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl border-2 border-[#222222] ${getBgColor(idx)}`}
              >
                {num}
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-6 flex-wrap text-sm">
            <div className="flex items-center gap-2"><span className="w-4 h-4 bg-blue-500 rounded-full"></span><span className="text-gray-300">Unsorted</span></div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 bg-yellow-500 rounded-full"></span><span className="text-gray-300">Comparing</span></div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 bg-orange-500 rounded-full"></span><span className="text-gray-300">Swapping</span></div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 bg-green-600 rounded-full"></span><span className="text-gray-300">Sorted</span></div>
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
            <p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep + 1}:</span> {steps[currentStep].description}</p>
          </div>

          <div>
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Progress</span><span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden">
              <div className="bg-[#4ec9b0] h-3 rounded-full transition-all duration-300" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}></div>
            </div>
            <div className="text-center text-xs text-gray-500 mt-1">Step {currentStep + 1} of {steps.length}</div>
          </div>

          <div className="flex items-center justify-center gap-4 bg-[#0d0d0d] p-3 rounded-lg">
            <span className="text-gray-300 font-medium">⏱️ Speed:</span>
            <input type="range" min="300" max="2000" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-48 md:w-64 accent-[#4ec9b0]" />
            <span className="text-gray-300 bg-[#1a1a1a] px-3 py-1 rounded-full shadow-sm">{speed}ms</span>
          </div>

          <div className="flex justify-center gap-4 flex-wrap">
            <button onClick={() => { setCurrentStep(Math.max(0, currentStep-1)); setIsPlaying(false); }} disabled={currentStep === 0} className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 ${currentStep === 0 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>← Previous</button>
            <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="px-6 py-3 bg-[#c2410c] hover:bg-[#b91c1c] text-white rounded-lg font-semibold hover:scale-105 active:scale-95 transition-all">Reset</button>
            <button onClick={() => setIsPlaying(!isPlaying)} disabled={currentStep === steps.length - 1} className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 ${currentStep === steps.length - 1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : isPlaying ? 'bg-[#ca5100] hover:bg-[#b74700] text-white' : 'bg-[#2e7d32] hover:bg-[#1e5f20] text-white'}`}>{isPlaying ? '⏸️ Pause' : '▶️ Play'}</button>
            <button onClick={() => { setCurrentStep(Math.min(steps.length - 1, currentStep + 1)); setIsPlaying(false); }} disabled={currentStep === steps.length - 1} className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 ${currentStep === steps.length - 1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>Next →</button>
          </div>

          <div className="text-center">
            <div className="inline-block bg-[#0a0a0a] border border-[#222222] text-[#ce9178] font-mono px-4 py-2 rounded-lg shadow-md">
              Current: [{steps[currentStep].array.join(', ')}]
            </div>
          </div>
        </div>

        <div className="lg:w-1/3 bg-[#0a0a0a] border border-[#222222] rounded-xl p-5 font-mono text-sm shadow-inner">
          <h3 className="text-lg font-bold text-[#569cd6] mb-4 flex items-center gap-2"><span>📝</span> Pseudocode</h3>
          <div className="space-y-1 overflow-x-auto">
            {pseudocodeLines.map((line, idx) => (
              <div key={idx} className={`px-3 py-1.5 rounded transition-all duration-200 ${idx === steps[currentStep].pseudocodeLine ? 'bg-[#1a1a1a] text-[#d4d4d4] font-semibold border-l-4 border-[#569cd6]' : 'text-[#9cdcfe] hover:bg-[#1a1a1a]'}`}>{line}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BubbleSortEnhanced;
