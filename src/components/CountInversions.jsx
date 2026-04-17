import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (arr) => {
  const steps = [];
  let invCount = 0;
  const mergeSortCount = (a, left, right) => {
    if (left >= right) return;
    const mid = Math.floor((left+right)/2);
    steps.push({ array: [...a], description: `Divide: [${left}..${mid}] and [${mid+1}..${right}]`, pseudocodeLine: 2 });
    mergeSortCount(a, left, mid);
    mergeSortCount(a, mid+1, right);
    // merge and count
    let i=left, j=mid+1, k=0;
    const temp = [];
    while (i<=mid && j<=right) {
      if (a[i] <= a[j]) {
        temp.push(a[i++]);
      } else {
        invCount += (mid - i + 1);
        temp.push(a[j++]);
        steps.push({ array: [...a], highlight: [i, j], description: `Inversion: (${a[i]},${a[j-1]}) → count +${mid-i+1}`, pseudocodeLine: 5 });
      }
    }
    while (i<=mid) temp.push(a[i++]);
    while (j<=right) temp.push(a[j++]);
    for (let p=0; p<temp.length; p++) a[left+p] = temp[p];
    steps.push({ array: [...a], description: `Merged [${left}..${right}]: ${a.slice(left,right+1).join(',')}`, pseudocodeLine: 6 });
  };
  const copy = [...arr];
  mergeSortCount(copy, 0, copy.length-1);
  steps.push({ array: copy, result: invCount, description: `Total inversions = ${invCount}` });
  return steps;
};

export default createArrayVisualizer({
  title: "Count Inversions",
  pseudocodeLines: [
    "procedure countInversions(arr):",
    "  return mergeSortCount(arr, 0, n-1)",
    "procedure mergeSortCount(arr, l, r):",
    "  if l>=r: return 0",
    "  mid = (l+r)//2",
    "  inv = mergeSortCount(l,mid) + mergeSortCount(mid+1,r)",
    "  inv += merge(arr, l, mid, r)",
    "  return inv"
  ],
  generateSteps,
  complexity: { time: 'O(n log n)', space: 'O(n)' }
});