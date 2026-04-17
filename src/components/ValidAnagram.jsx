import React, { useState, useEffect } from 'react';

const ValidAnagram = () => {
  const pseudocodeLines = [
    "procedure isAnagram(s, t):",
    "  if len(s) != len(t): return false",
    "  count = array of size 26",
    "  for char in s: count[char]++",
    "  for char in t:",
    "    count[char]--",
    "    if count[char] < 0: return false",
    "  return true"
  ];

  const [s, setS] = useState('anagram');
  const [t, setT] = useState('nagaram');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const generateSteps = (s, t) => {
    const steps = [];
    if (s.length !== t.length) {
      steps.push({ s, t, description: `Lengths differ → not anagram`, result: false });
      return steps;
    }
    const count = new Array(26).fill(0);
    steps.push({ s, t, count: [...count], description: "Initialize count array", pseudocodeLine: 1 });

    // Count characters in s
    for (let i = 0; i < s.length; i++) {
      const idx = s.charCodeAt(i) - 97;
      count[idx]++;
      steps.push({
        s, t, count: [...count],
        highlightS: [i],
        description: `s[${i}] = ${s[i]} → count[${s[i]}] = ${count[idx]}`,
        pseudocodeLine: 3
      });
    }

    // Verify with t
    for (let i = 0; i < t.length; i++) {
      const idx = t.charCodeAt(i) - 97;
      count[idx]--;
      steps.push({
        s, t, count: [...count],
        highlightT: [i],
        description: `t[${i}] = ${t[i]} → count[${t[i]}] = ${count[idx]}`,
        pseudocodeLine: 5
      });
      if (count[idx] < 0) {
        steps.push({ s, t, result: false, description: `Negative count → not anagram` });
        return steps;
      }
    }
    steps.push({ s, t, result: true, description: "All counts zero → valid anagram" });
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

  const getHighlightS = (idx) => {
    if (step.highlightS && step.highlightS.includes(idx)) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getHighlightT = (idx) => {
    if (step.highlightT && step.highlightT.includes(idx)) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const countDisplay = step.count ? step.count.map((c, i) => c !== 0 ? `${String.fromCharCode(97+i)}:${c}` : null).filter(Boolean).join(', ') : '';

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Valid Anagram</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: O(n)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: O(1)</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input type="text" value={s} onChange={(e) => setS(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" placeholder="String s" />
        <input type="text" value={t} onChange={(e) => setT(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" placeholder="String t" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          {/* String s display */}
          <div>
            <p className="text-[#9cdcfe] mb-2">String s:</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {step.s?.split('').map((ch, idx) => (
                <div key={`s-${idx}`} className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-2xl ${getHighlightS(idx)} border-2 border-[#222222]`}>
                    {ch}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* String t display */}
          <div>
            <p className="text-[#9cdcfe] mb-2">String t:</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {step.t?.split('').map((ch, idx) => (
                <div key={`t-${idx}`} className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-2xl ${getHighlightT(idx)} border-2 border-[#222222]`}>
                    {ch}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Count array display */}
          {step.count && (
            <div className="bg-[#1e1e1e] p-2 rounded">
              <p className="text-sm text-[#9cdcfe]">Frequency counts: {countDisplay || 'all zero'}</p>
            </div>
          )}

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

export default ValidAnagram;