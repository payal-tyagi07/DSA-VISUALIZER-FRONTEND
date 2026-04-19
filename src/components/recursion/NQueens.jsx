import React, { useState, useEffect } from 'react';

const NQueens = () => {
  const pseudocodeLines = [
    "procedure solveNQueens(n):",
    "  result = []",
    "  board = [['.']*n for _ in range(n)]",
    "  def backtrack(row, cols, diag1, diag2):",
    "    if row == n:",
    "      result.append([''.join(row) for row in board])",
    "      return",
    "    for col in range(n):",
    "      if col in cols or (row-col) in diag1 or (row+col) in diag2:",
    "        continue",
    "      board[row][col] = 'Q'",
    "      backtrack(row+1, cols|{col}, diag1|{row-col}, diag2|{row+col})",
    "      board[row][col] = '.'",
    "  backtrack(0, set(), set(), set())",
    "  return result"
  ];

  const [n, setN] = useState(4);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const generateSteps = (size) => {
    const steps = [];
    const result = [];
    const board = Array(size).fill().map(() => Array(size).fill('.'));
    const cols = new Set();
    const diag1 = new Set();
    const diag2 = new Set();
    const backtrack = (row, depth = 0) => {
      const boardCopy = board.map(r => [...r]);
      steps.push({
        type: 'call',
        label: `backtrack(row=${row})`,
        description: `Trying to place queen at row ${row}`,
        pseudocodeLine: 4,
        depth,
        board: boardCopy
      });
      if (row === size) {
        const solution = board.map(r => r.join(''));
        steps.push({
          type: 'add',
          label: `solution ${solution.join(', ')}`,
          description: `Found solution: ${solution.join(', ')}`,
          pseudocodeLine: 5,
          depth,
          board: boardCopy
        });
        result.push(solution);
        steps.push({ type: 'return', label: 'return', description: `Return from solution`, depth, pseudocodeLine: 6 });
        return;
      }
      for (let col = 0; col < size; col++) {
        if (cols.has(col) || diag1.has(row-col) || diag2.has(row+col)) {
          steps.push({
            type: 'skip',
            label: `skip (${row},${col})`,
            description: `Column ${col} conflict, skip`,
            pseudocodeLine: 8,
            depth: depth+1,
            board: board.map(r => [...r])
          });
          continue;
        }
        steps.push({
          type: 'place',
          label: `place Q at (${row},${col})`,
          description: `Place queen at (${row},${col})`,
          pseudocodeLine: 10,
          depth: depth+1,
          board: board.map(r => [...r])
        });
        board[row][col] = 'Q';
        cols.add(col);
        diag1.add(row-col);
        diag2.add(row+col);
        backtrack(row+1, depth+1);
        steps.push({
          type: 'remove',
          label: `remove Q from (${row},${col})`,
          description: `Remove queen, backtrack`,
          pseudocodeLine: 12,
          depth: depth+1,
          board: board.map(r => [...r])
        });
        board[row][col] = '.';
        cols.delete(col);
        diag1.delete(row-col);
        diag2.delete(row+col);
      }
      steps.push({
        type: 'return',
        label: 'return',
        description: `No more columns, backtrack`,
        depth,
        pseudocodeLine: 13
      });
    };
    backtrack(0, 0);
    steps.push({
      type: 'result',
      description: `Total solutions: ${result.length}`,
      pseudocodeLine: 14
    });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(n));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [n]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  const renderBoard = (board) => {
    if (!board) return null;
    return (
      <div className="inline-block border border-gray-700 rounded overflow-hidden">
        {board.map((row, i) => (
          <div key={i} className="flex">
            {row.map((cell, j) => (
              <div key={j} className={`w-8 h-8 flex items-center justify-center text-lg font-bold border border-gray-700 ${cell === 'Q' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
                {cell === 'Q' ? '♕' : '·'}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">N‑Queens</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: O(n!)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: O(n²)</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <label className="text-[#9cdcfe]">n:</label>
        <input type="number" min="1" max="8" value={n} onChange={(e) => setN(Number(e.target.value))} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 focus:border-[#569cd6]" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-black/40 p-4 rounded-lg overflow-x-auto">
            <div className="text-center text-sm text-gray-400 mb-2">Board State</div>
            <div className="flex justify-center">{renderBoard(step.board)}</div>
          </div>
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
            <p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>
            {step.result !== undefined && <p className="mt-2 text-[#4ec9b0]">Total solutions: {step.result}</p>}
          </div>
          {/* progress, speed, buttons */}
          <div><div className="flex justify-between text-sm text-gray-400 mb-1"><span>Progress</span><span>{Math.round(((currentStep+1)/steps.length)*100)}%</span></div><div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden"><div className="bg-[#4ec9b0] h-3 rounded-full transition-all" style={{ width: `${((currentStep+1)/steps.length)*100}%` }}></div></div><div className="text-center text-xs text-gray-500 mt-1">Step {currentStep+1} of {steps.length}</div></div>
          <div className="flex items-center justify-center gap-4 bg-[#0d0d0d] p-3 rounded-lg"><span>⏱️ Speed:</span><input type="range" min="300" max="2000" value={speed} onChange={(e) => setSpeed(e.target.value)} className="w-48 md:w-64 accent-[#4ec9b0]" /><span className="bg-[#1a1a1a] px-3 py-1 rounded-full">{speed}ms</span></div>
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

export default NQueens;