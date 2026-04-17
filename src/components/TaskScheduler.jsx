import React, { useState, useEffect } from 'react';

const TaskScheduler = () => {
  const pseudocodeLines = [
    "procedure leastInterval(tasks, n):",
    "  freq = count of each task",
    "  maxHeap = max heap of frequencies",
    "  cycles = 0",
    "  while maxHeap:",
    "    temp = []",
    "    for i = 0 to n:",
    "      if maxHeap:",
    "        freq = maxHeap.pop()",
    "        if freq > 1: temp.push(freq-1)",
    "        cycles++",
    "      else:",
    "        if temp: cycles++",
    "        else: break",
    "    for f in temp: maxHeap.push(f)",
    "  return cycles"
  ];

  const [tasks, setTasks] = useState(['A','A','A','B','B','B']);
  const [n, setN] = useState(2);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [input, setInput] = useState('A,A,A,B,B,B');
  const [nInput, setNInput] = useState('2');

  const update = () => {
    const arr = input.split(',').map(s => s.trim());
    setTasks(arr);
    setN(Number(nInput));
  };

  const generateSteps = (tasksArr, cooling) => {
    const steps = [];
    const freq = new Map();
    for (let t of tasksArr) freq.set(t, (freq.get(t)||0)+1);
    let maxHeap = Array.from(freq.values()).sort((a,b)=>b-a);
    steps.push({ freq: Array.from(freq.entries()), heap: [...maxHeap], n: cooling, description: "Count frequencies and build max heap", pseudocodeLine: 1 });
    let cycles = 0;
    while (maxHeap.length) {
      const temp = [];
      let executed = 0;
      for (let i = 0; i <= cooling; i++) {
        if (maxHeap.length) {
          const f = maxHeap.shift();
          if (f > 1) temp.push(f-1);
          executed++;
          steps.push({ heap: [...maxHeap], temp: [...temp], cycles: cycles+executed, description: `Execute task (remaining freq ${f-1}), cycles = ${cycles+executed}`, pseudocodeLine: 3 });
        } else {
          if (temp.length) {
            executed++;
            steps.push({ heap: [...maxHeap], temp: [...temp], cycles: cycles+executed, description: `Idle slot (cooling), cycles = ${cycles+executed}`, pseudocodeLine: 4 });
          } else break;
        }
      }
      cycles += executed;
      maxHeap.push(...temp);
      maxHeap.sort((a,b)=>b-a);
      steps.push({ heap: [...maxHeap], cycles, description: `End of cycle, total cycles = ${cycles}`, pseudocodeLine: 5 });
    }
    steps.push({ result: cycles, description: `Minimum intervals = ${cycles}`, pseudocodeLine: 6 });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(tasks, n));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [tasks, n]);

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
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Task Scheduler</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(n log k)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(k)</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" placeholder="Tasks, comma separated" />
        <input type="number" value={nInput} onChange={(e) => setNInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-20" min="0" />
        <button onClick={update} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div>
            <div className="text-sm text-[#9cdcfe] mb-1">Frequencies</div>
            <div className="flex gap-2 flex-wrap">
              {step.freq?.map(([task, count]) => (
                <div key={task} className="bg-[#1e1e1e] p-2 rounded">{task}: {count}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm text-[#9cdcfe] mb-1">Max Heap (frequencies)</div>
            <div className="flex gap-1">
              {step.heap?.map((val, idx) => (
                <div key={idx} className="w-12 h-12 flex items-center justify-center text-lg font-mono rounded border bg-green-500 text-white border-[#3c3c3c]">{val}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm text-[#9cdcfe] mb-1">Temp storage (remaining after execution)</div>
            <div className="flex gap-1">
              {step.temp?.map((val, idx) => (
                <div key={idx} className="w-12 h-12 flex items-center justify-center text-lg font-mono rounded border bg-orange-500 text-white border-[#3c3c3c]">{val}</div>
              ))}
            </div>
          </div>
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
            <p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>
            {step.result !== undefined && <p className="text-[#4ec9b0] mt-2">Minimum intervals = {step.result}</p>}
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

export default TaskScheduler;