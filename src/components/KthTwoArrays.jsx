import React, { useState, useEffect } from 'react';

const KthTwoArrays = () => {
  const pseudocodeLines = [
    "procedure kthElement(nums1, nums2, k):",
    "  if len(nums1) > len(nums2): swap",
    "  m, n = len(nums1), len(nums2)",
    "  low = max(0, k-n), high = min(k, m)",
    "  while low <= high:",
    "    partition1 = floor((low + high) / 2)",
    "    partition2 = k - partition1",
    "    maxLeft1 = (partition1 == 0) ? -∞ : nums1[partition1-1]",
    "    minRight1 = (partition1 == m) ? ∞ : nums1[partition1]",
    "    maxLeft2 = (partition2 == 0) ? -∞ : nums2[partition2-1]",
    "    minRight2 = (partition2 == n) ? ∞ : nums2[partition2]",
    "    if maxLeft1 <= minRight2 and maxLeft2 <= minRight1:",
    "      return max(maxLeft1, maxLeft2)",
    "    else if maxLeft1 > minRight2: high = partition1 - 1",
    "    else: low = partition1 + 1",
    "  return 0"
  ];

  const [array1Input, setArray1Input] = useState('1,3,8');
  const [array2Input, setArray2Input] = useState('7,9,10,11');
  const [kInput, setKInput] = useState('3');
  const [array1, setArray1] = useState([]);
  const [array2, setArray2] = useState([]);
  const [k, setK] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const updateInputs = () => {
    const arr1Str = array1Input.split(',').map(s => s.trim()).filter(s => s !== '');
    const arr2Str = array2Input.split(',').map(s => s.trim()).filter(s => s !== '');
    const newArray1 = arr1Str.map(Number).filter(n => !isNaN(n));
    const newArray2 = arr2Str.map(Number).filter(n => !isNaN(n));
    const newK = Number(kInput);
    if (newArray1.length === 0 || newArray2.length === 0 || isNaN(newK)) return;
    setArray1(newArray1);
    setArray2(newArray2);
    setK(newK);
  };

  const generateSteps = (nums1, nums2, k) => {
    if (nums1.length > nums2.length) [nums1, nums2] = [nums2, nums1];
    const m = nums1.length;
    const n = nums2.length;
    const steps = [];
    let low = Math.max(0, k - n);
    let high = Math.min(k, m);
    let result = null;

    steps.push({
      array1: nums1,
      array2: nums2,
      low,
      high,
      partition1: null,
      partition2: null,
      maxLeft1: null,
      minRight1: null,
      maxLeft2: null,
      minRight2: null,
      result: null,
      description: `Find ${k}th element. low=${low}, high=${high}`,
      pseudocodeLine: 3
    });

    while (low <= high) {
      const partition1 = Math.floor((low + high) / 2);
      const partition2 = k - partition1;

      const maxLeft1 = partition1 === 0 ? -Infinity : nums1[partition1 - 1];
      const minRight1 = partition1 === m ? Infinity : nums1[partition1];
      const maxLeft2 = partition2 === 0 ? -Infinity : nums2[partition2 - 1];
      const minRight2 = partition2 === n ? Infinity : nums2[partition2];

      steps.push({
        array1: nums1,
        array2: nums2,
        low,
        high,
        partition1,
        partition2,
        maxLeft1,
        minRight1,
        maxLeft2,
        minRight2,
        result: null,
        description: `p1=${partition1}, p2=${partition2} | L1=${maxLeft1}, R1=${minRight1} | L2=${maxLeft2}, R2=${minRight2}`,
        pseudocodeLine: 5
      });

      if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
        const candidate = Math.max(maxLeft1, maxLeft2);
        result = candidate;
        steps.push({
          array1: nums1,
          array2: nums2,
          low,
          high,
          partition1,
          partition2,
          maxLeft1,
          minRight1,
          maxLeft2,
          minRight2,
          result,
          description: `Found: ${k}th element = max(${maxLeft1}, ${maxLeft2}) = ${candidate}`,
          pseudocodeLine: 7
        });
        break;
      } else if (maxLeft1 > minRight2) {
        high = partition1 - 1;
        steps.push({
          array1: nums1,
          array2: nums2,
          low,
          high,
          partition1,
          partition2,
          maxLeft1,
          minRight1,
          maxLeft2,
          minRight2,
          result: null,
          description: `L1 > R2 → move left, high = ${high}`,
          pseudocodeLine: 8
        });
      } else {
        low = partition1 + 1;
        steps.push({
          array1: nums1,
          array2: nums2,
          low,
          high,
          partition1,
          partition2,
          maxLeft1,
          minRight1,
          maxLeft2,
          minRight2,
          result: null,
          description: `L2 > R1 → move right, low = ${low}`,
          pseudocodeLine: 9
        });
      }

      if (low <= high && result === null) {
        steps.push({
          array1: nums1,
          array2: nums2,
          low,
          high,
          partition1: null,
          partition2: null,
          maxLeft1: null,
          minRight1: null,
          maxLeft2: null,
          minRight2: null,
          result: null,
          description: `Now search partition1 in [${low}, ${high}]`,
          pseudocodeLine: 3
        });
      }
    }

    if (result === null) result = 0;
    return steps;
  };

  useEffect(() => {
    if (array1.length > 0 && array2.length > 0 && k !== null) {
      const newSteps = generateSteps(array1, array2, k);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [array1, array2, k]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  // Similar UI to MedianTwoArrays
  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl transition-all duration-300 font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Kth Element of Two Sorted Arrays</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: <span className="text-[#4ec9b0]">O(log(min(m,n)))</span></span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: <span className="text-[#4ec9b0]">O(1)</span></span>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); updateInputs(); }} className="flex flex-wrap justify-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-[#9cdcfe]">Array 1 (sorted):</label>
          <input type="text" value={array1Input} onChange={(e) => setArray1Input(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 focus:border-[#569cd6]" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[#9cdcfe]">Array 2 (sorted):</label>
          <input type="text" value={array2Input} onChange={(e) => setArray2Input(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 focus:border-[#569cd6]" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[#9cdcfe]">k (1‑based):</label>
          <input type="number" min="1" value={kInput} onChange={(e) => setKInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 focus:border-[#569cd6]" />
        </div>
        <button type="submit" className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </form>

      {steps.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-6">
            <div className="space-y-4">
              {/* Array 1 */}
              <div className="flex justify-center gap-3 flex-wrap">
                {step.array1?.map((num, idx) => (
                  <div key={`a1-${idx}`} className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl ${
                      step.partition1 === idx ? 'bg-yellow-500' : 'bg-blue-500'
                    } border-2 border-[#222222]`}>
                      {num}
                    </div>
                    <div className="text-xs mt-1 text-[#9cdcfe]">idx {idx}</div>
                  </div>
                ))}
              </div>
              {step.partition1 !== undefined && step.partition1 !== null && (
                <div className="text-center text-sm text-[#4ec9b0]">
                  partition1 = {step.partition1}
                </div>
              )}

              {/* Array 2 */}
              <div className="flex justify-center gap-3 flex-wrap">
                {step.array2?.map((num, idx) => (
                  <div key={`a2-${idx}`} className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl ${
                      step.partition2 === idx ? 'bg-yellow-500' : 'bg-blue-500'
                    } border-2 border-[#222222]`}>
                      {num}
                    </div>
                    <div className="text-xs mt-1 text-[#ce9178]">idx {idx}</div>
                  </div>
                ))}
              </div>
              {step.partition2 !== undefined && step.partition2 !== null && (
                <div className="text-center text-sm text-[#ce9178]">
                  partition2 = {step.partition2}
                </div>
              )}
            </div>

            <div className="flex justify-center gap-6 flex-wrap text-sm">
              <div className="flex items-center gap-2"><span className="w-4 h-4 bg-blue-500 rounded-full"></span>Element</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 bg-yellow-500 rounded-full"></span>Partition index</div>
            </div>

            <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
              <p className="text-gray-300">
                <span className="font-bold text-[#9cdcfe]">Step {currentStep + 1}:</span> {step.description}
              </p>
              {step.maxLeft1 !== undefined && step.maxLeft1 !== null && (
                <div className="mt-2 text-sm grid grid-cols-2 gap-2">
                  <div>maxLeft1 = {step.maxLeft1 === -Infinity ? '-∞' : step.maxLeft1}</div>
                  <div>minRight1 = {step.minRight1 === Infinity ? '∞' : step.minRight1}</div>
                  <div>maxLeft2 = {step.maxLeft2 === -Infinity ? '-∞' : step.maxLeft2}</div>
                  <div>minRight2 = {step.minRight2 === Infinity ? '∞' : step.minRight2}</div>
                </div>
              )}
              {step.result !== null && (
                <div className="mt-2 text-[#4ec9b0] font-bold">Kth element = {step.result}</div>
              )}
            </div>

            <div>
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Progress</span>
                <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden">
                <div className="bg-[#4ec9b0] h-3 rounded-full transition-all" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}></div>
              </div>
              <div className="text-center text-xs text-gray-500 mt-1">Step {currentStep + 1} of {steps.length}</div>
            </div>

            <div className="flex items-center justify-center gap-4 bg-[#0d0d0d] p-3 rounded-lg">
              <span>⏱️ Speed:</span>
              <input type="range" min="300" max="2000" value={speed} onChange={(e) => setSpeed(e.target.value)} className="w-48 md:w-64 accent-[#4ec9b0]" />
              <span className="bg-[#1a1a1a] px-3 py-1 rounded-full">{speed}ms</span>
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
              <button onClick={() => { setCurrentStep(Math.max(0, currentStep-1)); setIsPlaying(false); }} disabled={currentStep===0} className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 ${currentStep===0 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>← Prev</button>
              <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="px-6 py-3 bg-[#c2410c] hover:bg-[#b91c1c] text-white rounded-lg font-semibold hover:scale-105">Reset</button>
              <button onClick={() => setIsPlaying(!isPlaying)} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : isPlaying ? 'bg-[#ca5100] hover:bg-[#b74700] text-white' : 'bg-[#2e7d32] hover:bg-[#1e5f20] text-white'}`}>{isPlaying ? '⏸️ Pause' : '▶️ Play'}</button>
              <button onClick={() => { setCurrentStep(Math.min(steps.length-1, currentStep+1)); setIsPlaying(false); }} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>Next →</button>
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
      )}
    </div>
  );
};

export default KthTwoArrays;