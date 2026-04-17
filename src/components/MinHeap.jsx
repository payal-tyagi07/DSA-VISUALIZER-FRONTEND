import React, { useState, useEffect } from 'react';

const MinHeap = () => {
  const pseudocodeLines = [
    "class MinHeap:",
    "  heap = []",
    "  insert(value):",
    "    heap.append(value)",
    "    heapifyUp(len(heap)-1)",
    "  heapifyUp(index):",
    "    while index > 0 and heap[index] < heap[parent(index)]:",
    "      swap(heap[index], heap[parent(index)])",
    "      index = parent(index)",
    "  extractMin():",
    "    if heap empty: return None",
    "    minVal = heap[0]",
    "    heap[0] = heap[-1]",
    "    heap.pop()",
    "    heapifyDown(0)",
    "    return minVal",
    "  heapifyDown(index):",
    "    smallest = index",
    "    left = 2*index+1, right = 2*index+2",
    "    if left < size and heap[left] < heap[smallest]: smallest = left",
    "    if right < size and heap[right] < heap[smallest]: smallest = right",
    "    if smallest != index:",
    "      swap(heap[index], heap[smallest])",
    "      heapifyDown(smallest)"
  ];

  const [heap, setHeap] = useState([10, 20, 30, 40, 50, 35]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [inputValue, setInputValue] = useState('');
  const [action, setAction] = useState('insert');

  // Initialize steps with the current heap
  useEffect(() => {
    setSteps([{ heap: [...heap], description: "Initial min heap" }]);
    setCurrentStep(0);
    setIsPlaying(false);
  }, []); // only once on mount

  const generateStepsForAction = (currentHeap, actionType, value) => {
    const steps = [];
    let heap = [...currentHeap];
    steps.push({ heap: [...heap], description: `Start with heap: [${heap.join(',')}]` });
    if (actionType === 'insert' && value !== undefined && !isNaN(value)) {
      const num = Number(value);
      steps.push({ heap: [...heap], description: `Insert ${num} at the end` });
      heap.push(num);
      let index = heap.length - 1;
      steps.push({ heap: [...heap], description: `Heapify up from index ${index}` });
      while (index > 0 && heap[index] < heap[Math.floor((index-1)/2)]) {
        const parent = Math.floor((index-1)/2);
        [heap[index], heap[parent]] = [heap[parent], heap[index]];
        steps.push({ heap: [...heap], highlight: [index, parent], description: `Swap with parent (${heap[index]}) → heapify up continues` });
        index = parent;
      }
      steps.push({ heap: [...heap], description: `Insertion complete. Heap: [${heap.join(',')}]` });
    } else if (actionType === 'extract') {
      if (heap.length === 0) {
        steps.push({ heap: [...heap], description: "Heap is empty, cannot extract min" });
      } else {
        const minVal = heap[0];
        steps.push({ heap: [...heap], description: `Extract min: ${minVal}` });
        heap[0] = heap[heap.length-1];
        heap.pop();
        steps.push({ heap: [...heap], description: `Move last element to root, then heapify down` });
        let index = 0;
        const size = heap.length;
        while (true) {
          let smallest = index;
          const left = 2*index+1;
          const right = 2*index+2;
          if (left < size && heap[left] < heap[smallest]) smallest = left;
          if (right < size && heap[right] < heap[smallest]) smallest = right;
          if (smallest !== index) {
            [heap[index], heap[smallest]] = [heap[smallest], heap[index]];
            steps.push({ heap: [...heap], highlight: [index, smallest], description: `Swap with smaller child (${heap[index]})` });
            index = smallest;
          } else break;
        }
        steps.push({ heap: [...heap], description: `Extract complete. New heap: [${heap.join(',')}], extracted: ${minVal}` });
      }
    }
    return steps;
  };

  const performAction = () => {
    if (action === 'insert') {
      if (inputValue === '') return;
      const num = Number(inputValue);
      if (isNaN(num)) return;
      const newSteps = generateStepsForAction(heap, 'insert', num);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
      const finalHeap = newSteps[newSteps.length-1].heap;
      setHeap(finalHeap);
      setInputValue('');
    } else if (action === 'extract') {
      const newSteps = generateStepsForAction(heap, 'extract');
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
      const finalHeap = newSteps[newSteps.length-1].heap;
      setHeap(finalHeap);
    }
  };

  const renderHeapTree = (heapArr, highlightIndices = []) => {
    if (!heapArr || heapArr.length === 0) return <div className="text-gray-400">Heap is empty</div>;
    const n = heapArr.length;
    const levels = Math.floor(Math.log2(n)) + 1;
    const nodeWidth = 60;
    const levelHeight = 80;
    const totalWidth = nodeWidth * Math.pow(2, levels-1);
    const getNodePos = (index) => {
      const level = Math.floor(Math.log2(index+1));
      const nodesAtLevel = Math.pow(2, level);
      const positionInLevel = index - (Math.pow(2, level) - 1);
      const x = (positionInLevel + 0.5) * (totalWidth / nodesAtLevel);
      const y = level * levelHeight + 40;
      return { x, y };
    };
    return (
      <svg width="100%" height={levels * levelHeight + 80} viewBox={`0 0 ${totalWidth} ${levels * levelHeight + 80}`} className="mx-auto">
        {heapArr.map((val, idx) => {
          const leftChild = 2*idx+1;
          const rightChild = 2*idx+2;
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
          if (highlightIndices.includes(idx)) fillColor = '#eab308';
          lines.push(
            <circle key={`circle-${idx}`} cx={pos.x} cy={pos.y} r="20" fill={fillColor} stroke="#222" strokeWidth="2" />,
            <text key={`text-${idx}`} x={pos.x} y={pos.y+5} textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">{val}</text>
          );
          return lines;
        })}
      </svg>
    );
  };

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length-1) {
      timer = setTimeout(() => setCurrentStep(currentStep+1), speed);
    } else if (currentStep === steps.length-1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || { heap: heap };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Min Heap</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Insert/Extract: O(log n)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(n)</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <select value={action} onChange={(e) => setAction(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1">
          <option value="insert">Insert</option>
          <option value="extract">Extract Min</option>
        </select>
        {action === 'insert' && (
          <>
            <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-24" placeholder="Value" />
            <button onClick={performAction} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Perform</button>
          </>
        )}
        {action === 'extract' && (
          <button onClick={performAction} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Extract Min</button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="overflow-x-auto">
            {renderHeapTree(step.heap, step.highlight)}
          </div>
          <div className="flex gap-1 justify-center flex-wrap">
            {step.heap?.map((val, idx) => (
              <div key={idx} className={`w-10 h-10 flex items-center justify-center text-sm font-mono rounded border ${step.highlight && step.highlight.includes(idx) ? 'bg-yellow-500 text-black' : 'bg-[#1e1e1e] text-white'} border-[#3c3c3c]`}>
                {val}
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

export default MinHeap;