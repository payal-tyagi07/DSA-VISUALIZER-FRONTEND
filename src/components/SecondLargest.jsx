import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (arr) => {
  const steps = [];
  let first = -Infinity, second = -Infinity;
  steps.push({ array: arr, description: "Initialize first = -∞, second = -∞", pseudocodeLine: 1 });
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > first) {
      second = first;
      first = arr[i];
      steps.push({ array: arr, highlight: [i], description: `${arr[i]} > first → update first = ${first}, second = ${second}`, pseudocodeLine: 3 });
    } else if (arr[i] > second && arr[i] !== first) {
      second = arr[i];
      steps.push({ array: arr, highlight: [i], description: `${arr[i]} > second → update second = ${second}`, pseudocodeLine: 4 });
    } else {
      steps.push({ array: arr, highlight: [i], description: `${arr[i]} ≤ second → skip`, pseudocodeLine: 5 });
    }
  }
  steps.push({ array: arr, result: second === -Infinity ? -1 : second, description: `Second largest = ${second === -Infinity ? -1 : second}` });
  return steps;
};

export default createArrayVisualizer({
  title: "Second Largest Element",
  pseudocodeLines: [
    "procedure secondLargest(arr):",
    "  first = second = -∞",
    "  for x in arr:",
    "    if x > first: second = first; first = x",
    "    else if x > second and x != first: second = x",
    "  return second"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(1)' }
});