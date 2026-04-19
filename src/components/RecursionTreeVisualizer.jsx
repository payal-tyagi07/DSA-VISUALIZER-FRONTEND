// src/components/RecursionTreeVisualizer.jsx
import React, { useState, useEffect, useRef } from 'react';

const RecursionTreeVisualizer = ({ algorithm }) => {
  const [param, setParam] = useState(algorithm.defaultParam);
  const [steps, setSteps] = useState([]);
  const [tree, setTree] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const resultsMap = useRef(new Map());

  const parseParam = () => {
    if (algorithm.paramType === 'array') {
      try { return JSON.parse(param); } catch { return algorithm.defaultParam; }
    }
    if (algorithm.paramType === 'string') return param;
    return Number(param);
  };

  useEffect(() => {
    const parsed = parseParam();
    const { tree: t, steps: s, results } = algorithm.build(parsed);
    setTree(t);
    setSteps(s);
    resultsMap.current = results;
    setCurrentStep(0);
    setIsPlaying(false);
  }, [algorithm, param]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(prev => prev + 1), speed);
    } else if (currentStep === steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length, speed]);

  const handleStep = (newStep) => {
    setCurrentStep(Math.min(Math.max(0, newStep), steps.length - 1));
    if (newStep !== currentStep) setIsPlaying(false);
  };

  const renderTree = (node) => {
    const result = resultsMap.current.get(node);
    const isCurrent = node === steps[currentStep]?.node;
    const bgColor = isCurrent ? 'bg-yellow-800 border-yellow-400' : 'bg-gray-800 border-gray-600';
    return (
      <div key={node.id} className="flex flex-col items-center">
        <div className={`px-3 py-1 rounded-full border ${bgColor} text-white text-xs font-mono whitespace-nowrap`}>
          {node.label} {result !== undefined && `= ${result}`}
        </div>
        {node.children.length > 0 && (
          <div className="flex justify-center gap-4 mt-2">
            {node.children.map(child => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-px h-4 bg-gray-500"></div>
                {renderTree(child)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const currentCall = steps[currentStep];
  const isCall = currentCall?.type === 'call';
  const explanation = algorithm.explainStep 
    ? algorithm.explainStep(currentCall, resultsMap.current)
    : 'No explanation available.';

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl font-mono h-full overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-400">{algorithm.name}</h2>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-400">{algorithm.paramLabel}:</span>
          <input
            type={algorithm.paramType === 'array' ? 'text' : algorithm.paramType}
            value={param}
            onChange={(e) => setParam(e.target.value)}
            className="bg-gray-800 px-2 py-1 rounded text-white w-40"
            placeholder={algorithm.paramPlaceholder}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-black/40 p-4 rounded-lg overflow-x-auto">
          <div className="text-center text-sm text-gray-400 mb-2">Recursion Tree</div>
          <div className="min-w-max">{tree && renderTree(tree)}</div>
        </div>

        <div className="space-y-4">
          <div className="bg-black/40 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Current Step</div>
            <div className="text-lg font-bold">
              {isCall ? '📞 Calling' : '🔙 Returning from'} {currentCall?.node?.label}
            </div>
            <div className="text-xs text-gray-500 mt-1">Step {currentStep+1} of {steps.length}</div>
          </div>

          <div className="bg-black/40 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-2">Controls</div>
            <div className="flex gap-2 flex-wrap mb-3">
              <button onClick={() => handleStep(currentStep-1)} disabled={currentStep===0} className="px-3 py-1 bg-blue-600 rounded disabled:opacity-50">← Prev</button>
              <button onClick={() => handleStep(currentStep+1)} disabled={currentStep===steps.length-1} className="px-3 py-1 bg-blue-600 rounded disabled:opacity-50">Next →</button>
              <button onClick={() => setIsPlaying(!isPlaying)} disabled={currentStep===steps.length-1} className={`px-3 py-1 rounded ${currentStep===steps.length-1 ? 'bg-gray-600 cursor-not-allowed' : isPlaying ? 'bg-orange-600' : 'bg-green-600'}`}>{isPlaying ? '⏸️ Pause' : '▶️ Play'}</button>
              <button onClick={() => handleStep(0)} className="px-3 py-1 bg-gray-600 rounded">Reset</button>
            </div>
            <input type="range" min="0" max={steps.length-1} value={currentStep} onChange={(e) => handleStep(parseInt(e.target.value))} className="w-full" />
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs">Speed:</span>
              <input type="range" min="200" max="1500" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} className="w-32" />
              <span className="text-xs">{speed}ms</span>
            </div>
          </div>

          <div className="bg-black/40 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-2">📝 Pseudocode</div>
            <pre className="text-xs text-green-300 overflow-x-auto whitespace-pre-wrap">{algorithm.pseudocode}</pre>
          </div>

          <div className="bg-black/40 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-2">💡 Explanation</div>
            <div className="text-xs text-gray-300">{explanation}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecursionTreeVisualizer;