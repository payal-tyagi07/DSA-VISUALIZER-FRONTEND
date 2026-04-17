import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (arr) => {
  const steps = [];
  const n = arr.length;
  let currentArr = [...arr];
  steps.push({ array: currentArr, description: "Find next lexicographical permutation", pseudocodeLine: 1 });
  // Step 1: find first decreasing element from right
  let i = n - 2;
  while (i >= 0 && currentArr[i] >= currentArr[i+1]) i--;
  if (i >= 0) {
    steps.push({ array: currentArr, highlight: [i], description: `Pivot at index ${i} (value ${currentArr[i]})`, pseudocodeLine: 2 });
    // Step 2: find element just larger than pivot from right
    let j = n - 1;
    while (currentArr[j] <= currentArr[i]) j--;
    steps.push({ array: currentArr, highlight: [i, j], description: `Swap ${currentArr[i]} with ${currentArr[j]}`, pseudocodeLine: 3 });
    [currentArr[i], currentArr[j]] = [currentArr[j], currentArr[i]];
    steps.push({ array: [...currentArr], description: `After swap: [${currentArr.join(',')}]`, pseudocodeLine: 4 });
  } else {
    steps.push({ array: currentArr, description: "Array is descending → next is ascending", pseudocodeLine: 5 });
  }
  // Step 3: reverse suffix from i+1 to end
  let left = i + 1, right = n - 1;
  while (left < right) {
    [currentArr[left], currentArr[right]] = [currentArr[right], currentArr[left]];
    steps.push({ array: [...currentArr], highlight: [left, right], description: `Reverse suffix: swap ${currentArr[left]} and ${currentArr[right]}`, pseudocodeLine: 6 });
    left++; right--;
  }
  steps.push({ array: currentArr, result: currentArr, description: `Next permutation: [${currentArr.join(',')}]` });
  return steps;
};

export default createArrayVisualizer({
  title: "Next Permutation",
  pseudocodeLines: [
    "procedure nextPermutation(arr):",
    "  i = n-2; while i>=0 and arr[i]>=arr[i+1]: i--",
    "  if i>=0:",
    "    j = n-1; while arr[j]<=arr[i]: j--",
    "    swap(arr[i], arr[j])",
    "  reverse(arr, i+1, n-1)"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(1)' }
});