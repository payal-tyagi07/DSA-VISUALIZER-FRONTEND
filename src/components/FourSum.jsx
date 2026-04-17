import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (arr, target = 0) => {
  const steps = [];
  const sorted = [...arr].sort((a,b) => a-b);
  const result = [];
  steps.push({ array: sorted, description: `Find quadruplets summing to ${target}`, pseudocodeLine: 1 });

  for (let i = 0; i < sorted.length - 3; i++) {
    if (i > 0 && sorted[i] === sorted[i-1]) continue;
    for (let j = i+1; j < sorted.length - 2; j++) {
      if (j > i+1 && sorted[j] === sorted[j-1]) continue;
      let left = j+1, right = sorted.length-1;
      steps.push({ array: sorted, highlight: [i, j, left, right], description: `Fix ${sorted[i]}, ${sorted[j]}, search`, pseudocodeLine: 4 });
      while (left < right) {
        const sum = sorted[i] + sorted[j] + sorted[left] + sorted[right];
        if (sum === target) {
          result.push([sorted[i], sorted[j], sorted[left], sorted[right]]);
          steps.push({ array: sorted, highlight: [i,j,left,right], description: `Found [${sorted[i]},${sorted[j]},${sorted[left]},${sorted[right]}]`, pseudocodeLine: 6 });
          left++; right--;
          while (left < right && sorted[left] === sorted[left-1]) left++;
          while (left < right && sorted[right] === sorted[right+1]) right--;
        } else if (sum < target) {
          left++;
          steps.push({ array: sorted, highlight: [i,j,left,right], description: `sum < ${target} → increase left`, pseudocodeLine: 7 });
        } else {
          right--;
          steps.push({ array: sorted, highlight: [i,j,left,right], description: `sum > ${target} → decrease right`, pseudocodeLine: 8 });
        }
      }
    }
  }
  steps.push({ array: sorted, result, description: `Quadruplets: [${result.map(t=>`[${t}]`).join(',')}]` });
  return steps;
};

export default createArrayVisualizer({
  title: "4Sum",
  pseudocodeLines: [
    "procedure fourSum(arr, target):",
    "  sort(arr)",
    "  result = []",
    "  for i = 0 to n-4:",
    "    if i>0 and arr[i]==arr[i-1]: continue",
    "    for j = i+1 to n-3:",
    "      if j>i+1 and arr[j]==arr[j-1]: continue",
    "      left=j+1, right=n-1",
    "      while left<right:",
    "        sum = arr[i]+arr[j]+arr[left]+arr[right]",
    "        if sum==target: add; skip duplicates",
    "        else if sum<target: left++",
    "        else: right--",
    "  return result"
  ],
  generateSteps: (arr) => generateSteps(arr, 0),
  complexity: { time: 'O(n³)', space: 'O(1)' }
});