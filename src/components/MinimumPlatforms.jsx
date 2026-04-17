import React, { useState, useEffect } from 'react';

const MinimumPlatforms = () => {
  const pseudocodeLines = [
    "procedure minPlatforms(arr, dep):",
    "  sort arr and dep",
    "  i = 1, j = 0, platforms = 1, result = 1",
    "  while i < n and j < n:",
    "    if arr[i] <= dep[j]:",
    "      platforms++; i++",
    "    else:",
    "      platforms--; j++",
    "    result = max(result, platforms)",
    "  return result"
  ];
  const [trains, setTrains] = useState([
    { arr: 900, dep: 910 },
    { arr: 940, dep: 1200 },
    { arr: 950, dep: 1120 },
    { arr: 1100, dep: 1130 },
    { arr: 1500, dep: 1900 },
    { arr: 1800, dep: 2000 }
  ]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [input, setInput] = useState('900,910;940,1200;950,1120;1100,1130;1500,1900;1800,2000');

  const updateTrains = () => {
    const pairs = input.split(';').map(p => p.split(',').map(Number));
    setTrains(pairs.map(([a,d]) => ({ arr: a, dep: d })));
  };

  const generateSteps = (trains) => {
    const steps = [];
    const arrivals = trains.map(t => t.arr).sort((a,b)=>a-b);
    const departures = trains.map(t => t.dep).sort((a,b)=>a-b);
    steps.push({ arrivals, departures, platforms: 1, result: 1, description: "Sort arrivals and departures", pseudocodeLine: 1 });
    let i = 1, j = 0, platforms = 1, result = 1;
    while (i < arrivals.length && j < departures.length) {
      if (arrivals[i] <= departures[j]) {
        platforms++;
        i++;
        steps.push({ arrivals, departures, platforms, result, description: `Train arrives at ${arrivals[i-1]}, platforms needed = ${platforms}`, pseudocodeLine: 3 });
      } else {
        platforms--;
        j++;
        steps.push({ arrivals, departures, platforms, result, description: `Train departs at ${departures[j-1]}, platforms needed = ${platforms}`, pseudocodeLine: 4 });
      }
      result = Math.max(result, platforms);
      steps.push({ arrivals, departures, platforms, result, description: `Current max platforms = ${result}`, pseudocodeLine: 5 });
    }
    steps.push({ result, description: `Minimum platforms required = ${result}`, pseudocodeLine: 6 });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(trains));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [trains]);

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
      <div className="text-center mb-6"><h2 className="text-3xl font-bold text-[#569cd6] mb-2">Minimum Platforms</h2><div className="flex justify-center gap-4 mb-4"><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(n log n)</span><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(1)</span></div></div>
      <div className="flex flex-wrap justify-center gap-4 mb-6"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-80" placeholder="arr,dep;..." /><button onClick={updateTrains} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button></div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="overflow-x-auto"><table className="w-full border-collapse"><thead><tr><th>Arrival</th><th>Departure</th></tr></thead><tbody>{step.arrivals?.map((a,i) => (<tr key={i}><td className="border p-2">{a}</td><td className="border p-2">{step.departures?.[i]}</td></tr>))}</tbody></table></div>
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]"><p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p></div>
          {/* Progress, speed, buttons (same pattern) */}
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

export default MinimumPlatforms;