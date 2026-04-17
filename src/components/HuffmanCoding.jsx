import React, { useState, useEffect } from 'react';

const HuffmanCoding = () => {
  const pseudocodeLines = [
    "procedure huffman(freq):",
    "  pq = min-heap of (freq, node)",
    "  while pq size > 1:",
    "    left = pq.pop(), right = pq.pop()",
    "    newNode = new Node(left.freq+right.freq)",
    "    newNode.left = left, newNode.right = right",
    "    pq.push(newNode)",
    "  return pq[0]"
  ];

  const [freq, setFreq] = useState([
    { char: 'a', freq: 5 },
    { char: 'b', freq: 9 },
    { char: 'c', freq: 12 },
    { char: 'd', freq: 13 },
    { char: 'e', freq: 16 },
    { char: 'f', freq: 45 }
  ]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [input, setInput] = useState('a,5;b,9;c,12;d,13;e,16;f,45');

  const updateFreq = () => {
    const parts = input.split(';').map(p => p.split(','));
    const newFreq = parts.map(([ch, f]) => ({ char: ch, freq: Number(f) }));
    setFreq(newFreq);
  };

  // Recursive function to compute node positions for tree layout
  const computeTreeLayout = (node, depth = 0, x = 0, positions = new Map()) => {
    if (!node) return;
    const leftWidth = node.left ? getTreeWidth(node.left) : 0;
    const rightWidth = node.right ? getTreeWidth(node.right) : 0;
    const nodeX = x + leftWidth;
    positions.set(node, { x: nodeX, y: depth * 80 });
    if (node.left) computeTreeLayout(node.left, depth + 1, x, positions);
    if (node.right) computeTreeLayout(node.right, depth + 1, nodeX + 20, positions);
    return positions;
  };

  const getTreeWidth = (node) => {
    if (!node) return 0;
    if (!node.left && !node.right) return 40;
    return getTreeWidth(node.left) + getTreeWidth(node.right);
  };

  const generateSteps = (freqList) => {
    const steps = [];
    let heap = freqList.map(f => ({ ...f, left: null, right: null, isLeaf: true }));
    heap.sort((a, b) => a.freq - b.freq);
    steps.push({
      heap: heap.map(h => ({ char: h.char, freq: h.freq })),
      description: "Initial min‑heap of leaf nodes",
      pseudocodeLine: 1
    });
    let nodeCounter = 0;
    while (heap.length > 1) {
      const left = heap.shift();
      const right = heap.shift();
      const newNode = {
        char: `N${++nodeCounter}`,
        freq: left.freq + right.freq,
        left,
        right,
        isLeaf: false
      };
      heap.push(newNode);
      heap.sort((a, b) => a.freq - b.freq);
      steps.push({
        heap: heap.map(h => ({ char: h.char, freq: h.freq })),
        tree: heap[0], // the current root (only one tree remains at the end, but during building we can show the combined tree)
        combined: { left: left.char, right: right.char, newChar: newNode.char, newFreq: newNode.freq },
        description: `Combine ${left.char}(${left.freq}) and ${right.char}(${right.freq}) → new node ${newNode.char}(${newNode.freq})`,
        pseudocodeLine: 3
      });
    }
    const finalTree = heap[0];
    steps.push({
      tree: finalTree,
      description: "Huffman tree built",
      pseudocodeLine: 5
    });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(freq));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [freq]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  // Render the Huffman tree using SVG
  const renderTree = (node) => {
    if (!node) return null;
    const positions = computeTreeLayout(node);
    const width = getTreeWidth(node);
    const height = (Math.max(...Array.from(positions.values()).map(p => p.y)) || 0) + 60;
    return (
      <svg width={width + 100} height={height} viewBox={`0 0 ${width + 100} ${height}`} className="mx-auto">
        {Array.from(positions.entries()).map(([n, pos]) => {
          const lines = [];
          if (n.left && positions.has(n.left)) {
            const leftPos = positions.get(n.left);
            lines.push(<line key={`line-${n.char}-l`} x1={pos.x + 20} y1={pos.y + 20} x2={leftPos.x + 20} y2={leftPos.y + 20} stroke="#555" strokeWidth="2" />);
          }
          if (n.right && positions.has(n.right)) {
            const rightPos = positions.get(n.right);
            lines.push(<line key={`line-${n.char}-r`} x1={pos.x + 20} y1={pos.y + 20} x2={rightPos.x + 20} y2={rightPos.y + 20} stroke="#555" strokeWidth="2" />);
          }
          const isLeaf = !n.left && !n.right;
          return (
            <g key={n.char}>
              {lines}
              <circle cx={pos.x + 20} cy={pos.y + 20} r="20" fill={isLeaf ? '#3b82f6' : '#eab308'} stroke="#222" strokeWidth="2" />
              <text x={pos.x + 20} y={pos.y + 25} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{n.char}</text>
              <text x={pos.x + 20} y={pos.y + 45} textAnchor="middle" fill="#9cdcfe" fontSize="10">{n.freq}</text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Huffman Coding</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(n log n)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(n)</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-80"
          placeholder="char,freq;char,freq;..."
        />
        <button onClick={updateFreq} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">
          Update
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          {/* Heap display */}
          <div className="bg-[#1e1e1e] p-3 rounded">
            <div className="text-sm text-[#9cdcfe] mb-1">Min‑Heap (frequency, node)</div>
            <div className="flex flex-wrap gap-2">
              {step.heap?.map((item, idx) => (
                <div key={idx} className="bg-green-700 px-3 py-1 rounded">
                  {item.char}:{item.freq}
                </div>
              ))}
            </div>
          </div>

          {/* Tree visualization */}
          {step.tree && (
            <div className="overflow-x-auto">
              {renderTree(step.tree)}
            </div>
          )}

          {/* Step description */}
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
            <p className="text-gray-300">
              <span className="font-bold text-[#9cdcfe]">Step {currentStep + 1}:</span> {step.description}
            </p>
            {step.combined && (
              <p className="text-[#4ec9b0] mt-2">
                New node {step.combined.newChar} ({step.combined.newFreq}) ← {step.combined.left} + {step.combined.right}
              </p>
            )}
          </div>

          {/* Progress, speed, buttons (same as other components) */}
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

export default HuffmanCoding;