// src/components/FlattenMultilevelList.jsx
import React, { useState, useEffect } from 'react';

const FlattenMultilevelList = () => {
  const pseudocodeLines = [
    "procedure flatten(head):",
    "  if not head: return head",
    "  dummy = new Node(0)",
    "  dummy.next = head",
    "  stack = [head]",
    "  prev = dummy",
    "  while stack:",
    "    node = stack.pop()",
    "    if node.next: stack.push(node.next)",
    "    if node.child: stack.push(node.child)",
    "    prev.next = node",
    "    node.prev = prev",
    "    prev = node",
    "  return dummy.next"
  ];

  const [list, setList] = useState([
    { val: 1, child: 2, next: null },
    { val: 2, child: null, next: 3 },
    { val: 3, child: 4, next: null },
    { val: 4, child: null, next: 5 },
    { val: 5, child: null, next: null }
  ]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [input, setInput] = useState('1,2,3,4,5');
  const [childIndices, setChildIndices] = useState('1,0,3,0,0');

  const updateList = () => {
    const vals = input.split(',').map(Number).filter(n => !isNaN(n));
    const childs = childIndices.split(',').map(Number);
    const newList = vals.map((val, idx) => ({ val, child: childs[idx] === 0 ? null : childs[idx], next: idx+1 < vals.length ? idx+1 : null }));
    setList(newList);
  };

  const generateSteps = (nodes) => {
    const steps = [];
    const stack = [0];
    const result = [];
    let prev = -1;
    steps.push({ nodes, stack: [...stack], result: [...result], description: "Start flattening: push head onto stack", pseudocodeLine: 4 });
    while (stack.length) {
      const nodeIdx = stack.pop();
      result.push(nodeIdx);
      if (nodes[nodeIdx].next !== null) stack.push(nodes[nodeIdx].next);
      if (nodes[nodeIdx].child !== null) stack.push(nodes[nodeIdx].child);
      steps.push({
        nodes,
        stack: [...stack],
        result: [...result],
        highlight: nodeIdx,
        description: `Pop node ${nodeIdx} (val ${nodes[nodeIdx].val}), push next (${nodes[nodeIdx].next !== null ? nodes[nodeIdx].next : 'none'}) and child (${nodes[nodeIdx].child !== null ? nodes[nodeIdx].child : 'none'})`,
        pseudocodeLine: 6
      });
    }
    const flattenedOrder = result.map(i => nodes[i].val);
    steps.push({ nodes, result: flattenedOrder, description: `Flattened order: ${flattenedOrder.join(' → ')}` });
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

  const getBgColor = (idx) => {
    if (step.highlight === idx) return 'bg-yellow-500';
    if (step.result && step.result.includes(idx)) return 'bg-green-600';
    return 'bg-blue-500';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Flatten Multilevel Doubly Linked List</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: O(n)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: O(n)</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" placeholder="Values" />
        <input type="text" value={childIndices} onChange={(e) => setChildIndices(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" placeholder="Child indices (0 for none)" />
        <button onClick={updateList} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="overflow-x-auto">
            <div className="space-y-2 min-w-max">
              {step.nodes?.map((node, idx) => (
                <div key={idx} className={`p-2 rounded ${getBgColor(idx)}`}>
                  Node {idx}: val = {node.val}, child = {node.child !== null ? node.child : 'null'}, next = {node.next !== null ? node.next : 'null'}
                </div>
              ))}
            </div>
          </div>
          {step.result && (
            <div className="bg-[#1e1e1e] p-2 rounded overflow-x-auto">
              <p className="text-[#9cdcfe] whitespace-nowrap">Flattened order: {step.result.join(' → ')}</p>
            </div>
          )}
          {step.stack && (
            <div className="bg-[#1e1e1e] p-2 rounded">
              <p className="text-[#9cdcfe]">Stack (top first): [{step.stack.join(', ')}]</p>
            </div>
          )}

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

export default FlattenMultilevelList;