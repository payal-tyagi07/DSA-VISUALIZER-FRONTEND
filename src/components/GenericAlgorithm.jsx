import React, { useState, useEffect } from 'react';

const GenericAlgorithm = () => {
  // ---------- 1. Pseudocode ----------
  const pseudocodeLines = [
    "procedure algorithmName(input):",
    "  // step 1",
    "  // step 2",
    "  // ...",
    "  return result"
  ];

  // ---------- 2. Input state ----------
  const [inputValue, setInputValue] = useState('initial value');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  // ---------- 3. Step generation ----------
  const generateSteps = (input) => {
    const steps = [];
    // Simulate algorithm step‑by‑step, pushing objects:
    // { description: "...", pseudocodeLine: x, highlightIndices: [], result: null }
    // ...
    return steps;
  };

  // ---------- 4. Effects ----------
  useEffect(() => {
    const newSteps = generateSteps(inputValue);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [inputValue]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  // ---------- 5. Helpers for styling ----------
  const getHighlightClass = (index) => {
    const step = steps[currentStep];
    if (!step) return '';
    if (step.result === index) return 'bg-green-600';
    if (step.highlightIndices?.includes(index)) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  // ---------- 6. Render UI ----------
  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      {/* Title & complexity badges */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Algorithm Name</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: O(?)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: O(?)</span>
        </div>
      </div>

      {/* Input controls */}
      <div className="flex justify-center gap-4 mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 focus:border-[#569cd6]"
        />
      </div>

      {/* Visualization area (custom per algorithm) */}
      <div className="flex justify-center gap-3 flex-wrap mb-6">
        {/* Example: show characters or nodes */}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 flex-wrap text-sm">
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-blue-500 rounded-full"></span>Not visited</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-yellow-500 rounded-full"></span>Current operation</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-green-600 rounded-full"></span>Result</div>
      </div>

      {/* Description */}
      <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6] mb-4">
        <p className="text-gray-300">
          <span className="font-bold text-[#9cdcfe]">Step {currentStep + 1}:</span> {steps[currentStep]?.description}
        </p>
      </div>

      {/* Progress, speed, buttons (same as binary search) */}
      {/* ... copy the progress bar, speed slider, Prev/Reset/Play/Next buttons from any existing component ... */}

      {/* Pseudocode panel */}
      <div className="mt-6 bg-[#0a0a0a] border border-[#222222] rounded-xl p-5 font-mono text-sm shadow-inner">
        <h3 className="text-lg font-bold text-[#569cd6] mb-4">📝 Pseudocode</h3>
        <div className="space-y-1">
          {pseudocodeLines.map((line, idx) => (
            <div key={idx} className={`px-3 py-1.5 rounded transition-all duration-200 ${idx === steps[currentStep]?.pseudocodeLine ? 'bg-[#1a1a1a] text-[#d4d4d4] font-semibold border-l-4 border-[#569cd6]' : 'text-[#9cdcfe] hover:bg-[#1a1a1a]'}`}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenericAlgorithm;