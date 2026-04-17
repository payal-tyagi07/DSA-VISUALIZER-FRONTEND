import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (arr) => {
  const steps = [];
  const n = arr.length;
  const freq = new Array(n+1).fill(0);
  steps.push({ array: arr, description: "Find repeating and missing numbers", pseudocodeLine: 1 });
  for (let i = 0; i < n; i++) {
    freq[arr[i]]++;
    steps.push({ array: arr, highlight: [i], description: `freq[${arr[i]}] = ${freq[arr[i]]}`, pseudocodeLine: 2 });
  }
  let repeating = -1, missing = -1;
  for (let i = 1; i <= n; i++) {
    if (freq[i] === 2) repeating = i;
    if (freq[i] === 0) missing = i;
    steps.push({ array: arr, description: `i=${i}: freq=${freq[i]} → ${freq[i]===2?'repeating':(freq[i]===0?'missing':'')}`, pseudocodeLine: 3 });
  }
  steps.push({ array: arr, result: [repeating, missing], description: `Repeating = ${repeating}, Missing = ${missing}` });
  return steps;
};

export default createArrayVisualizer({
  title: "Find Repeating and Missing Number",
  pseudocodeLines: [
    "procedure findMissingRepeating(arr):",
    "  n = length(arr)",
    "  freq = array of size n+1",
    "  for x in arr: freq[x]++",
    "  for i = 1 to n:",
    "    if freq[i] == 2: repeating = i",
    "    if freq[i] == 0: missing = i",
    "  return [repeating, missing]"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(n)' }
});