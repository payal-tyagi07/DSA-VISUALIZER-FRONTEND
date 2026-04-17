import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (arr) => {
  const steps = [];
  let maxLen = 0;
  let prefixSum = 0;
  const map = new Map();
  map.set(0, -1);
  steps.push({ array: arr, description: "Find longest subarray with sum 0", pseudocodeLine: 1 });

  for (let i = 0; i < arr.length; i++) {
    prefixSum += arr[i];
    steps.push({ array: arr, highlight: [i], description: `prefixSum[${i}] = ${prefixSum}`, pseudocodeLine: 3 });
    if (map.has(prefixSum)) {
      const len = i - map.get(prefixSum);
      if (len > maxLen) {
        maxLen = len;
        steps.push({ array: arr, highlight: Array.from({ length: len }, (_, k) => map.get(prefixSum)+1 + k), description: `New max length = ${maxLen} (from index ${map.get(prefixSum)+1} to ${i})`, pseudocodeLine: 5 });
      }
    } else {
      map.set(prefixSum, i);
      steps.push({ array: arr, description: `Store prefixSum ${prefixSum} at index ${i}`, pseudocodeLine: 4 });
    }
  }
  steps.push({ array: arr, result: maxLen, description: `Longest subarray length = ${maxLen}` });
  return steps;
};

export default createArrayVisualizer({
  title: "Largest Subarray with 0 Sum",
  pseudocodeLines: [
    "procedure largestZeroSum(arr):",
    "  map = {0: -1}",
    "  sum = 0, maxLen = 0",
    "  for i = 0 to n-1:",
    "    sum += arr[i]",
    "    if sum in map: maxLen = max(maxLen, i - map[sum])",
    "    else: map[sum] = i",
    "  return maxLen"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(n)' }
});