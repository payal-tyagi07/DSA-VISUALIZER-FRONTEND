import React, { useState, useEffect } from 'react';
console.log("FindCycleStart component loaded");

const getNodeAddress = (idx, base = 0x1000, step = 0x10) => `0x${(base + idx * step).toString(16).toUpperCase()}`;

const FindCycleStart = () => {
  const pseudocodeLines = [
    "procedure detectCycle(head):",
    "  slow = head, fast = head",
    "  while fast and fast.next:",
    "    slow = slow.next",
    "    fast = fast.next.next",
    "    if slow == fast: break",
    "  if not fast or not fast.next: return null",
    "  slow = head",
    "  while slow != fast:",
    "    slow = slow.next",
    "    fast = fast.next",
    "  return slow"
  ];

  const [list, setList] = useState([1,2,3,4,5]);
  const [cyclePos, setCyclePos] = useState(2);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [input, setInput] = useState('1,2,3,4,5');
  const [cycleInput, setCycleInput] = useState('2');

  const updateList = () => {
    const newArr = input.split(',').map(Number).filter(n => !isNaN(n));
    if (newArr.length) setList(newArr);
    setCyclePos(Number(cycleInput));
  };

  const generateSteps = (arr, cycleIdx) => {
    const steps = [];
    let slow = 0, fast = 0;
    steps.push({ array: arr, slow, fast, cycleIdx, phase: 1, description: "Phase 1: Find meeting point", pseudocodeLine: 1 });
    let meeting = -1;
    while (fast < arr.length && fast + 1 < arr.length) {
      slow = (slow + 1) % arr.length;
      fast = (fast + 2) % arr.length;
      steps.push({ array: arr, slow, fast, cycleIdx, phase: 1, description: `Move slow to index ${slow}, fast to ${fast}`, pseudocodeLine: 3 });
      if (slow === fast) {
        meeting = slow;
        steps.push({ array: arr, slow, fast, cycleIdx, phase: 1, description: `Meeting at index ${meeting}`, pseudocodeLine: 5 });
        break;
      }
    }
    if (meeting === -1) {
      steps.push({ array: arr, cycleIdx, result: null, description: "No cycle", pseudocodeLine: 6 });
      return steps;
    }
    steps.push({ array: arr, slow: 0, fast: meeting, cycleIdx, phase: 2, description: "Phase 2: Find cycle start", pseudocodeLine: 7 });
    slow = 0;
    while (slow !== fast) {
      slow = (slow + 1) % arr.length;
      fast = (fast + 1) % arr.length;
      steps.push({ array: arr, slow, fast, cycleIdx, phase: 2, description: `Move both one step: slow to ${slow}, fast to ${fast}`, pseudocodeLine: 9 });
    }
    steps.push({ array: arr, result: slow, cycleIdx, description: `Cycle starts at index ${slow} (value ${arr[slow]})`, pseudocodeLine: 11 });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(list, cyclePos));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [list, cyclePos]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  const getNodeStyle = (idx) => {
    if (step.slow === idx) return 'border-2 border-yellow-500 bg-yellow-900/30';
    if (step.fast === idx) return 'border-2 border-orange-500 bg-orange-900/30';
    if (step.result === idx) return 'border-2 border-green-500 bg-green-900/30';
    return 'border border-gray-600 bg-[#1e1e1e]';
  };

  const renderNodes = () => {
    if (!step.array) return null;
    const nodes = [];
    for (let i = 0; i < step.array.length; i++) {
      nodes.push(
        <div key={i} className="relative flex items-center">
          <div className={`relative w-32 p-2 rounded ${getNodeStyle(i)} shadow-md`}>
            <div className="text-center text-sm text-gray-400">Data</div>
            <div className="text-center text-xl font-bold text-white">{step.array[i]}</div>
            <div className="text-center text-xs text-gray-400 mt-1">Address</div>
            <div className="text-center text-xs font-mono text-[#ce9178]">{getNodeAddress(i)}</div>
          </div>
          {i < step.array.length - 1 && <div className="text-gray-400 text-2xl mx-1">→</div>}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap">
            {step.slow === i && <span className="text-yellow-500">slow</span>}
            {step.fast === i && <span className="text-orange-500">fast</span>}
          </div>
        </div>
      );
      if (i === step.array.length - 1 && step.cycleIdx !== undefined && step.cycleIdx >= 0 && step.cycleIdx < step.array.length) {
        nodes.push(<div key="cycle-arrow" className="text-red-500 text-2xl mx-1">⟳</div>);
      }
    }
    return nodes;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Find Cycle Start (Floyd's)</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: O(n)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: O(1)</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" />
        <input type="number" value={cycleInput} onChange={(e) => setCycleInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-20" placeholder="Cycle start index" />
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
              {renderNodes()}
              {step.array && step.array.length > 0 && step.cycleIdx === undefined && (
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

export default FindCycleStart;