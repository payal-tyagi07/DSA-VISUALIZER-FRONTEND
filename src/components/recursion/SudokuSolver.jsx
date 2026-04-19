import React, { useState, useEffect } from 'react';

const SudokuSolver = () => {
  const pseudocodeLines = [
    "procedure solveSudoku(board):",
    "  def backtrack():",
    "    for i in 0..8:",
    "      for j in 0..8:",
    "        if board[i][j] == '.':",
    "          for num in '1'..'9':",
    "            if isValid(i,j,num):",
    "              board[i][j] = num",
    "              if backtrack(): return true",
    "              board[i][j] = '.'",
    "          return false",
    "    return true",
    "  backtrack()",
    "  return board"
  ];

  const defaultBoard = [
    ['5','3','.','.','7','.','.','.','.'],
    ['6','.','.','1','9','5','.','.','.'],
    ['.','9','8','.','.','.','.','6','.'],
    ['8','.','.','.','6','.','.','.','3'],
    ['4','.','.','8','.','3','.','.','1'],
    ['7','.','.','.','2','.','.','.','6'],
    ['.','6','.','.','.','.','2','8','.'],
    ['.','.','.','4','1','9','.','.','5'],
    ['.','.','.','.','8','.','.','7','9']
  ];
  const [board, setBoard] = useState(defaultBoard.map(row => [...row]));
  const [inputStr, setInputStr] = useState(JSON.stringify(defaultBoard));
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);

  const updateBoard = () => {
    try { setBoard(JSON.parse(inputStr)); } catch(e) {}
  };

  const isValid = (board, row, col, num) => {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) return false;
      if (board[i][col] === num) return false;
      const br = 3 * Math.floor(row/3) + Math.floor(i/3);
      const bc = 3 * Math.floor(col/3) + i % 3;
      if (board[br][bc] === num) return false;
    }
    return true;
  };

  const generateSteps = (startBoard) => {
    const steps = [];
    const boardCopy = startBoard.map(row => [...row]);
    const backtrack = (depth = 0) => {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (boardCopy[i][j] === '.') {
            for (let num = 1; num <= 9; num++) {
              const ch = num.toString();
              if (isValid(boardCopy, i, j, ch)) {
                steps.push({
                  type: 'place',
                  row: i, col: j, num: ch,
                  board: boardCopy.map(r => [...r]),
                  description: `Try ${ch} at (${i},${j})`,
                  pseudocodeLine: 7,
                  depth
                });
                boardCopy[i][j] = ch;
                if (backtrack(depth+1)) {
                  steps.push({
                    type: 'solved',
                    board: boardCopy.map(r => [...r]),
                    description: `Sudoku solved!`,
                    pseudocodeLine: 8,
                    depth
                  });
                  return true;
                }
                steps.push({
                  type: 'backtrack',
                  row: i, col: j, num: ch,
                  board: boardCopy.map(r => [...r]),
                  description: `Backtrack: remove ${ch} from (${i},${j})`,
                  pseudocodeLine: 9,
                  depth
                });
                boardCopy[i][j] = '.';
              } else {
                steps.push({
                  type: 'skip',
                  row: i, col: j, num: ch,
                  description: `Skip ${ch} at (${i},${j}) – invalid`,
                  pseudocodeLine: 7,
                  depth
                });
              }
            }
            steps.push({
              type: 'nooption',
              row: i, col: j,
              description: `No valid number for (${i},${j}), backtrack`,
              pseudocodeLine: 10,
              depth
            });
            return false;
          }
        }
      }
      return true;
    };
    backtrack(0);
    steps.push({
      type: 'result',
      board: boardCopy.map(r => [...r]),
      description: `Final solved board`,
      pseudocodeLine: 12
    });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(board));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [board]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  const renderSudoku = (boardState) => {
    if (!boardState) return null;
    return (
      <div className="inline-block border-2 border-gray-600 rounded overflow-hidden">
        {boardState.map((row, i) => (
          <div key={i} className="flex">
            {row.map((cell, j) => (
              <div key={j} className={`w-10 h-10 flex items-center justify-center text-lg font-bold border border-gray-700 ${(i===step.row && j===step.col) ? 'bg-yellow-800' : (cell !== '.' ? 'text-[#4ec9b0]' : 'text-gray-500')}`}>
                {cell !== '.' ? cell : '·'}
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
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Sudoku Solver</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: O(9^(n²))</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: O(n²)</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <label className="text-[#9cdcfe]">board (JSON):</label>
        <input type="text" value={inputStr} onChange={(e) => setInputStr(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-96 text-xs" />
        <button onClick={updateBoard} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-black/40 p-4 rounded-lg overflow-x-auto">
            <div className="text-center text-sm text-gray-400 mb-2">Sudoku Board</div>
            <div className="flex justify-center">{renderSudoku(step.board)}</div>
          </div>
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
            <p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>
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

export default SudokuSolver;