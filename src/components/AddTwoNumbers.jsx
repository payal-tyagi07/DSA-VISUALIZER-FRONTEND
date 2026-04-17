import React, { useState, useEffect } from 'react';

const getNodeAddress = (idx, base = 0x1000, step = 0x10) => `0x${(base + idx * step).toString(16).toUpperCase()}`;

const AddTwoNumbers = () => {
  const pseudocodeLines = [
    "procedure addTwoNumbers(l1, l2):",
    "  dummy = new Node(0)",
    "  current = dummy",
    "  carry = 0",
    "  while l1 or l2 or carry:",
    "    sum = carry",
    "    if l1: sum += l1.val; l1 = l1.next",
    "    if l2: sum += l2.val; l2 = l2.next",
    "    carry = Math.floor(sum / 10)",
    "    current.next = new Node(sum % 10)",
    "    current = current.next",
    "  return dummy.next"
  ];
  const [num1, setNum1] = useState([2,4,3]);
  const [num2, setNum2] = useState([5,6,4]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [input1, setInput1] = useState('2,4,3');
  const [input2, setInput2] = useState('5,6,4');

  const updateNumbers = () => {
    const newArr1 = input1.split(',').map(Number).filter(n => !isNaN(n));
    const newArr2 = input2.split(',').map(Number).filter(n => !isNaN(n));
    if (newArr1.length) setNum1(newArr1);
    if (newArr2.length) setNum2(newArr2);
  };

  const generateSteps = (arr1, arr2) => {
    const steps = [];
    let i = 0, j = 0, carry = 0;
    const result = [];
    steps.push({ arr1, arr2, i, j, carry, result, description: "Start addition", pseudocodeLine: 3 });
    while (i < arr1.length || j < arr2.length || carry) {
      const sum = carry + (i < arr1.length ? arr1[i] : 0) + (j < arr2.length ? arr2[j] : 0);
      carry = Math.floor(sum / 10);
      const digit = sum % 10;
      result.push(digit);
      steps.push({ arr1, arr2, i, j, carry, result, highlight1: i, highlight2: j, description: `Sum = ${sum}, carry = ${carry}, digit = ${digit}`, pseudocodeLine: 5 });
      if (i < arr1.length) i++;
      if (j < arr2.length) j++;
    }
    steps.push({ arr1, arr2, result, description: `Result: [${result.join(',')}] (represents ${result.reverse().join('')})`, pseudocodeLine: 10 });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(num1, num2));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [num1, num2]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  const getNodeStyle1 = (idx) => step.highlight1 === idx ? 'border-2 border-yellow-500 bg-yellow-900/30' : 'border border-gray-600 bg-[#1e1e1e]';
  const getNodeStyle2 = (idx) => step.highlight2 === idx ? 'border-2 border-yellow-500 bg-yellow-900/30' : 'border border-gray-600 bg-[#1e1e1e]';

  const renderList = (arr, styleFn, prefix, baseAddr) => (
    <div className="overflow-x-auto pb-2">
      <div className="flex flex-nowrap items-center justify-start gap-2 min-w-max">
        <div className="flex flex-col items-center mr-2">
          <div className="text-[#9cdcfe] text-sm font-bold">{prefix}</div>
          <div className="text-2xl">↓</div>
        </div>
        {arr?.map((val, idx) => (
          <div key={idx} className="flex items-center">
            <div className={`relative w-32 p-2 rounded ${styleFn(idx)} shadow-md`}>
              <div className="text-center text-sm text-gray-400">Data</div>
              <div className="text-center text-xl font-bold text-white">{val}</div>
              <div className="text-center text-xs text-gray-400 mt-1">Address</div>
              <div className="text-center text-xs font-mono text-[#ce9178]">{getNodeAddress(idx, baseAddr)}</div>
            </div>
            {idx < arr.length - 1 && <div className="text-gray-400 text-2xl mx-1">→</div>}
          </div>
        ))}
        {arr && arr.length > 0 && (
          <div className="flex items-center">
            <div className="text-gray-400 text-2xl mx-1">→</div>
            <div className="w-24 p-2 rounded border border-gray-600 bg-[#1e1e1e] text-center text-sm text-gray-400">Null</div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Add Two Numbers (Linked List)</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: O(max(m,n))</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: O(max(m,n))</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input type="text" value={input1} onChange={(e) => setInput1(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" />
        <input type="text" value={input2} onChange={(e) => setInput2(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" />
        <button onClick={updateNumbers} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          {renderList(step.arr1, getNodeStyle1, "Number 1 (reversed)", 0x1000)}
          {renderList(step.arr2, getNodeStyle2, "Number 2 (reversed)", 0x1100)}
          <div>
            <p className="text-[#9cdcfe]">Sum (reversed):</p>
            <div className="overflow-x-auto pb-2">
              <div className="flex flex-nowrap items-center justify-start gap-2 min-w-max">
                {step.result?.map((val, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-32 p-2 rounded border border-gray-600 bg-green-900/30 shadow-md">
                      <div className="text-center text-sm text-gray-400">Data</div>
                      <div className="text-center text-xl font-bold text-white">{val}</div>
                      <div className="text-center text-xs text-gray-400 mt-1">Address</div>
                      <div className="text-center text-xs font-mono text-[#ce9178]">{getNodeAddress(idx, 0x1200)}</div>
                    </div>
                    {idx < step.result.length - 1 && <div className="text-gray-400 text-2xl mx-1">→</div>}
                  </div>
                ))}
                {step.result && step.result.length > 0 && (
                  <div className="flex items-center">
                    <div className="text-gray-400 text-2xl mx-1">→</div>
                    <div className="w-24 p-2 rounded border border-gray-600 bg-[#1e1e1e] text-center text-sm text-gray-400">Null</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
            <p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>
          </div>

          {/* progress, speed, buttons (same) */}
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

export default AddTwoNumbers;