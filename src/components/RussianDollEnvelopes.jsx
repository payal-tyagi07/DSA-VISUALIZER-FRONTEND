import React, { useState, useEffect } from 'react';
import DPArrayVisualizer from './DPArrayVisualizer';

const RussianDollEnvelopes = () => {
  const pseudocodeLines = [
    "procedure maxEnvelopes(envelopes):",
    "  sort envelopes by width asc, height desc",
    "  heights = [h for (w,h) in envelopes]",
    "  return lengthOfLIS(heights)"
  ];
  const [envelopes, setEnvelopes] = useState([[5,4],[6,4],[6,7],[2,3]]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [input, setInput] = useState('5,4;6,4;6,7;2,3');

  const updateEnvelopes = () => {
    const pairs = input.split(';').map(p => p.split(',').map(Number));
    setEnvelopes(pairs);
  };

  const generateSteps = (env) => {
    const steps = [];
    const sorted = [...env].sort((a,b) => a[0] === b[0] ? b[1] - a[1] : a[0] - b[0]);
    steps.push({ envelopes: sorted.map(e => `(${e[0]},${e[1]})`), description: "Sort by width asc, height desc", pseudocodeLine: 1 });
    const heights = sorted.map(e => e[1]);
    const n = heights.length;
    const dp = new Array(n).fill(1);
    steps.push({ heights, dp: [...dp], description: "Initialize LIS dp array", pseudocodeLine: 2 });
    for (let i = 1; i < n; i++) {
      for (let j = 0; j < i; j++) {
        if (heights[j] < heights[i] && dp[j] + 1 > dp[i]) {
          dp[i] = dp[j] + 1;
          steps.push({ heights, dp: [...dp], current: i, j, description: `dp[${i}] = max(dp[${i}], dp[${j}]+1) = ${dp[i]}`, pseudocodeLine: 3 });
        }
      }
    }
    const result = Math.max(...dp);
    steps.push({ dp: [...dp], result, description: `Maximum envelopes = ${result}` });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(envelopes));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [envelopes]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6"><h2 className="text-3xl font-bold text-[#569cd6] mb-2">Russian Doll Envelopes</h2><div className="flex justify-center gap-4 mb-4"><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(n log n)</span><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(n)</span></div></div>
      <div className="flex flex-wrap justify-center gap-4 mb-6"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-80" placeholder="w,h;w,h;..." /><button onClick={updateEnvelopes} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button></div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-[#1e1e1e] p-3 rounded"><p className="text-[#9cdcfe]">Sorted envelopes</p><div className="flex gap-2 flex-wrap">{step.envelopes?.map((e,i) => <div key={i} className="bg-blue-800 px-3 py-1 rounded">{e}</div>)}</div></div>
          <div className="bg-[#1e1e1e] p-3 rounded"><p className="text-[#9cdcfe]">Heights array</p><DPArrayVisualizer array={step.heights} labels={Array.from({length: step.heights?.length}, (_,i)=>i)} /></div>
          <DPArrayVisualizer array={step.dp} labels={Array.from({length: step.dp?.length}, (_,i)=>i)} highlight={{ current: step.current }} />
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]"><p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>{step.result !== undefined && <p className="text-[#4ec9b0] mt-2">Result = {step.result}</p>}</div>
          {/* progress, speed, buttons (standard) */}
          <div><div className="flex justify-between text-sm text-gray-400 mb-1"><span>Progress</span><span>{Math.round(((currentStep+1)/steps.length)*100)}%</span></div><div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden"><div className="bg-[#4ec9b0] h-3 rounded-full transition-all" style={{ width: `${((currentStep+1)/steps.length)*100}%` }}></div></div><div className="text-center text-xs text-gray-500 mt-1">Step {currentStep+1} of {steps.length}</div></div>
          <div className="flex items-center justify-center gap-4 bg-[#0d0d0d] p-3 rounded-lg"><span>⏱️ Speed:</span><input type="range" min="300" max="2000" value={speed} onChange={(e) => setSpeed(e.target.value)} className="w-48 md:w-64 accent-[#4ec9b0]" /><span className="bg-[#1a1a1a] px-3 py-1 rounded-full">{speed}ms</span></div>
          <div className="flex justify-center gap-4 flex-wrap">
            <button onClick={() => { setCurrentStep(Math.max(0, currentStep-1)); setIsPlaying(false); }} disabled={currentStep===0} className={`px-6 py-3 rounded-lg font-semibold transition-all ${currentStep===0 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>← Prev</button>
            <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="px-6 py-3 bg-[#c2410c] hover:bg-[#b91c1c] text-white rounded-lg">Reset</button>
            <button onClick={() => setIsPlaying(!isPlaying)} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg font-semibold ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : isPlaying ? 'bg-[#ca5100] hover:bg-[#b74700] text-white' : 'bg-[#2e7d32] hover:bg-[#1e5f20] text-white'}`}>{isPlaying ? '⏸️ Pause' : '▶️ Play'}</button>
            <button onClick={() => { setCurrentStep(Math.min(steps.length-1, currentStep+1)); setIsPlaying(false); }} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg font-semibold ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>Next →</button>
          </div>
        </div>
        <div className="lg:w-1/3 bg-[#0a0a0a] border border-[#222222] rounded-xl p-5 font-mono text-sm shadow-inner"><h3 className="text-lg font-bold text-[#569cd6] mb-4">📝 Pseudocode</h3><div className="space-y-1">{pseudocodeLines.map((line, idx) => (<div key={idx} className={`px-3 py-1.5 rounded transition-all duration-200 ${idx === step.pseudocodeLine ? 'bg-[#1a1a1a] text-[#d4d4d4] font-semibold border-l-4 border-[#569cd6]' : 'text-[#9cdcfe] hover:bg-[#1a1a1a]'}`}>{line}</div>))}</div></div>
      </div>
    </div>
  );
};

export default RussianDollEnvelopes;