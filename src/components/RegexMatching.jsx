import React, { useState, useEffect } from 'react';

const RegexMatching = () => {
  const pseudocodeLines = [
    "procedure isMatch(s, p):",
    "  if not p: return not s",
    "  first_match = bool(s) and (p[0]=='.' or p[0]==s[0])",
    "  if len(p)>=2 and p[1]=='*':",
    "    return (isMatch(s, p[2:]) or (first_match and isMatch(s[1:], p)))",
    "  else:",
    "    return first_match and isMatch(s[1:], p[1:])"
  ];

  const [s, setS] = useState('aa');
  const [p, setP] = useState('a*');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const generateSteps = (s, p) => {
    const steps = [];
    // We'll simulate recursion using a stack and record each call
    const callStack = [];
    const resultStack = [];

    const helper = (i, j, depth) => {
      const indent = '  '.repeat(depth);
      const callDesc = `isMatch("${s.slice(i)}", "${p.slice(j)}")`;
      steps.push({
        s, p,
        i, j,
        depth,
        description: `${indent}Call: ${callDesc}`,
        type: 'call',
        pseudocodeLine: 0
      });

      if (j === p.length) {
        const res = i === s.length;
        steps.push({
          s, p,
          i, j,
          depth,
          description: `${indent}Base: pattern empty → ${res ? 'match' : 'no match'}`,
          type: 'return',
          result: res,
          pseudocodeLine: 1
        });
        return res;
      }

      const firstMatch = i < s.length && (p[j] === '.' || p[j] === s[i]);
      steps.push({
        s, p,
        i, j,
        depth,
        description: `${indent}first_match = ${firstMatch} (${i < s.length ? `s[${i}]='${s[i]}'` : 'end'} vs p[${j}]='${p[j]}')`,
        type: 'first_match',
        pseudocodeLine: 2
      });

      if (j + 1 < p.length && p[j + 1] === '*') {
        // star case
        steps.push({
          s, p,
          i, j,
          depth,
          description: `${indent}Star pattern: try skipping '*'`,
          type: 'star_skip',
          pseudocodeLine: 3
        });
        const skipResult = helper(i, j + 2, depth + 1);
        steps.push({
          s, p,
          i, j,
          depth,
          description: `${indent}Skip result = ${skipResult}`,
          type: 'star_result',
          pseudocodeLine: 3
        });
        if (skipResult) {
          steps.push({
            s, p,
            i, j,
            depth,
            description: `${indent}Return true (skip succeeded)`,
            type: 'return',
            result: true,
            pseudocodeLine: 3
          });
          return true;
        }
        if (firstMatch) {
          steps.push({
            s, p,
            i, j,
            depth,
            description: `${indent}Star: try using one character and keep star`,
            type: 'star_use',
            pseudocodeLine: 3
          });
          const useResult = helper(i + 1, j, depth + 1);
          steps.push({
            s, p,
            i, j,
            depth,
            description: `${indent}Use result = ${useResult}`,
            type: 'star_result',
            pseudocodeLine: 3
          });
          steps.push({
            s, p,
            i, j,
            depth,
            description: `${indent}Return ${useResult}`,
            type: 'return',
            result: useResult,
            pseudocodeLine: 3
          });
          return useResult;
        } else {
          steps.push({
            s, p,
            i, j,
            depth,
            description: `${indent}No first_match, skip fails → return false`,
            type: 'return',
            result: false,
            pseudocodeLine: 3
          });
          return false;
        }
      } else {
        // normal case
        if (firstMatch) {
          steps.push({
            s, p,
            i, j,
            depth,
            description: `${indent}Normal: match, advance both`,
            type: 'normal_advance',
            pseudocodeLine: 5
          });
          const res = helper(i + 1, j + 1, depth + 1);
          steps.push({
            s, p,
            i, j,
            depth,
            description: `${indent}Normal result = ${res}`,
            type: 'return',
            result: res,
            pseudocodeLine: 5
          });
          return res;
        } else {
          steps.push({
            s, p,
            i, j,
            depth,
            description: `${indent}Normal: no match → return false`,
            type: 'return',
            result: false,
            pseudocodeLine: 5
          });
          return false;
        }
      }
    };

    const finalResult = helper(0, 0, 0);
    steps.push({
      s, p,
      result: finalResult,
      description: `Final result: ${finalResult}`,
      type: 'final'
    });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(s, p));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [s, p]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  const getCharHighlightS = (idx) => {
    if (step.i !== undefined && idx === step.i) return 'border-2 border-[#4ec9b0]';
    return 'border-2 border-[#222222]';
  };

  const getCharHighlightP = (idx) => {
    if (step.j !== undefined && idx === step.j) return 'border-2 border-[#ce9178]';
    return 'border-2 border-[#222222]';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Regular Expression Matching</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: Exponential worst case</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: O(n)</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input type="text" value={s} onChange={(e) => setS(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" placeholder="String s" />
        <input type="text" value={p} onChange={(e) => setP(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" placeholder="Pattern p" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          {/* String s display */}
          <div>
            <p className="text-[#9cdcfe] mb-2">String s:</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {step.s?.split('').map((ch, idx) => (
                <div key={`s-${idx}`} className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-2xl bg-blue-500 ${getCharHighlightS(idx)}`}>
                    {ch}
                  </div>
                  {step.i === idx && <span className="text-[#4ec9b0] text-xs mt-1">i</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Pattern p display */}
          <div>
            <p className="text-[#9cdcfe] mb-2">Pattern p:</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {step.p?.split('').map((ch, idx) => (
                <div key={`p-${idx}`} className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-2xl bg-blue-500 ${getCharHighlightP(idx)}`}>
                    {ch}
                  </div>
                  {step.j === idx && <span className="text-[#ce9178] text-xs mt-1">j</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Recursion depth indicator */}
          {step.depth !== undefined && (
            <div className="text-sm text-gray-400">
              Depth: {step.depth} {'  '.repeat(step.depth)}➜
            </div>
          )}

          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
            <p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>
            {step.result !== undefined && (
              <p className="text-[#4ec9b0] mt-2">Result = {step.result ? 'true' : 'false'}</p>
            )}
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

export default RegexMatching;