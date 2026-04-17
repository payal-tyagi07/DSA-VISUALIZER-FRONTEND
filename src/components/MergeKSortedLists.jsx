import React, { useState, useEffect } from 'react';

const MergeKSortedLists = () => {
  const pseudocodeLines = [
    "procedure mergeKLists(lists):",
    "  heap = []",
    "  for i, list in enumerate(lists):",
    "    if list: heap.push((list[0], i, 0))",
    "  result = []",
    "  while heap:",
    "    val, listIdx, elemIdx = heap.pop()",
    "    result.append(val)",
    "    if elemIdx+1 < len(lists[listIdx]):",
    "      heap.push((lists[listIdx][elemIdx+1], listIdx, elemIdx+1))",
    "  return result"
  ];

  const [lists, setLists] = useState([[1,4,5],[1,3,4],[2,6]]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [input, setInput] = useState('1,4,5;1,3,4;2,6');

  const updateLists = () => {
    const listStrs = input.split(';').map(s => s.trim());
    const newLists = listStrs.map(s => s.split(',').map(Number).filter(n => !isNaN(n)));
    setLists(newLists);
  };

  const generateSteps = (lists) => {
    const steps = [];
    const heap = []; // min heap by value
    // Initialize heap with first element of each list
    steps.push({ lists: lists.map(l => [...l]), heap: [], result: [], description: "Start", pseudocodeLine: 1 });
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].length) {
        heap.push({ val: lists[i][0], listIdx: i, elemIdx: 0 });
        steps.push({ lists: lists.map(l => [...l]), heap: heap.map(h => ({val:h.val, list:h.listIdx, idx:h.elemIdx})), result: [], description: `Add first element of list ${i} (${lists[i][0]}) to heap`, pseudocodeLine: 2 });
      }
    }
    heap.sort((a,b)=>a.val-b.val);
    steps.push({ lists: lists.map(l => [...l]), heap: heap.map(h => ({val:h.val, list:h.listIdx, idx:h.elemIdx})), result: [], description: "Heap built" });

    let result = [];
    while (heap.length) {
      const { val, listIdx, elemIdx } = heap.shift();
      result.push(val);
      steps.push({ lists: lists.map(l => [...l]), heap: heap.map(h => ({val:h.val, list:h.listIdx, idx:h.elemIdx})), result: [...result], description: `Extract min ${val} from list ${listIdx}, add to result`, pseudocodeLine: 4 });
      if (elemIdx + 1 < lists[listIdx].length) {
        const nextVal = lists[listIdx][elemIdx+1];
        heap.push({ val: nextVal, listIdx, elemIdx: elemIdx+1 });
        heap.sort((a,b)=>a.val-b.val);
        steps.push({ lists: lists.map(l => [...l]), heap: heap.map(h => ({val:h.val, list:h.listIdx, idx:h.elemIdx})), result: [...result], description: `Add next element ${nextVal} from list ${listIdx} to heap`, pseudocodeLine: 5 });
      }
    }
    steps.push({ result, description: `Merged list: [${result.join(',')}]`, pseudocodeLine: 6 });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(lists));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [lists]);

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
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Merge K Sorted Lists</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(n log k)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(k)</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-96" placeholder="list1;list2;list3 (e.g., 1,4,5;1,3,4;2,6)" />
        <button onClick={updateLists} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div>
            <div className="text-sm text-[#9cdcfe] mb-1">Input lists</div>
            {step.lists?.map((list, idx) => (
              <div key={idx} className="flex gap-1 mt-1">
                <span className="text-gray-400">List {idx}:</span>
                {list.map((val, i) => (
                  <div key={i} className="w-10 h-10 flex items-center justify-center text-sm font-mono rounded border bg-[#1e1e1e] text-white border-[#3c3c3c]">{val}</div>
                ))}
              </div>
            ))}
          </div>
          <div>
            <div className="text-sm text-[#9cdcfe] mb-1">Min Heap (value, list, index)</div>
            <div className="flex gap-2 flex-wrap">
              {step.heap?.map((item, idx) => (
                <div key={idx} className="bg-green-500 p-2 rounded">val:{item.val} (L{item.list}, i{item.idx})</div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm text-[#9cdcfe] mb-1">Merged result</div>
            <div className="flex gap-1">
              {step.result?.map((val, idx) => (
                <div key={idx} className="w-10 h-10 flex items-center justify-center text-sm font-mono rounded border bg-blue-500 text-white border-[#3c3c3c]">{val}</div>
              ))}
            </div>
          </div>
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
            <p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>
          </div>
          {/* Progress, speed, buttons (same pattern) */}
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

export default MergeKSortedLists;