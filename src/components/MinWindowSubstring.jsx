import React, { useState, useEffect } from 'react';

const MinWindowSubstring = () => {
  const pseudocodeLines = [
    "procedure minWindow(s, t):",
    "  need = count of chars in t",
    "  have = 0, left = 0, minLen = infinity",
    "  for right in range(len(s)):",
    "    if s[right] in need: need[s[right]]--; if need[s[right]]>=0: have++",
    "    while have == len(need):",
    "      update minLen",
    "      if s[left] in need: need[s[left]]++; if need[s[left]]>0: have--",
    "      left++",
    "  return s[minStart:minStart+minLen]"
  ];
  const [s, setS] = useState('ADOBECODEBANC');
  const [t, setT] = useState('ABC');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const generateSteps = (s, t) => {
    const steps = [];
    const need = new Map();
    for (let ch of t) need.set(ch, (need.get(ch)||0)+1);
    let have = 0, left = 0, minLen = Infinity, minStart = 0;
    const windowCount = new Map();
    steps.push({ s, t, need: Array.from(need.entries()), left, right: null, description: "Start", pseudocodeLine: 1 });
    for (let right = 0; right < s.length; right++) {
      const ch = s[right];
      if (need.has(ch)) {
        windowCount.set(ch, (windowCount.get(ch)||0)+1);
        if (windowCount.get(ch) === need.get(ch)) have++;
        steps.push({ s, left, right, highlight: [right], description: `Added ${ch}, have=${have}`, pseudocodeLine: 3 });
      } else {
        steps.push({ s, left, right, highlight: [right], description: `Skip ${ch}`, pseudocodeLine: 2 });
      }
      while (have === need.size) {
        const len = right - left + 1;
        if (len < minLen) {
          minLen = len;
          minStart = left;
          steps.push({ s, left, right, description: `New window: ${s.substring(left, right+1)} (len=${len})`, pseudocodeLine: 4 });
        }
        const leftChar = s[left];
        if (need.has(leftChar)) {
          windowCount.set(leftChar, windowCount.get(leftChar)-1);
          if (windowCount.get(leftChar) < need.get(leftChar)) have--;
          steps.push({ s, left, right, highlight: [left], description: `Remove ${leftChar}, have=${have}`, pseudocodeLine: 5 });
        }
        left++;
        steps.push({ s, left, right, description: `Move left to ${left}`, pseudocodeLine: 6 });
      }
    }
    const result = minLen === Infinity ? "" : s.substring(minStart, minStart+minLen);
    steps.push({ s, result, description: `Minimum window: "${result}"` });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(s, t));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [s, t]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  const getHighlight = (idx) => {
    if (step.highlight && step.highlight.includes(idx)) return 'bg-yellow-500';
    if (step.left !== undefined && idx >= step.left && idx <= step.right) return 'bg-green-600';
    return 'bg-blue-500';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Minimum Window Substring</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: O(|s|+|t|)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: O(|t|)</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input type="text" value={s} onChange={(e) => setS(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" placeholder="String s" />
        <input type="text" value={t} onChange={(e) => setT(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" placeholder="String t" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="flex justify-center gap-3 flex-wrap">
            {step.s?.split('').map((ch, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-2xl ${getHighlight(idx)} border-2 border-[#222222]`}>
                  {ch}
                </div>
                {step.left === idx && <span className="text-[#4ec9b0] text-xs">L</span>}
                {step.right === idx && <span className="text-[#ce9178] text-xs">R</span>}
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

export default MinWindowSubstring;