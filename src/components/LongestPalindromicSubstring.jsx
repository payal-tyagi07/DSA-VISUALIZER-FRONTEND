import React, { useState, useEffect } from 'react';

const LongestPalindromicSubstring = () => {
  const pseudocodeLines = [
    "procedure longestPalindrome(s):",
    "  if s.length < 2: return s",
    "  start = 0, maxLen = 1",
    "  for i = 0 to n-1:",
    "    expand(i, i)   // odd length",
    "    expand(i, i+1) // even length",
    "  return s.substring(start, start+maxLen)",
    "",
    "procedure expand(l, r):",
    "  while l>=0 and r<n and s[l]==s[r]:",
    "    if r-l+1 > maxLen: start=l; maxLen=r-l+1",
    "    l--; r++"
  ];
  const [s, setS] = useState('babad');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const generateSteps = (str) => {
    const steps = [];
    const n = str.length;
    if (n < 2) {
      steps.push({ string: str, result: str, description: "Trivial" });
      return steps;
    }
    let start = 0, maxLen = 1;
    steps.push({ string: str, start, maxLen, description: "Start", pseudocodeLine: 1 });

    const expand = (l, r, type) => {
      let left = l, right = r;
      while (left >= 0 && right < n && str[left] === str[right]) {
        steps.push({ string: str, highlight: [left, right], left, right, description: `Expanding around center (${type}): comparing ${str[left]} and ${str[right]}`, pseudocodeLine: 6 });
        if (right - left + 1 > maxLen) {
          start = left;
          maxLen = right - left + 1;
          steps.push({ string: str, start, maxLen, description: `New palindrome: ${str.substring(start, start+maxLen)} (length ${maxLen})`, pseudocodeLine: 7 });
        }
        left--; right++;
      }
    };

    for (let i = 0; i < n; i++) {
      steps.push({ string: str, center: i, description: `Center ${i} (odd)`, pseudocodeLine: 3 });
      expand(i, i, 'odd');
      if (i+1 < n) {
        steps.push({ string: str, center: i, description: `Center between ${i} and ${i+1} (even)`, pseudocodeLine: 4 });
        expand(i, i+1, 'even');
      }
    }
    steps.push({ string: str, result: str.substring(start, start+maxLen), description: `Longest palindrome: "${str.substring(start, start+maxLen)}"` });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(s));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [s]);

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
    if (step.center === idx) return 'border-2 border-[#4ec9b0]';
    return 'bg-blue-500';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Longest Palindromic Substring</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: O(n²)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: O(1)</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <input type="text" value={s} onChange={(e) => setS(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="flex justify-center gap-3 flex-wrap">
            {step.string?.split('').map((ch, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-2xl ${getHighlight(idx)} border-2 border-[#222222]`}>
                  {ch}
                </div>
                {step.left === idx && <span className="text-[#4ec9b0] text-xs">L</span>}
                {step.right === idx && <span className="text-[#ce9178] text-xs">R</span>}
                {step.center === idx && <span className="text-[#4ec9b0] text-xs">C</span>}
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

export default LongestPalindromicSubstring;