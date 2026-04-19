import React, { useState, useEffect } from 'react';

const RecursionTree = ({ algorithm = 'factorial', n = 5 }) => {
  const [step, setStep] = useState(0);
  const [callStack, setCallStack] = useState([]);
  const [treeData, setTreeData] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [executing, setExecuting] = useState(false);

  // Build call tree for factorial
  const buildFactorialTree = (num) => {
    const createNode = (value, depth = 0) => {
      const node = {
        value,
        label: `factorial(${value})`,
        children: [],
        depth,
        result: null
      };
      if (value > 1) {
        node.children.push(createNode(value - 1, depth + 1));
      }
      return node;
    };
    return createNode(num);
  };

  // Build call tree for Fibonacci
  const buildFibonacciTree = (num) => {
    const createNode = (value, depth = 0) => {
      const node = {
        value,
        label: `fib(${value})`,
        children: [],
        depth,
        result: null
      };
      if (value > 1) {
        node.children.push(createNode(value - 1, depth + 1));
        node.children.push(createNode(value - 2, depth + 1));
      }
      return node;
    };
    return createNode(num);
  };

  // Generate linear steps for factorial (inorder traversal)
  const generateFactorialSteps = (node, steps = []) => {
    steps.push({ type: 'call', node });
    if (node.children.length > 0) {
      generateFactorialSteps(node.children[0], steps);
    }
    steps.push({ type: 'return', node });
    return steps;
  };

  // Generate steps for Fibonacci (preorder)
  const generateFibonacciSteps = (node, steps = []) => {
    steps.push({ type: 'call', node });
    for (const child of node.children) {
      generateFibonacciSteps(child, steps);
    }
    steps.push({ type: 'return', node });
    return steps;
  };

  useEffect(() => {
    let tree, steps;
    if (algorithm === 'factorial') {
      tree = buildFactorialTree(n);
      steps = generateFactorialSteps(tree);
    } else {
      tree = buildFibonacciTree(n);
      steps = generateFibonacciSteps(tree);
    }
    setTreeData({ tree, steps });
    setCallStack(steps);
    setStep(0);
    setCurrentNode(steps[0]?.node);
    setExecuting(false);
  }, [algorithm, n]);

  const handleStep = (newStep) => {
    if (!callStack.length) return;
    const idx = Math.min(Math.max(0, newStep), callStack.length - 1);
    setStep(idx);
    setCurrentNode(callStack[idx].node);
    // highlight the node
  };

  const handlePlay = () => {
    setExecuting(true);
    let i = step;
    const interval = setInterval(() => {
      if (i >= callStack.length - 1) {
        clearInterval(interval);
        setExecuting(false);
      } else {
        i++;
        setStep(i);
        setCurrentNode(callStack[i].node);
      }
    }, 800);
    return () => clearInterval(interval);
  };

  const handleReset = () => handleStep(0);

  // Compute result for each node (for display)
  const computeResults = (node, resultsMap) => {
    if (node.value <= 1) {
      resultsMap.set(node, node.value);
      return node.value;
    }
    let res;
    if (algorithm === 'factorial') {
      const childRes = computeResults(node.children[0], resultsMap);
      res = node.value * childRes;
    } else {
      const leftRes = computeResults(node.children[0], resultsMap);
      const rightRes = computeResults(node.children[1], resultsMap);
      res = leftRes + rightRes;
    }
    resultsMap.set(node, res);
    return res;
  };

  const resultsMap = new Map();
  if (treeData?.tree) {
    computeResults(treeData.tree, resultsMap);
  }

  // Render tree as nested divs (simpler than canvas)
  const renderTree = (node, isCurrent) => {
    const result = resultsMap.get(node);
    const bgColor = isCurrent ? 'bg-yellow-800 border-yellow-400' : 'bg-gray-800 border-gray-600';
    return (
      <div key={node.label} className="flex flex-col items-center">
        <div className={`px-3 py-1 rounded-full border ${bgColor} text-white text-xs font-mono`}>
          {node.label} = {result !== undefined ? result : '?'}
        </div>
        {node.children.length > 0 && (
          <div className="flex justify-center gap-6 mt-2">
            {node.children.map(child => (
              <div key={child.label} className="flex flex-col items-center">
                <div className="w-px h-4 bg-gray-500"></div>
                {renderTree(child, child === currentNode)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const currentCall = callStack[step];
  const isCall = currentCall?.type === 'call';

  // Pseudocode for factorial
  const pseudocode = algorithm === 'factorial' ? `
function factorial(n):
    if n <= 1:
        return 1
    else:
        return n * factorial(n-1)
  ` : `
function fib(n):
    if n <= 1:
        return n
    else:
        return fib(n-1) + fib(n-2)
  `;

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl font-mono h-full overflow-auto">
      <h2 className="text-2xl font-bold text-blue-400 mb-4">
        {algorithm === 'factorial' ? 'Factorial Recursion' : 'Fibonacci Recursion'}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Tree Visualization */}
        <div className="lg:col-span-2 bg-black/40 p-4 rounded-lg overflow-x-auto">
          <div className="text-center text-sm text-gray-400 mb-2">Recursion Call Tree</div>
          <div className="min-w-max">
            {treeData && renderTree(treeData.tree, false)}
          </div>
        </div>

        {/* Right: Controls + Pseudocode */}
        <div className="space-y-4">
          <div className="bg-black/40 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Current Step</div>
            <div className="text-lg font-bold">
              {isCall ? 'Calling' : 'Returning from'} {currentCall?.node?.label}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Step {step+1} of {callStack.length}
            </div>
          </div>

          <div className="bg-black/40 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-2">Execution Controls</div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => handleStep(step-1)} disabled={step===0} className="px-3 py-1 bg-blue-600 rounded disabled:opacity-50">← Prev</button>
              <button onClick={() => handleStep(step+1)} disabled={step===callStack.length-1} className="px-3 py-1 bg-blue-600 rounded disabled:opacity-50">Next →</button>
              <button onClick={handlePlay} disabled={executing || step===callStack.length-1} className="px-3 py-1 bg-green-600 rounded">▶ Play</button>
              <button onClick={handleReset} className="px-3 py-1 bg-gray-600 rounded">Reset</button>
            </div>
            <input
              type="range"
              min="0"
              max={callStack.length-1}
              value={step}
              onChange={(e) => handleStep(parseInt(e.target.value))}
              className="w-full mt-3"
            />
          </div>

          <div className="bg-black/40 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-2">Pseudocode</div>
            <pre className="text-xs text-green-300 overflow-x-auto whitespace-pre-wrap">
              {pseudocode}
            </pre>
          </div>

          <div className="bg-black/40 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-2">Explanation</div>
            <div className="text-xs text-gray-300">
              {isCall ? (
                <>Pushing <span className="text-yellow-300">{currentCall?.node?.label}</span> onto the call stack. Waiting for its result.</>
              ) : (
                <>Returning from <span className="text-yellow-300">{currentCall?.node?.label}</span> with value <span className="text-green-300">{resultsMap.get(currentCall?.node)}</span>.</>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecursionTree;