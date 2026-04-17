import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (arr) => {
  const steps = [];
  if (arr.length <= 1) return [{ array: arr, result: arr, description: "No change" }];
  const first = arr[0];
  steps.push({ array: arr, description: `Store first element ${first}`, pseudocodeLine: 1 });
  for (let i = 1; i < arr.length; i++) {
    arr[i-1] = arr[i];
    steps.push({ array: [...arr], highlight: [i-1, i], description: `Shift arr[${i}] to arr[${i-1}]`, pseudocodeLine: 2 });
  }
  arr[arr.length-1] = first;
  steps.push({ array: arr, description: `Place stored first element at end → ${arr.join(',')}`, pseudocodeLine: 3 });
  steps.push({ array: arr, result: arr, description: "Left rotation by one complete" });
  return steps;
};

export default createArrayVisualizer({
  title: "Left Rotate by One",
  pseudocodeLines: [
    "procedure leftRotateByOne(arr):",
    "  temp = arr[0]",
    "  for i = 1 to n-1: arr[i-1] = arr[i]",
    "  arr[n-1] = temp"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(1)' }
});