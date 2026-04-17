import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (arr, d = 2) => {
  const steps = [];
  const n = arr.length;
  d = d % n;
  if (d === 0) return [{ array: arr, result: arr, description: "No rotation needed" }];
  steps.push({ array: arr, description: `Rotate left by ${d} positions`, pseudocodeLine: 0 });
  // Reverse first d elements
  let left = 0, right = d-1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    steps.push({ array: [...arr], highlight: [left, right], description: `Reverse first ${d} elements: swap ${arr[left]} and ${arr[right]}`, pseudocodeLine: 2 });
    left++; right--;
  }
  // Reverse remaining n-d elements
  left = d; right = n-1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    steps.push({ array: [...arr], highlight: [left, right], description: `Reverse remaining: swap ${arr[left]} and ${arr[right]}`, pseudocodeLine: 3 });
    left++; right--;
  }
  // Reverse entire array
  left = 0; right = n-1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    steps.push({ array: [...arr], highlight: [left, right], description: `Reverse whole array: swap ${arr[left]} and ${arr[right]}`, pseudocodeLine: 4 });
    left++; right--;
  }
  steps.push({ array: arr, result: arr, description: `Final rotated array: [${arr.join(',')}]` });
  return steps;
};

export default createArrayVisualizer({
  title: "Left Rotate by D Positions",
  pseudocodeLines: [
    "procedure leftRotate(arr, d):",
    "  reverse(arr, 0, d-1)",
    "  reverse(arr, d, n-1)",
    "  reverse(arr, 0, n-1)"
  ],
  generateSteps: (arr) => generateSteps([...arr], 2),
  complexity: { time: 'O(n)', space: 'O(1)' }
});