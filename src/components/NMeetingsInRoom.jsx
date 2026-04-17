import React, { useState, useEffect } from 'react';

const NMeetingsInRoom = () => {
  const pseudocodeLines = [
    "procedure maxMeetings(start, finish):",
    "  sort meetings by finish time",
    "  count = 1, lastFinish = finish[0]",
    "  for i = 1 to n-1:",
    "    if start[i] >= lastFinish:",
    "      count++; lastFinish = finish[i]",
    "  return count"
  ];
  const [meetings, setMeetings] = useState([
    { id: 1, start: 1, finish: 4 },
    { id: 2, start: 3, finish: 5 },
    { id: 3, start: 0, finish: 6 },
    { id: 4, start: 5, finish: 7 },
    { id: 5, start: 8, finish: 9 }
  ]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [input, setInput] = useState('1,4;3,5;0,6;5,7;8,9');

  const updateMeetings = () => {
    const pairs = input.split(';').map(p => p.split(',').map(Number));
    const newActs = pairs.map(([s,f], idx) => ({ id: idx+1, start: s, finish: f }));
    setMeetings(newActs);
  };

  const generateSteps = (acts) => {
    const steps = [];
    const sorted = [...acts].sort((a,b) => a.finish - b.finish);
    let count = 1;
    let lastFinish = sorted[0].finish;
    steps.push({ meetings: sorted.map(a => ({...a})), count, lastFinish: sorted[0].finish, description: "Sort meetings by finish time, select first", pseudocodeLine: 1 });
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].start >= lastFinish) {
        count++;
        lastFinish = sorted[i].finish;
        steps.push({ meetings: sorted.map(a => ({...a})), count, lastFinish, highlight: i, description: `Select meeting ${sorted[i].id} (start ${sorted[i].start})`, pseudocodeLine: 4 });
      } else {
        steps.push({ meetings: sorted.map(a => ({...a})), count, lastFinish, highlight: i, description: `Skip meeting ${sorted[i].id} (start ${sorted[i].start} < lastFinish ${lastFinish})`, pseudocodeLine: 3 });
      }
    }
    steps.push({ count, description: `Maximum meetings = ${count}`, pseudocodeLine: 6 });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(meetings));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [meetings]);

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
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">N Meetings in One Room</h2>
        <div className="flex justify-center gap-4 mb-4"><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(n log n)</span><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(1)</span></div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-80" placeholder="start,finish;..." />
        <button onClick={updateMeetings} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse"><thead><tr><th>ID</th><th>Start</th><th>Finish</th><th>Selected</th></tr></thead>
            <tbody>
              {step.meetings?.map((m, idx) => (
                <tr key={m.id} className={idx === step.highlight ? 'bg-yellow-800' : ''}>
                  <td className="border p-2">{m.id}</td><td className="border p-2">{m.start}</td><td className="border p-2">{m.finish}</td>
                  <td className="border p-2">{m.start >= (idx===0? -Infinity : step.lastFinish) && idx <= step.count ? '✓' : ''}</td>
                </tr>
              ))}
            </tbody></table>
          </div>
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]"><p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p></div>
          {/* progress, speed, buttons (same as above) */}
          <div><div className="flex justify-between text-sm text-gray-400 mb-1"><span>Progress</span><span>{Math.round(((currentStep+1)/steps.length)*100)}%</span></div><div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden"><div className="bg-[#4ec9b0] h-3 rounded-full transition-all" style={{ width: `${((currentStep+1)/steps.length)*100}%` }}></div></div><div className="text-center text-xs text-gray-500 mt-1">Step {currentStep+1} of {steps.length}</div></div>
          <div className="flex items-center justify-center gap-4 bg-[#0d0d0d] p-3 rounded-lg"><span>⏱️ Speed:</span><input type="range" min="300" max="2000" value={speed} onChange={(e) => setSpeed(e.target.value)} className="w-48 md:w-64 accent-[#4ec9b0]" /><span className="bg-[#1a1a1a] px-3 py-1 rounded-full">{speed}ms</span></div>
          <div className="flex justify-center gap-4 flex-wrap">
            <button onClick={() => { setCurrentStep(Math.max(0, currentStep-1)); setIsPlaying(false); }} disabled={currentStep===0} className={`px-6 py-3 rounded-lg font-semibold transition-all ${currentStep===0 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>← Prev</button>
            <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="px-6 py-3 bg-[#c2410c] hover:bg-[#b91c1c] text-white rounded-lg">Reset</button>
            <button onClick={() => setIsPlaying(!isPlaying)} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg font-semibold ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : isPlaying ? 'bg-[#ca5100] hover:bg-[#b74700] text-white' : 'bg-[#2e7d32] hover:bg-[#1e5f20] text-white'}`}>{isPlaying ? '⏸️ Pause' : '▶️ Play'}</button>
            <button onClick={() => { setCurrentStep(Math.min(steps.length-1, currentStep+1)); setIsPlaying(false); }} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg font-semibold ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>Next →</button>
          </div>
        </div>
        <div className="lg:w-1/3 bg-[#0a0a0a] border border-[#222222] rounded-xl p-5 font-mono text-sm shadow-inner">
          <h3 className="text-lg font-bold text-[#569cd6] mb-4">📝 Pseudocode</h3><div className="space-y-1">{pseudocodeLines.map((line, idx) => (<div key={idx} className={`px-3 py-1.5 rounded transition-all duration-200 ${idx === step.pseudocodeLine ? 'bg-[#1a1a1a] text-[#d4d4d4] font-semibold border-l-4 border-[#569cd6]' : 'text-[#9cdcfe] hover:bg-[#1a1a1a]'}`}>{line}</div>))}</div>
        </div>
      </div>
    </div>
  );
};

export default NMeetingsInRoom;