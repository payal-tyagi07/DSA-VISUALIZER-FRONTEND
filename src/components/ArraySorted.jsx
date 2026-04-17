import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (arr) => {
  const steps = [];
  steps.push({ array: arr, description: "Check if array is sorted in non‑decreasing order", pseudocodeLine: 0 });
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i-1]) {
      steps.push({ array: arr, highlight: [i-1, i], description: `arr[${i-1}] = ${arr[i-1]} > arr[${i}] = ${arr[i]} → not sorted`, pseudocodeLine: 2 });
      steps.push({ array: arr, result: false, description: "Array is not sorted" });
      return steps;
    } else {
      steps.push({ array: arr, highlight: [i-1, i], description: `arr[${i-1}] = ${arr[i-1]} ≤ arr[${i}] = ${arr[i]} → OK`, pseudocodeLine: 1 });
    }
  }
  steps.push({ array: arr, result: true, description: "Array is sorted" });
  return steps;
};

export default createArrayVisualizer({
  title: "Check if Array is Sorted",
  pseudocodeLines: [
    "procedure isSorted(arr):",
    "  for i = 1 to n-1:",
    "    if arr[i] < arr[i-1]: return false",
    "  return true"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(1)' }
});