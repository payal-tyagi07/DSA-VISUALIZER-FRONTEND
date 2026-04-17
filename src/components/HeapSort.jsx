import React, { useState, useEffect } from 'react';

const HeapSort = () => {
  const pseudocodeLines = [
    "procedure heapSort(arr):",
    "  n = length(arr)",
    "  // Build max heap",
    "  for i = floor(n/2)-1 down to 0:",
    "    heapify(arr, n, i)",
    "  // Extract elements one by one",
    "  for i = n-1 down to 1:",
    "    swap(arr[0], arr[i])",
    "    heapify(arr, i, 0)",
    "",
    "procedure heapify(arr, n, i):",
    "  largest = i",
    "  left = 2*i + 1",
    "  right = 2*i + 2",
    "  if left < n and arr[left] > arr[largest]: largest = left",
    "  if right < n and arr[right] > arr[largest]: largest = right",
    "  if largest != i:",
    "    swap(arr[i], arr[largest])",
    "    heapify(arr, n, largest)"
  ];

  const [array, setArray] = useState([3, 6, 4, 7, 5, 2, 1, 8, 9, 10]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [input, setInput] = useState('3,6,4,7,5,2,1,8,9,10');

  const updateArray = () => {
    const newArr = input.split(',').map(Number).filter(n => !isNaN(n));
    if (newArr.length) setArray(newArr);
  };

  // Helper to record state
  const recordStep = (steps, arr, description, heapifyIdx = null, swapIndices = null, sortedBoundary = null) => {
    steps.push({
      array: [...arr],
      heapifyIdx,
      swapIndices,
      sortedBoundary,
      description
    });
  };

  const heapify = (arr, n, i, steps, isBuilding, sortedBoundary) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      recordStep(steps, arr, `Heapify at index ${i}: swap ${arr[i]} with ${arr[largest]}`, i, [i, largest], sortedBoundary);
      heapify(arr, n, largest, steps, isBuilding, sortedBoundary);
    } else {
      recordStep(steps, arr, `Heapify at index ${i}: no swap needed`, i, null, sortedBoundary);
    }
  };

  const generateSteps = (arr) => {
    const steps = [];
    let currentArr = [...arr];
    const n = currentArr.length;
    recordStep(steps, currentArr, "Initial array");

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(currentArr, n, i, steps, true, n);
    }
    recordStep(steps, currentArr, "Max heap built");

    // Extract elements
    for (let i = n - 1; i > 0; i--) {
      [currentArr[0], currentArr[i]] = [currentArr[i], currentArr[0]];
      recordStep(steps, currentArr, `Swap root with element at index ${i}`, null, [0, i], i);
      heapify(currentArr, i, 0, steps, false, i);
    }
    recordStep(steps, currentArr, "Array sorted");
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(array));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [array]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  // Render heap as a tree
  const renderHeapTree = (arr, highlightIdx, swapIndices, sortedBoundary) => {
    const n = arr.length;
    if (n === 0) return null;
    const levels = Math.floor(Math.log2(n)) + 1;
    const nodeWidth = 60;
    const levelHeight = 80;
    const totalWidth = nodeWidth * Math.pow(2, levels - 1);
    const getNodePos = (index) => {
      const level = Math.floor(Math.log2(index + 1));
      const nodesAtLevel = Math.pow(2, level);
      const positionInLevel = index - (Math.pow(2, level) - 1);
      const x = (positionInLevel + 0.5) * (totalWidth / nodesAtLevel);
      const y = level * levelHeight + 40;
      return { x, y };
    };

    return (
      <svg width="100%" height={levels * levelHeight + 80} viewBox={`0 0 ${totalWidth} ${levels * levelHeight + 80}`} className="mx-auto">
        {arr.map((val, idx) => {
          const leftChild = 2 * idx + 1;
          const rightChild = 2 * idx + 2;
          const pos = getNodePos(idx);
          const lines = [];
          if (leftChild < n) {
            const childPos = getNodePos(leftChild);
            lines.push(<line key={`line-${idx}-l`} x1={pos.x} y1={pos.y} x2={childPos.x} y2={childPos.y} stroke="#555" strokeWidth="2" />);
          }
          if (rightChild < n) {
            const childPos = getNodePos(rightChild);
            lines.push(<line key={`line-${idx}-r`} x1={pos.x} y1={pos.y} x2={childPos.x} y2={childPos.y} stroke="#555" strokeWidth="2" />);
          }
          let fillColor = '#3b82f6';
          if (swapIndices && swapIndices.includes(idx)) fillColor = '#f97316';
          else if (highlightIdx === idx) fillColor = '#eab308';
          else if (sortedBoundary && idx >= sortedBoundary) fillColor = '#22c55e';
          lines.push(
            <circle key={`circle-${idx}`} cx={pos.x} cy={pos.y} r="20" fill={fillColor} stroke="#222" strokeWidth="2" />,
            <text key={`text-${idx}`} x={pos.x} y={pos.y + 5} textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">{val}</text>
          );
          return lines;
        })}
      </svg>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Heap Sort</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(n log n)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(1)</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" placeholder="Numbers, comma separated" />
        <button onClick={updateArray} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          {/* Tree visualization */}
          <div className="overflow-x-auto">
            {step.array && renderHeapTree(step.array, step.heapifyIdx, step.swapIndices, step.sortedBoundary)}
          </div>
          {/* Array representation below tree */}
          <div className="flex gap-1 justify-center flex-wrap">
            {step.array?.map((val, idx) => (
              <div key={idx} className={`w-10 h-10 flex items-center justify-center text-sm font-mono rounded border ${step.sortedBoundary && idx >= step.sortedBoundary ? 'bg-green-800' : 'bg-[#1e1e1e]'} text-white border-[#3c3c3c]`}>
                {val}
              </div>
            ))}
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
            <p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Progress</span><span>{Math.round(((currentStep+1)/steps.length)*100)}%</span>
            </div>
            <div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden">
              <div className="bg-[#4ec9b0] h-3 rounded-full transition-all" style={{ width: `${((currentStep+1)/steps.length)*100}%` }}></div>
            </div>
            <div className="text-center text-xs text-gray-500 mt-1">Step {currentStep+1} of {steps.length}</div>
          </div>

          {/* Speed */}
          <div className="flex items-center justify-center gap-4 bg-[#0d0d0d] p-3 rounded-lg">
            <span>⏱️ Speed:</span>
            <input type="range" min="300" max="2000" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-48 md:w-64 accent-[#4ec9b0]" />
            <span className="bg-[#1a1a1a] px-3 py-1 rounded-full">{speed}ms</span>
          </div>

          {/* Buttons */}
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

export default HeapSort;