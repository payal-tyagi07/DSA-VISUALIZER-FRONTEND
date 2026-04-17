// src/components/CoinChange.jsx
import React, { useState, useEffect } from 'react';
import DPArrayVisualizer from './DPArrayVisualizer';

const CoinChange = () => {
  const pseudocodeLines = [
    "procedure coinChange(coins, amount):",
    "  dp = array of size amount+1, fill with ∞",
    "  dp[0] = 0",
    "  for i = 1 to amount:",
    "    for coin in coins:",
    "      if coin <= i:",
    "        dp[i] = min(dp[i], dp[i-coin] + 1)",
    "  return dp[amount] == ∞ ? -1 : dp[amount]"
  ];
  const [coins, setCoins] = useState([1,2,5]);
  const [amount, setAmount] = useState(11);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [coinInput, setCoinInput] = useState('1,2,5');

  const updateCoins = () => {
    const arr = coinInput.split(',').map(Number).filter(n=>!isNaN(n));
    if (arr.length) setCoins(arr);
  };

  const generateSteps = (coins, amount) => {
    const steps = [];
    const dp = new Array(amount+1).fill(Infinity);
    dp[0] = 0;
    steps.push({ dp: [...dp], description: "Initialize dp[0]=0, others ∞", pseudocodeLine: 1 });
    for (let i = 1; i <= amount; i++) {
      for (const coin of coins) {
        if (coin <= i) {
          const newVal = dp[i-coin] + 1;
          if (newVal < dp[i]) {
            dp[i] = newVal;
            steps.push({ dp: [...dp], current: i, coin, description: `dp[${i}] = min(dp[${i}], dp[${i-coin}]+1) = ${dp[i]} (using coin ${coin})`, pseudocodeLine: 3 });
          } else {
            steps.push({ dp: [...dp], current: i, coin, description: `Check coin ${coin}: dp[${i-coin}]+1 = ${dp[i-coin]+1} (not better)`, pseudocodeLine: 3 });
          }
        }
      }
    }
    const result = dp[amount] === Infinity ? -1 : dp[amount];
    steps.push({ dp: [...dp], result, description: `Minimum coins needed = ${result}` });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(coins, amount));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [coins, amount]);

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
      <div className="text-center mb-6"><h2 className="text-3xl font-bold text-[#569cd6] mb-2">Coin Change (Minimum Coins)</h2><div className="flex justify-center gap-4 mb-4"><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(amount * coins)</span><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(amount)</span></div></div>
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input type="text" value={coinInput} onChange={(e) => setCoinInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" placeholder="coins, comma separated" />
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-24" />
        <button onClick={updateCoins} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <DPArrayVisualizer array={step.dp} labels={Array.from({length: step.dp?.length}, (_,i)=>i)} highlight={{ current: step.current, computed: step.current ? Array.from({length: step.current+1}, (_,i)=>i) : [] }} />
          {step.coin !== undefined && <div className="text-sm text-gray-400">Using coin: {step.coin}</div>}
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]"><p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>{step.result !== undefined && <p className="text-[#4ec9b0] mt-2">Result = {step.result}</p>}</div>
          {/* progress, speed, buttons (same) */}
          <div><div className="flex justify-between text-sm text-gray-400 mb-1"><span>Progress</span><span>{Math.round(((currentStep+1)/steps.length)*100)}%</span></div><div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden"><div className="bg-[#4ec9b0] h-3 rounded-full transition-all" style={{ width: `${((currentStep+1)/steps.length)*100}%` }}></div></div><div className="text-center text-xs text-gray-500 mt-1">Step {currentStep+1} of {steps.length}</div></div>
          <div className="flex items-center justify-center gap-4 bg-[#0d0d0d] p-3 rounded-lg"><span>⏱️ Speed:</span><input type="range" min="300" max="2000" value={speed} onChange={(e) => setSpeed(e.target.value)} className="w-48 md:w-64 accent-[#4ec9b0]" /><span className="bg-[#1a1a1a] px-3 py-1 rounded-full">{speed}ms</span></div>
          <div className="flex justify-center gap-4 flex-wrap">
            <button onClick={() => { setCurrentStep(Math.max(0, currentStep-1)); setIsPlaying(false); }} disabled={currentStep===0} className={`px-6 py-3 rounded-lg font-semibold transition-all ${currentStep===0 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>← Prev</button>
            <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="px-6 py-3 bg-[#c2410c] hover:bg-[#b91c1c] text-white rounded-lg">Reset</button>
            <button onClick={() => setIsPlaying(!isPlaying)} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg font-semibold ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : isPlaying ? 'bg-[#ca5100] hover:bg-[#b74700] text-white' : 'bg-[#2e7d32] hover:bg-[#1e5f20] text-white'}`}>{isPlaying ? '⏸️ Pause' : '▶️ Play'}</button>
            <button onClick={() => { setCurrentStep(Math.min(steps.length-1, currentStep+1)); setIsPlaying(false); }} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg font-semibold ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>Next →</button>
          </div>
        </div>
        <div className="lg:w-1/3 bg-[#0a0a0a] border border-[#222222] rounded-xl p-5 font-mono text-sm shadow-inner"><h3 className="text-lg font-bold text-[#569cd6] mb-4">📝 Pseudocode</h3><div className="space-y-1">{pseudocodeLines.map((line, idx) => (<div key={idx} className={`px-3 py-1.5 rounded transition-all duration-200 ${idx === step.pseudocodeLine ? 'bg-[#1a1a1a] text-[#d4d4d4] font-semibold border-l-4 border-[#569cd6]' : 'text-[#9cdcfe] hover:bg-[#1a1a1a]'}`}>{line}</div>))}</div></div>
      </div>
    </div>
  );
};

export default CoinChange;