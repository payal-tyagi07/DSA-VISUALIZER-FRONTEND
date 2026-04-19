import React, { useState, useEffect } from 'react';

const Factorial = () => {
  const pseudocodeLines = [
    "procedure factorial(n):",
    "  if n <= 1:",
    "    return 1",
    "  else:",
    "    return n * factorial(n-1)"
  ];

  const [n, setN] = useState(5);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const generateSteps = (num) => {
    const steps = [];
    const calls = [];
    const results = new Map();

    const recurse = (x) => {
      if (x <= 1) {
        steps.push({
          type: 'base',
          label: `fact(${x})`,
          result: 1,
          description: `Base case: fact(${x}) = 1`,
          pseudocodeLine: 2,
          depth: calls.length
        });
        return 1;
      } else {
        steps.push({
          type: 'call',
          label: `fact(${x})`,
          description: `Call fact(${x}) → needs fact(${x-1})`,
          pseudocodeLine: 4,
          depth: calls.length
        });
        calls.push(x);
        const sub = recurse(x-1);
        const res = x * sub;
        steps.push({
          type: 'return',
          label: `fact(${x})`,
          result: res,
          description: `Return ${x} * fact(${x-1}) = ${x} * ${sub} = ${res}`,
          pseudocodeLine: 5,
          depth: calls.length - 1
        });
        calls.pop();
        return res;
      }
    };
    recurse(num);
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(n));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [n]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  // Render recursion tree as nested divs
  const renderTree = () => {
    // Build tree structure from steps
    const root = { label: 'fact('+n+')', children: [], depth: 0 };
    const stack = [{ node: root, depth: 0 }];
    for (const s of steps) {
      if (s.type === 'call' && s.depth === stack.length - 1) {
        const child = { label: s.label, children: [], depth: s.depth+1 };
        stack[stack.length-1].node.children.push(child);
        stack.push({ node: child, depth: s.depth+1 });
      } else if (s.type === 'return' && s.depth === stack.length - 2) {
        stack.pop();
      }
    }
    const renderNode = (node) => (
      <div key={node.label} className="flex flex-col items-center">
        <div className={`px-3 py-1 rounded-full border ${node.label === step.label ? 'bg-yellow-800 border-yellow-400' : 'bg-gray-800 border-gray-600'} text-white text-xs font-mono`}>
          {node.label}
        </div>
        {node.children.length > 0 && (
          <div className="flex justify-center gap-4 mt-2">
            {node.children.map(child => (
              <div key={child.label} className="flex flex-col items-center">
                <div className="w-px h-4 bg-gray-500"></div>
                {renderNode(child)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
    return renderNode(root);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Factorial (Recursion)</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: O(n)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: O(n)</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <label className="text-[#9cdcfe]">n:</label>
        <input type="number" min="0" max="10" value={n} onChange={(e) => setN(Number(e.target.value))} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 focus:border-[#569cd6]" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-black/40 p-4 rounded-lg overflow-x-auto">
            <div className="text-center text-sm text-gray-400 mb-2">Recursion Tree</div>
            <div className="min-w-max">{renderTree()}</div>
          </div>
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
            <p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>
            {step.result !== undefined && <p className="mt-2 text-[#4ec9b0]">Result = {step.result}</p>}
          </div>
          {/* progress, speed, buttons (same as DP components) */}
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

export default Factorial;