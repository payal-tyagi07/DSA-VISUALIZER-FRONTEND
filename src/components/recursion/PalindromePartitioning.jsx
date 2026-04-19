import React, { useState, useEffect } from 'react';

const PalindromePartitioning = () => {
  const pseudocodeLines = [
    "procedure partition(s):",
    "  result = []",
    "  def backtrack(start, path):",
    "    if start == len(s):",
    "      result.append(path[:])",
    "      return",
    "    for end = start+1 to len(s):",
    "      if isPalindrome(s[start:end]):",
    "        path.append(s[start:end])",
    "        backtrack(end, path)",
    "        path.pop()",
    "  backtrack(0, [])",
    "  return result"
  ];

  const [s, setS] = useState('aab');
  const [inputStr, setInputStr] = useState('aab');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const updateString = () => setS(inputStr);
  const isPalindrome = (str) => { let l=0,r=str.length-1; while(l<r) if(str[l++]!==str[r--]) return false; return true; };

  const generateSteps = (str) => {
    const steps = [];
    const backtrack = (start, path, depth = 0) => {
      steps.push({ type: 'call', label: `bt(${start})`, description: `Path: ${JSON.stringify(path)}`, pseudocodeLine: 3, depth });
      if (start === str.length) {
        steps.push({ type: 'add', label: `sol`, description: `Partition: ${JSON.stringify(path)}`, pseudocodeLine: 4, depth });
        steps.push({ type: 'return', label: `ret`, description: `Return`, depth, pseudocodeLine: 5 });
        return;
      }
      for (let end = start+1; end <= str.length; end++) {
        const substr = str.slice(start, end);
        if (isPalindrome(substr)) {
          steps.push({ type: 'choose', label: `"${substr}"`, description: `Take "${substr}", path→${JSON.stringify([...path, substr])}`, pseudocodeLine: 7, depth: depth+1 });
          backtrack(end, [...path, substr], depth+1);
          steps.push({ type: 'backtrack', label: `-${substr}`, description: `Remove "${substr}", path←${JSON.stringify(path)}`, pseudocodeLine: 9, depth: depth+1 });
        } else {
          steps.push({ type: 'skip', label: `x${substr}`, description: `"${substr}" not palindrome`, pseudocodeLine: 7, depth: depth+1 });
        }
      }
      steps.push({ type: 'return', label: `ret`, description: `Return`, depth, pseudocodeLine: 10 });
    };
    backtrack(0, [], 0);
    steps.push({ type: 'result', description: `All partitions found`, pseudocodeLine: 11 });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(s));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [s]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  const renderTree = () => {
    const root = { label: 'start', children: [] };
    const stack = [{ node: root, depth: 0 }];
    for (const s of steps) {
      if (s.type === 'call' && s.depth === stack.length - 1) {
        const child = { label: s.label, children: [] };
        stack[stack.length-1].node.children.push(child);
        stack.push({ node: child, depth: s.depth+1 });
      } else if (s.type === 'return' && s.depth === stack.length - 2) stack.pop();
    }
    const renderNode = (node) => (
      <div key={node.label} className="flex flex-col items-center">
        <div className={`px-3 py-1 rounded-full border ${node.label === step.label ? 'bg-yellow-800 border-yellow-400' : 'bg-gray-800 border-gray-600'} text-white text-xs font-mono`}>{node.label}</div>
        {node.children.length > 0 && <div className="flex justify-center gap-4 mt-2">{node.children.map(child => <div key={child.label} className="flex flex-col items-center"><div className="w-px h-4 bg-gray-500"></div>{renderNode(child)}</div>)}</div>}
      </div>
    );
    return renderNode(root);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6"><h2 className="text-3xl font-bold text-[#569cd6] mb-2">Palindrome Partitioning</h2><div className="flex justify-center gap-4 mb-4"><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ O(n·2ⁿ)</span><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 O(n)</span></div></div>
      <div className="flex justify-center gap-4 mb-6"><label className="text-[#9cdcfe]">string s:</label><input type="text" value={inputStr} onChange={(e) => setInputStr(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-64" /><button onClick={updateString} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button></div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-black/40 p-4 rounded-lg overflow-x-auto"><div className="text-center text-sm text-gray-400 mb-2">Recursion Tree</div><div className="min-w-max">{renderTree()}</div></div>
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]"><p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p></div>
          {/* progress, speed, buttons */}
          <div><div className="flex justify-between text-sm text-gray-400 mb-1"><span>Progress</span><span>{Math.round(((currentStep+1)/steps.length)*100)}%</span></div><div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden"><div className="bg-[#4ec9b0] h-3 rounded-full transition-all" style={{ width: `${((currentStep+1)/steps.length)*100}%` }}></div></div><div className="text-center text-xs text-gray-500 mt-1">Step {currentStep+1} of {steps.length}</div></div>
          <div className="flex items-center justify-center gap-4 bg-[#0d0d0d] p-3 rounded-lg"><span>⏱️ Speed:</span><input type="range" min="300" max="2000" value={speed} onChange={(e) => setSpeed(e.target.value)} className="w-48 md:w-64 accent-[#4ec9b0]" /><span className="bg-[#1a1a1a] px-3 py-1 rounded-full">{speed}ms</span></div>
          <div className="flex justify-center gap-4 flex-wrap">
            <button onClick={() => { setCurrentStep(Math.max(0, currentStep-1)); setIsPlaying(false); }} disabled={currentStep===0} className="px-6 py-3 rounded-lg bg-blue-600 disabled:opacity-50">← Prev</button>
            <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="px-6 py-3 rounded-lg bg-red-700">Reset</button>
            <button onClick={() => setIsPlaying(!isPlaying)} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg ${isPlaying ? 'bg-orange-600' : 'bg-green-600'}`}>{isPlaying ? '⏸️ Pause' : '▶️ Play'}</button>
            <button onClick={() => { setCurrentStep(Math.min(steps.length-1, currentStep+1)); setIsPlaying(false); }} disabled={currentStep===steps.length-1} className="px-6 py-3 rounded-lg bg-blue-600 disabled:opacity-50">Next →</button>
          </div>
        </div>
        <div className="lg:w-1/3 bg-[#0a0a0a] border border-[#222222] rounded-xl p-5 font-mono text-sm shadow-inner"><h3 className="text-lg font-bold text-[#569cd6] mb-4">📝 Pseudocode</h3><div className="space-y-1">{pseudocodeLines.map((line, idx) => (<div key={idx} className={`px-3 py-1.5 rounded ${idx === step.pseudocodeLine ? 'bg-[#1a1a1a] text-[#d4d4d4] font-semibold border-l-4 border-[#569cd6]' : 'text-[#9cdcfe]'}`}>{line}</div>))}</div></div>
      </div>
    </div>
  );
};

export default PalindromePartitioning;