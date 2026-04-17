import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (arr) => {
  const steps = [];
  if (arr.length === 0) return [{ array: arr, result: 0, description: "Empty array" }];
  let j = 0;
  steps.push({ array: arr, highlight: [0], description: "Start with first element as unique", pseudocodeLine: 1 });
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[j]) {
      j++;
      arr[j] = arr[i];
      steps.push({ array: [...arr], highlight: [i, j], description: `arr[${i}] = ${arr[i]} ≠ previous → move to index ${j}`, pseudocodeLine: 3 });
    } else {
      steps.push({ array: arr, highlight: [i], description: `arr[${i}] = ${arr[i]} equals previous → skip`, pseudocodeLine: 2 });
    }
  }
  steps.push({ array: arr.slice(0, j+1), result: j+1, description: `Unique count = ${j+1}, modified array: [${arr.slice(0, j+1).join(',')}]` });
  return steps;
};

export default createArrayVisualizer({
  title: "Remove Duplicates from Sorted Array",
  pseudocodeLines: [
    "procedure removeDuplicates(arr):",
    "  if n == 0: return 0",
    "  j = 0",
    "  for i = 1 to n-1:",
    "    if arr[i] != arr[j]:",
    "      j++; arr[j] = arr[i]",
    "  return j+1"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(1)' }
});