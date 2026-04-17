import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (arr) => {
  const steps = [];
  let lastNonZero = 0;
  steps.push({ array: arr, description: "Move all zeros to end", pseudocodeLine: 1 });
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) {
      [arr[lastNonZero], arr[i]] = [arr[i], arr[lastNonZero]];
      steps.push({ array: [...arr], highlight: [i, lastNonZero], description: `Swap non‑zero ${arr[lastNonZero]} with zero at ${i}`, pseudocodeLine: 3 });
      lastNonZero++;
    } else {
      steps.push({ array: arr, highlight: [i], description: `Element ${arr[i]} is zero → skip`, pseudocodeLine: 2 });
    }
  }
  steps.push({ array: arr, result: arr, description: `Zeros moved to end: [${arr.join(',')}]` });
  return steps;
};

export default createArrayVisualizer({
  title: "Move Zeros to End",
  pseudocodeLines: [
    "procedure moveZeros(arr):",
    "  lastNonZero = 0",
    "  for i = 0 to n-1:",
    "    if arr[i] != 0:",
    "      swap(arr[lastNonZero], arr[i]); lastNonZero++"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(1)' }
});