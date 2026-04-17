import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (arr, target = 5) => {
  const steps = [];
  steps.push({ array: arr, description: `Search for ${target}`, pseudocodeLine: 1 });
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      steps.push({ array: arr, highlight: [i], description: `Found ${target} at index ${i}`, pseudocodeLine: 3 });
      steps.push({ array: arr, result: i, description: `Element found at position ${i}` });
      return steps;
    } else {
      steps.push({ array: arr, highlight: [i], description: `${arr[i]} ≠ ${target} → continue`, pseudocodeLine: 2 });
    }
  }
  steps.push({ array: arr, result: -1, description: `${target} not found` });
  return steps;
};

export default createArrayVisualizer({
  title: "Linear Search",
  pseudocodeLines: [
    "procedure linearSearch(arr, target):",
    "  for i = 0 to n-1:",
    "    if arr[i] == target: return i",
    "  return -1"
  ],
  generateSteps: (arr) => generateSteps(arr, 5),
  complexity: { time: 'O(n)', space: 'O(1)' }
});