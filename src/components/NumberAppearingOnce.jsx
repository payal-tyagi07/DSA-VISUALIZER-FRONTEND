import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (arr) => {
  const steps = [];
  let xor = 0;
  steps.push({ array: arr, description: "XOR all numbers: duplicates cancel out", pseudocodeLine: 1 });
  for (let i = 0; i < arr.length; i++) {
    xor ^= arr[i];
    steps.push({ array: arr, highlight: [i], description: `XOR with ${arr[i]} → result = ${xor}`, pseudocodeLine: 2 });
  }
  steps.push({ array: arr, result: xor, description: `Number appearing once = ${xor}` });
  return steps;
};

export default createArrayVisualizer({
  title: "Number Appearing Once (others twice)",
  pseudocodeLines: [
    "procedure singleNumber(arr):",
    "  result = 0",
    "  for x in arr: result ^= x",
    "  return result"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(1)' }
});