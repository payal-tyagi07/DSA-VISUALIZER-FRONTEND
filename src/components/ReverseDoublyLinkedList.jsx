import React, { useState, useEffect } from 'react';

// Helper to generate fake memory addresses
const getNodeAddress = (idx, base = 0x1000, step = 0x10) => `0x${(base + idx * step).toString(16).toUpperCase()}`;

const ReverseDoublyLinkedList = () => {
  const pseudocodeLines = [
    "procedure reverseDoubly(head):",
    "  current = head, temp = null",
    "  while current != null:",
    "    temp = current.prev",
    "    current.prev = current.next",
    "    current.next = temp",
    "    current = current.prev",
    "  if temp != null: head = temp.prev",
    "  return head"
  ];

  const [list, setList] = useState([1, 2, 3, 4, 5]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [input, setInput] = useState('1,2,3,4,5');

  const updateList = () => {
    const newArr = input.split(',').map(Number).filter(n => !isNaN(n));
    if (newArr.length) setList(newArr);
  };

  const generateSteps = (arr) => {
    const steps = [];
    let currentArr = [...arr];
    let current = 0;
    let temp = null;

    steps.push({
      array: currentArr,
      current,
      temp,
      description: "Start: current = head (index 0), temp = null",
      pseudocodeLine: 1
    });

    // Process each node exactly once
    for (let i = 0; i < currentArr.length; i++) {
      current = i;

      // Store current.prev in temp (prev is conceptually the previous index, or null)
      const prevIndex = current > 0 ? current - 1 : null;
      steps.push({
        array: currentArr,
        current,
        temp: prevIndex,
        description: `Store current.prev (index ${prevIndex !== null ? prevIndex : 'null'}) in temp`,
        pseudocodeLine: 3
      });

      // Swap pointers: current.prev = current.next
      const nextIndex = current < currentArr.length - 1 ? current + 1 : null;
      steps.push({
        array: currentArr,
        current,
        temp: prevIndex,
        description: `Set current.prev = current.next (now points to ${nextIndex !== null ? nextIndex : 'null'})`,
        pseudocodeLine: 4
      });

      // Swap pointers: current.next = temp (old prev)
      steps.push({
        array: currentArr,
        current,
        temp: prevIndex,
        description: `Set current.next = temp (now points to ${prevIndex !== null ? prevIndex : 'null'})`,
        pseudocodeLine: 5
      });

      // Move current to current.prev (which is the original next after swap)
      const newCurrent = nextIndex !== null ? nextIndex : current;
      steps.push({
        array: currentArr,
        current: newCurrent,
        temp: current,
        description: `Move current to current.prev → index ${newCurrent}`,
        pseudocodeLine: 6
      });
      current = newCurrent;
    }

    // Build reversed array (the final list after all pointer swaps)
    const reversed = [...currentArr].reverse();
    steps.push({
      array: reversed,
      description: `Reversed doubly linked list: [${reversed.join(',')}]`,
      pseudocodeLine: 7
    });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(list));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [list]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  const getNodeStyle = (idx) => {
    if (step.current === idx) return 'border-2 border-yellow-500 bg-yellow-900/30';
    if (step.temp === idx) return 'border-2 border-blue-400 bg-blue-900/30';
    return 'border border-gray-600 bg-[#1e1e1e]';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Reverse a Doubly Linked List</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: O(n)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: O(1)</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" />
        <button onClick={updateList} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          {/* Horizontal scrollable container */}
          <div className="overflow-x-auto pb-4">
            <div className="flex flex-nowrap items-center justify-start gap-2 min-w-max">
              {/* Head pointer */}
              <div className="flex flex-col items-center mr-2">
                <div className="text-[#9cdcfe] text-sm font-bold">Head</div>
                <div className="text-2xl">↓</div>
              </div>
              {step.array?.map((val, idx) => (
                <div key={idx} className="relative flex flex-col items-center">
                  {/* Node box */}
                  <div className={`relative w-32 p-2 rounded ${getNodeStyle(idx)} shadow-md`}>
                    <div className="text-center text-sm text-gray-400">Data</div>
                    <div className="text-center text-xl font-bold text-white">{val}</div>
                    <div className="text-center text-xs text-gray-400 mt-1">Address</div>
                    <div className="text-center text-xs font-mono text-[#ce9178]">{getNodeAddress(idx)}</div>
                  </div>
                  {/* Next arrow (right) */}
                  {idx < step.array.length - 1 && (
                    <div className="flex flex-col items-center mt-1">
                      <div className="text-gray-400 text-2xl">→</div>
                      <div className="text-gray-400 text-xs">next</div>
                    </div>
                  )}
                  {/* Prev arrow (left) – shown for all nodes except the first */}
                  {idx > 0 && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-8 flex flex-col items-center">
                      <div className="text-gray-400 text-2xl">←</div>
                      <div className="text-gray-400 text-xs">prev</div>
                    </div>
                  )}
                  {/* Pointer labels below the node */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap">
                    {step.current === idx && <span className="text-yellow-500">current</span>}
                    {step.temp === idx && <span className="text-blue-400">temp</span>}
                  </div>
                </div>
              ))}
              {/* Null at the end */}
              {step.array && step.array.length > 0 && (
                <div className="flex items-center">
                  <div className="text-gray-400 text-2xl mx-1">→</div>
                  <div className="w-24 p-2 rounded border border-gray-600 bg-[#1e1e1e] text-center text-sm text-gray-400">Null</div>
                </div>
              )}
            </div>
          </div>

          {/* Step description */}
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
            <p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep + 1}:</span> {step.description}</p>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Progress</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden">
              <div
                className="bg-[#4ec9b0] h-3 rounded-full transition-all"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-center text-xs text-gray-500 mt-1">Step {currentStep + 1} of {steps.length}</div>
          </div>

          {/* Speed control */}
          <div className="flex items-center justify-center gap-4 bg-[#0d0d0d] p-3 rounded-lg">
            <span>⏱️ Speed:</span>
            <input
              type="range"
              min="300"
              max="2000"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-48 md:w-64 accent-[#4ec9b0]"
            />
            <span className="bg-[#1a1a1a] px-3 py-1 rounded-full">{speed}ms</span>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => { setCurrentStep(Math.max(0, currentStep - 1)); setIsPlaying(false); }}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${currentStep === 0 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}
            >← Prev</button>
            <button
              onClick={() => { setCurrentStep(0); setIsPlaying(false); }}
              className="px-6 py-3 bg-[#c2410c] hover:bg-[#b91c1c] text-white rounded-lg"
            >Reset</button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={currentStep === steps.length - 1}
              className={`px-6 py-3 rounded-lg font-semibold ${currentStep === steps.length - 1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : isPlaying ? 'bg-[#ca5100] hover:bg-[#b74700] text-white' : 'bg-[#2e7d32] hover:bg-[#1e5f20] text-white'}`}
            >{isPlaying ? '⏸️ Pause' : '▶️ Play'}</button>
            <button
              onClick={() => { setCurrentStep(Math.min(steps.length - 1, currentStep + 1)); setIsPlaying(false); }}
              disabled={currentStep === steps.length - 1}
              className={`px-6 py-3 rounded-lg font-semibold ${currentStep === steps.length - 1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}
            >Next →</button>
          </div>
        </div>

        {/* Pseudocode panel */}
        <div className="lg:w-1/3 bg-[#0a0a0a] border border-[#222222] rounded-xl p-5 font-mono text-sm shadow-inner">
          <h3 className="text-lg font-bold text-[#569cd6] mb-4">📝 Pseudocode</h3>
          <div className="space-y-1">
            {pseudocodeLines.map((line, idx) => (
              <div
                key={idx}
                className={`px-3 py-1.5 rounded transition-all duration-200 ${
                  idx === step.pseudocodeLine
                    ? 'bg-[#1a1a1a] text-[#d4d4d4] font-semibold border-l-4 border-[#569cd6]'
                    : 'text-[#9cdcfe] hover:bg-[#1a1a1a]'
                }`}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReverseDoublyLinkedList;