import React, { useState, useEffect } from 'react';

const MergeOverlapping = () => {
  const pseudocodeLines = [
    "procedure mergeIntervals(intervals):",
    "  sort intervals by start",
    "  merged = []",
    "  for interval in intervals:",
    "    if not merged or interval.start > merged[-1].end:",
    "      merged.append(interval)",
    "    else:",
    "      merged[-1].end = max(merged[-1].end, interval.end)",
    "  return merged"
  ];

  const defaultIntervals = [[1,3],[2,6],[8,10],[15,18]];
  const [intervals, setIntervals] = useState(defaultIntervals);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [inputStr, setInputStr] = useState('1,3,2,6,8,10,15,18');

  const updateIntervals = () => {
    const nums = inputStr.split(',').map(Number).filter(n => !isNaN(n));
    const newIntervals = [];
    for (let i = 0; i < nums.length; i += 2) {
      if (i+1 < nums.length) newIntervals.push([nums[i], nums[i+1]]);
    }
    setIntervals(newIntervals);
  };

  const generateSteps = (intervals) => {
    const steps = [];
    const sorted = [...intervals].sort((a,b) => a[0]-b[0]);
    const merged = [];
    steps.push({ intervals: sorted, description: "Sort intervals by start", pseudocodeLine: 1 });

    for (let i = 0; i < sorted.length; i++) {
      if (merged.length === 0 || sorted[i][0] > merged[merged.length-1][1]) {
        merged.push([...sorted[i]]);
        steps.push({ intervals: [...merged], highlight: [i], description: `Add interval [${sorted[i][0]},${sorted[i][1]}]`, pseudocodeLine: 3 });
      } else {
        const prev = merged[merged.length-1];
        const newEnd = Math.max(prev[1], sorted[i][1]);
        merged[merged.length-1] = [prev[0], newEnd];
        steps.push({ intervals: [...merged], highlight: [i], description: `Merge [${prev[0]},${prev[1]}] with [${sorted[i][0]},${sorted[i][1]}] → [${prev[0]},${newEnd}]`, pseudocodeLine: 4 });
      }
    }
    steps.push({ intervals: merged, description: `Merged intervals: ${JSON.stringify(merged)}` });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(intervals));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [intervals]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  const getHighlightClass = (idx) => {
    if (step.highlight && step.highlight.includes(idx)) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Merge Overlapping Intervals</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: O(n log n)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: O(n)</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <input type="text" value={inputStr} onChange={(e) => setInputStr(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 focus:border-[#569cd6]" />
        <button onClick={updateIntervals} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="flex flex-col gap-2">
            {step.intervals?.map((interval, idx) => (
              <div key={idx} className={`p-2 rounded ${getHighlightClass(idx)}`}>
                [{interval[0]}, {interval[1]}]
              </div>
            ))}
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
            <p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>
          </div>

          <div>
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Progress</span><span>{Math.round(((currentStep+1)/steps.length)*100)}%</span>
            </div>
            <div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden">
              <div className="bg-[#4ec9b0] h-3 rounded-full transition-all" style={{ width: `${((currentStep+1)/steps.length)*100}%` }}></div>
            </div>
            <div className="text-center text-xs text-gray-500 mt-1">Step {currentStep+1} of {steps.length}</div>
          </div>

          <div className="flex items-center justify-center gap-4 bg-[#0d0d0d] p-3 rounded-lg">
            <span>⏱️ Speed:</span>
            <input type="range" min="300" max="2000" value={speed} onChange={(e) => setSpeed(e.target.value)} className="w-48 md:w-64 accent-[#4ec9b0]" />
            <span className="bg-[#1a1a1a] px-3 py-1 rounded-full">{speed}ms</span>
          </div>

          <div className="flex justify-center gap-4 flex-wrap">
            <button onClick={() => { setCurrentStep(Math.max(0, currentStep-1)); setIsPlaying(false); }} disabled={currentStep===0} className={`px-6 py-3 rounded-lg font-semibold transition-all ${currentStep===0 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>← Prev</button>
            <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="px-6 py-3 bg-[#c2410c] hover:bg-[#b91c1c] text-white rounded-lg">Reset</button>
            <button onClick={() => setIsPlaying(!isPlaying)} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg font-semibold ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : isPlaying ? 'bg-[#ca5100] hover:bg-[#b74700] text-white' : 'bg-[#2e7d32] hover:bg-[#1e5f20] text-white'}`}>{isPlaying ? '⏸️ Pause' : '▶️ Play'}</button>
            <button onClick={() => { setCurrentStep(Math.min(steps.length-1, currentStep+1)); setIsPlaying(false); }} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg font-semibold ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>Next →</button>
          </div>
        </div>

        <div className="lg:w-1/3 bg-[#0a0a0a] border border-[#222222] rounded-xl p-5 font-mono text-sm shadow-inner">
          <h3 className="text-lg font-bold text-[#569cd6] mb-4">📝 Pseudocode</h3>
          <div className="space-y-1">
            {pseudocodeLines.map((line, idx) => (
              <div key={idx} className={`px-3 py-1.5 rounded transition-all duration-200 ${idx === step.pseudocodeLine ? 'bg-[#1a1a1a] text-[#d4d4d4] font-semibold border-l-4 border-[#569cd6]' : 'text-[#9cdcfe] hover:bg-[#1a1a1a]'}`}>{line}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MergeOverlapping;