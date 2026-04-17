// src/components/ReverseNodesInKGroup.jsx
import React, { useState, useEffect } from 'react';

const getNodeAddress = (idx, base = 0x1000, step = 0x10) => `0x${(base + idx * step).toString(16).toUpperCase()}`;

const ReverseNodesInKGroup = () => {
  const pseudocodeLines = [
    "procedure reverseKGroup(head, k):",
    "  dummy = new Node(0)",
    "  dummy.next = head",
    "  prev = dummy",
    "  while true:",
    "    kth = getKth(prev, k)",
    "    if not kth: break",
    "    nextGroup = kth.next",
    "    // reverse group",
    "    prevNext = prev.next",
    "    curr = prevNext.next",
    "    for i = 0 to k-2:",
    "      next = curr.next",
    "      curr.next = prevNext",
    "      prevNext = curr",
    "      curr = next",
    "    prevNext.next = nextGroup",
    "    prev.next = kth",
    "    prev = prevNext",
    "  return dummy.next"
  ];
  const [list, setList] = useState([1,2,3,4,5]);
  const [k, setK] = useState(2);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [input, setInput] = useState('1,2,3,4,5');

  const updateList = () => {
    const newArr = input.split(',').map(Number).filter(n => !isNaN(n));
    if (newArr.length) setList(newArr);
  };

  const generateSteps = (arr, k) => {
    const steps = [];
    let result = [...arr];
    steps.push({ array: result, k, description: `Reverse in groups of ${k}`, pseudocodeLine: 1 });
    let i = 0;
    while (i + k <= result.length) {
      const groupStart = i;
      const groupEnd = i + k - 1;
      // Show the group before reversal
      steps.push({
        array: result,
        highlight: Array.from({ length: k }, (_, idx) => groupStart + idx),
        description: `Group to reverse: indices ${groupStart} to ${groupEnd} (values ${result.slice(groupStart, groupStart+k).join(',')})`,
        pseudocodeLine: 6
      });
      // Perform reversal
      const group = result.slice(groupStart, groupStart + k);
      const reversedGroup = [...group].reverse();
      result = [...result.slice(0, groupStart), ...reversedGroup, ...result.slice(groupStart + k)];
      steps.push({
        array: result,
        highlight: Array.from({ length: k }, (_, idx) => groupStart + idx),
        description: `Reversed group → now [${result.slice(groupStart, groupStart+k).join(',')}]`,
        pseudocodeLine: 7
      });
      i += k;
      if (i + k <= result.length) {
        steps.push({
          array: result,
          description: `Move to next group starting at index ${i}`,
          pseudocodeLine: 4
        });
      }
    }
    steps.push({ array: result, result, description: `Final list: [${result.join(',')}]` });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(list, k));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [list, k]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  const getNodeStyle = (idx) => {
    if (step.highlight && step.highlight.includes(idx)) return 'border-2 border-yellow-500 bg-yellow-900/30';
    return 'border border-gray-600 bg-[#1e1e1e]';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Reverse Nodes in k‑Group</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: O(n)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: O(1)</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" />
        <input type="number" value={k} onChange={(e) => setK(Number(e.target.value))} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-20" min="1" />
        <button onClick={updateList} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="overflow-x-auto pb-4">
            <div className="flex flex-nowrap items-center justify-start gap-2 min-w-max">
              <div className="flex flex-col items-center mr-2">
                <div className="text-[#9cdcfe] text-sm font-bold">Head</div>
                <div className="text-2xl">↓</div>
              </div>
              {step.array?.map((val, idx) => (
                <div key={idx} className="relative flex items-center">
                  <div className={`relative w-32 p-2 rounded ${getNodeStyle(idx)} shadow-md`}>
                    <div className="text-center text-sm text-gray-400">Data</div>
                    <div className="text-center text-xl font-bold text-white">{val}</div>
                    <div className="text-center text-xs text-gray-400 mt-1">Address</div>
                    <div className="text-center text-xs font-mono text-[#ce9178]">{getNodeAddress(idx)}</div>
                  </div>
                  {idx < step.array.length - 1 && <div className="text-gray-400 text-2xl mx-1">→</div>}
                </div>
              ))}
              {step.array && step.array.length > 0 && (
                <div className="flex items-center">
                  <div className="text-gray-400 text-2xl mx-1">→</div>
                  <div className="w-24 p-2 rounded border border-gray-600 bg-[#1e1e1e] text-center text-sm text-gray-400">Null</div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
            <p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>
          </div>

          {/* progress, speed, buttons (same as before) */}
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

export default ReverseNodesInKGroup;