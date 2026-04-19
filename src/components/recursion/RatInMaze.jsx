import React, { useState, useEffect } from 'react';

const RatInMaze = () => {
  const pseudocodeLines = [
    "procedure findPath(maze):",
    "  n = len(maze)",
    "  visited = [[False]*n for _ in range(n)]",
    "  result = []",
    "  def dfs(x, y, path):",
    "    if x==n-1 and y==n-1:",
    "      result.append(path)",
    "      return",
    "    for dx,dy,dir in [(0,1,'R'),(1,0,'D'),(0,-1,'L'),(-1,0,'U')]:",
    "      nx,ny = x+dx, y+dy",
    "      if 0<=nx<n and 0<=ny<n and maze[nx][ny]==1 and not visited[nx][ny]:",
    "        visited[nx][ny] = True",
    "        dfs(nx,ny,path+dir)",
    "        visited[nx][ny] = False",
    "  visited[0][0] = True",
    "  dfs(0,0,'')",
    "  return result"
  ];

  const defaultMaze = [[1,0,0,0],[1,1,0,1],[0,1,0,0],[1,1,1,1]];
  const [maze, setMaze] = useState(defaultMaze.map(row => [...row]));
  const [inputStr, setInputStr] = useState(JSON.stringify(defaultMaze));
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);

  const updateMaze = () => {
    try { setMaze(JSON.parse(inputStr)); } catch(e) {}
  };

  const generateSteps = (startMaze) => {
    const steps = [];
    const n = startMaze.length;
    const visited = Array(n).fill().map(() => Array(n).fill(false));
    const result = [];
    const dfs = (x, y, path, depth = 0) => {
      // Store the current state before moving
      const visitedCopy = visited.map(row => [...row]);
      steps.push({
        type: 'enter',
        x, y, path,
        visited: visitedCopy,
        description: `🐭 Rat at (${x},${y}) → path: "${path}"`,
        pseudocodeLine: 5,
        depth
      });
      if (x === n-1 && y === n-1) {
        steps.push({
          type: 'found',
          path,
          description: `🎉 Destination reached! Path: "${path}"`,
          pseudocodeLine: 6,
          depth
        });
        result.push(path);
        steps.push({ type: 'return', description: `Return`, depth, pseudocodeLine: 7 });
        return;
      }
      const dirs = [[0,1,'R'],[1,0,'D'],[0,-1,'L'],[-1,0,'U']];
      for (const [dx, dy, dir] of dirs) {
        const nx = x+dx, ny = y+dy;
        if (nx>=0 && nx<n && ny>=0 && ny<n && startMaze[nx][ny]===1 && !visited[nx][ny]) {
          steps.push({
            type: 'try',
            from: {x,y}, to: {x:nx,y:ny}, dir,
            path: path+dir,
            description: `➡️ Try moving ${dir} to (${nx},${ny})`,
            pseudocodeLine: 9,
            depth: depth+1
          });
          visited[nx][ny] = true;
          dfs(nx, ny, path+dir, depth+1);
          steps.push({
            type: 'backtrack',
            from: {x:nx,y:ny},
            description: `↩️ Backtrack from (${nx},${ny})`,
            pseudocodeLine: 11,
            depth: depth+1
          });
          visited[nx][ny] = false;
        } else {
          if (nx>=0 && nx<n && ny>=0 && ny<n && startMaze[nx][ny]===1 && visited[nx][ny]) {
            steps.push({
              type: 'skip',
              to: {x:nx,y:ny},
              description: `🚫 Skip (${nx},${ny}) – already visited`,
              pseudocodeLine: 9,
              depth: depth+1
            });
          } else if (nx>=0 && nx<n && ny>=0 && ny<n && startMaze[nx][ny]===0) {
            steps.push({
              type: 'skip',
              to: {x:nx,y:ny},
              description: `🚫 Skip (${nx},${ny}) – blocked`,
              pseudocodeLine: 9,
              depth: depth+1
            });
          }
        }
      }
      steps.push({ type: 'return', description: `↩️ No more moves, backtrack`, depth, pseudocodeLine: 12 });
    };
    visited[0][0] = true;
    steps.push({ type: 'start', description: `🏁 Start at (0,0)`, pseudocodeLine: 13 });
    dfs(0, 0, '', 0);
    steps.push({
      type: 'result',
      result,
      description: `✅ All paths: ${result.join(', ')}`,
      pseudocodeLine: 14
    });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(maze));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [maze]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  // Helper to render the maze with rat at current position and visited cells highlighted
  const renderMaze = () => {
    if (!maze) return null;
    const n = maze.length;
    // Get visited cells from step (if available)
    const visited = step.visited || [];
    const ratX = step.x;
    const ratY = step.y;
    const currentPath = step.path || '';

    return (
      <div className="inline-block border border-gray-600 rounded overflow-hidden">
        {maze.map((row, i) => (
          <div key={i} className="flex">
            {row.map((cell, j) => {
              let bgColor = 'bg-gray-800';
              // Rat position
              if (ratX === i && ratY === j) bgColor = 'bg-yellow-600';
              // Visited cells (except current rat)
              else if (visited[i] && visited[i][j]) bgColor = 'bg-green-800';
              // Destination
              else if (i === n-1 && j === n-1 && cell === 1) bgColor = 'bg-purple-800';
              // Blocked
              else if (cell === 0) bgColor = 'bg-red-900';
              else bgColor = 'bg-gray-700';
              
              let icon = '';
              if (ratX === i && ratY === j) icon = '🐭';
              else if (i === n-1 && j === n-1 && cell === 1) icon = '⭐';
              else if (cell === 1) icon = '·';
              else icon = '█';
              
              return (
                <div key={j} className={`w-12 h-12 flex items-center justify-center text-xl font-bold border border-gray-700 ${bgColor}`}>
                  {icon}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Rat in a Maze</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ O(2^(n²))</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 O(n²)</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <label className="text-[#9cdcfe]">maze (2D array):</label>
        <input type="text" value={inputStr} onChange={(e) => setInputStr(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-80 text-xs" />
        <button onClick={updateMaze} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-black/40 p-4 rounded-lg overflow-x-auto">
            <div className="text-center text-sm text-gray-400 mb-2">Maze (🐭 = rat, ⭐ = destination, █ = wall)</div>
            <div className="flex justify-center">{renderMaze()}</div>
            {step.path && <div className="text-center text-xs text-green-400 mt-2">Current path: {step.path}</div>}
          </div>
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
            <p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>
            {step.result && <p className="mt-2 text-[#4ec9b0]">All paths: {step.result.join(', ')}</p>}
          </div>
          {/* progress bar, speed, buttons */}
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
            <button onClick={() => { setCurrentStep(Math.max(0, currentStep-1)); setIsPlaying(false); }} disabled={currentStep===0} className="px-6 py-3 rounded-lg bg-blue-600 disabled:opacity-50">← Prev</button>
            <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="px-6 py-3 rounded-lg bg-red-700">Reset</button>
            <button onClick={() => setIsPlaying(!isPlaying)} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg ${isPlaying ? 'bg-orange-600' : 'bg-green-600'}`}>{isPlaying ? '⏸️ Pause' : '▶️ Play'}</button>
            <button onClick={() => { setCurrentStep(Math.min(steps.length-1, currentStep+1)); setIsPlaying(false); }} disabled={currentStep===steps.length-1} className="px-6 py-3 rounded-lg bg-blue-600 disabled:opacity-50">Next →</button>
          </div>
        </div>
        <div className="lg:w-1/3 bg-[#0a0a0a] border border-[#222222] rounded-xl p-5 font-mono text-sm shadow-inner">
          <h3 className="text-lg font-bold text-[#569cd6] mb-4">📝 Pseudocode</h3>
          <div className="space-y-1">
            {pseudocodeLines.map((line, idx) => (
              <div key={idx} className={`px-3 py-1.5 rounded ${idx === step.pseudocodeLine ? 'bg-[#1a1a1a] text-[#d4d4d4] font-semibold border-l-4 border-[#569cd6]' : 'text-[#9cdcfe]'}`}>{line}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatInMaze;