import React, { useState, useEffect } from 'react';

export const createTreeVisualizer = (config) => {
  const {
    title,
    pseudocodeLines,
    defaultTree = [1, 2, 3, 4, 5, 6, 7],
    generateSteps,
    complexity = { time: 'O(n)', space: 'O(n)' }
  } = config;

  return function TreeVisualizer() {
    const [tree, setTree] = useState(defaultTree);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1000);
    const [treeInput, setTreeInput] = useState(defaultTree.join(','));

    const updateTree = () => {
      const newArr = treeInput.split(',').map(x => Number(x.trim())).filter(n => !isNaN(n));
      if (newArr.length) setTree(newArr);
    };

    useEffect(() => {
      const newSteps = generateSteps(tree);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
    }, [tree]);

    useEffect(() => {
      let timer;
      if (isPlaying && currentStep < steps.length - 1) {
        timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
      } else if (currentStep === steps.length - 1) setIsPlaying(false);
      return () => clearTimeout(timer);
    }, [isPlaying, currentStep, speed, steps.length]);

    const step = steps[currentStep] || {};

    const renderNode = (idx, x, y, level) => {
      if (idx >= tree.length || tree[idx] === null) return null;
      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;
      const isHighlighted = step.highlight?.includes(idx);
      const isResult = step.result === idx;
      return (
        <g key={idx}>
          {leftIdx < tree.length && tree[leftIdx] !== null && (
            <line x1={x} y1={y} x2={x - 40 / (level + 1)} y2={y + 60} stroke="#555" strokeWidth="2" />
          )}
          {rightIdx < tree.length && tree[rightIdx] !== null && (
            <line x1={x} y1={y} x2={x + 40 / (level + 1)} y2={y + 60} stroke="#555" strokeWidth="2" />
          )}
          <circle cx={x} cy={y} r="24" fill={isResult ? '#22c55e' : (isHighlighted ? '#eab308' : '#3b82f6')} stroke="#222" strokeWidth="2" />
          <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">{tree[idx]}</text>
          {renderNode(leftIdx, x - 40 / (level + 1), y + 60, level + 1)}
          {renderNode(rightIdx, x + 40 / (level + 1), y + 60, level + 1)}
        </g>
      );
    };

    return (
      <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-[#569cd6] mb-2">{title}</h2>
          <div className="flex justify-center gap-4 mb-4">
            <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: {complexity.time}</span>
            <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: {complexity.space}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 focus:border-[#569cd6]" />
          <button onClick={updateTree} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-6">
            <div className="overflow-x-auto mb-6">
              <svg width="800" height="400" viewBox="0 0 800 400" className="mx-auto">
                {renderNode(0, 400, 40, 0)}
              </svg>
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
};