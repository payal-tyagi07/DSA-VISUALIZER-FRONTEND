import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (arr) => {
  const steps = [];
  const n = arr.length;
  let expectedSum = (n * (n + 1)) / 2;
  let actualSum = 0;
  steps.push({ array: arr, description: `Array length = ${n}, expected sum 0..${n} = ${expectedSum}`, pseudocodeLine: 1 });
  for (let i = 0; i < n; i++) {
    actualSum += arr[i];
    steps.push({ array: arr, highlight: [i], description: `Add arr[${i}] = ${arr[i]}, current sum = ${actualSum}`, pseudocodeLine: 2 });
  }
  const missing = expectedSum - actualSum;
  steps.push({ array: arr, result: missing, description: `Missing number = ${expectedSum} - ${actualSum} = ${missing}` });
  return steps;
};

export default createArrayVisualizer({
  title: "Find Missing Number (0 to n)",
  pseudocodeLines: [
    "procedure missingNumber(arr):",
    "  n = length(arr)",
    "  expected = n*(n+1)/2",
    "  actual = sum(arr)",
    "  return expected - actual"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(1)' }
});