import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (arr) => {
  const steps = [];
  let count = 0;
  const mergeSortPairs = (a, left, right) => {
    if (left >= right) return;
    const mid = Math.floor((left+right)/2);
    steps.push({ array: [...a], description: `Divide: [${left}..${mid}] and [${mid+1}..${right}]`, pseudocodeLine: 2 });
    mergeSortPairs(a, left, mid);
    mergeSortPairs(a, mid+1, right);
    // count reverse pairs
    let i=left, j=mid+1;
    while (i<=mid && j<=right) {
      if (a[i] > 2*a[j]) {
        count += (mid - i + 1);
        steps.push({ array: [...a], highlight: [i, j], description: `Reverse pair: (${a[i]},${a[j]}) → count +${mid-i+1}`, pseudocodeLine: 5 });
        j++;
      } else {
        i++;
      }
    }
    // merge normally
    let p=left, q=mid+1, k=0;
    const temp = [];
    while (p<=mid && q<=right) {
      if (a[p] <= a[q]) temp.push(a[p++]);
      else temp.push(a[q++]);
    }
    while (p<=mid) temp.push(a[p++]);
    while (q<=right) temp.push(a[q++]);
    for (let t=0; t<temp.length; t++) a[left+t] = temp[t];
    steps.push({ array: [...a], description: `Merged [${left}..${right}]`, pseudocodeLine: 6 });
  };
  const copy = [...arr];
  mergeSortPairs(copy, 0, copy.length-1);
  steps.push({ array: copy, result: count, description: `Total reverse pairs = ${count}` });
  return steps;
};

export default createArrayVisualizer({
  title: "Reverse Pairs",
  pseudocodeLines: [
    "procedure reversePairs(arr):",
    "  return mergeSortCount(arr, 0, n-1)",
    "procedure mergeSortCount(arr, l, r):",
    "  if l>=r: return 0",
    "  mid = (l+r)//2",
    "  count = mergeSortCount(l,mid) + mergeSortCount(mid+1,r)",
    "  count += countWhileMerging(arr, l, mid, r)",
    "  merge(arr, l, mid, r)",
    "  return count"
  ],
  generateSteps,
  complexity: { time: 'O(n log n)', space: 'O(n)' }
});
