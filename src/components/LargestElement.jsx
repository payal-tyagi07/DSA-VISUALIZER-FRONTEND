import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (arr) => {
  const steps = [];
  let max = arr[0];
  steps.push({ array: arr, highlight: [0], description: `Start: max = ${max}`, pseudocodeLine: 1 });
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
      steps.push({ array: arr, highlight: [i], description: `${arr[i]} > max → new max = ${max}`, pseudocodeLine: 3 });
    } else {
      steps.push({ array: arr, highlight: [i], description: `${arr[i]} ≤ max → no change`, pseudocodeLine: 2 });
    }
  }
  steps.push({ array: arr, result: max, description: `Largest element = ${max}` });
  return steps;
};

export default createArrayVisualizer({
  title: "Largest Element in an Array",
  pseudocodeLines: [
    "procedure largestElement(arr):",
    "  max = arr[0]",
    "  for i = 1 to n-1:",
    "    if arr[i] > max: max = arr[i]",
    "  return max"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(1)' }
});