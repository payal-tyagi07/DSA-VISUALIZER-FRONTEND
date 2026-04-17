import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (arr, K = 10) => {
  const steps = [];
  let maxLen = 0;
  steps.push({ array: arr, description: `Find longest subarray with sum = ${K}`, pseudocodeLine: 1 });
  for (let i = 0; i < arr.length; i++) {
    let sum = 0;
    for (let j = i; j < arr.length; j++) {
      sum += arr[j];
      steps.push({ array: arr, highlight: [i, j], description: `Subarray [${i}..${j}] sum = ${sum}`, pseudocodeLine: 3 });
      if (sum === K && (j - i + 1) > maxLen) {
        maxLen = j - i + 1;
        steps.push({ array: arr, highlight: [i, j], description: `New max length = ${maxLen} (indices ${i} to ${j})`, pseudocodeLine: 4 });
      }
    }
  }
  steps.push({ array: arr, result: maxLen, description: `Longest subarray length = ${maxLen}` });
  return steps;
};

export default createArrayVisualizer({
  title: "Longest Subarray with Sum K",
  pseudocodeLines: [
    "procedure longestSubarraySum(arr, K):",
    "  maxLen = 0",
    "  for i = 0 to n-1:",
    "    sum = 0",
    "    for j = i to n-1:",
    "      sum += arr[j]",
    "      if sum == K: maxLen = max(maxLen, j-i+1)",
    "  return maxLen"
  ],
  generateSteps: (arr) => generateSteps(arr, 10),
  complexity: { time: 'O(n²)', space: 'O(1)' }
});