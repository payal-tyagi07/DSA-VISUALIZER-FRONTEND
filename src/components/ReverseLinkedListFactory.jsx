import { createLinkedListVisualizer } from '../visualizations/linkedListFactory';

const generateSteps = (list) => {
  const steps = [];
  let prev = null;
  let curr = 0;
  let nextTemp = null;
  const arr = [...list];

  steps.push({ array: arr, prev: null, curr: 0, description: "Start: prev = null, curr = head", pseudocodeLine: 1 });

  while (curr < arr.length) {
    nextTemp = curr + 1;
    steps.push({ array: arr, prev, curr, next: nextTemp, description: `Store next = ${nextTemp < arr.length ? arr[nextTemp] : 'null'}`, pseudocodeLine: 3 });
    steps.push({ array: arr, prev, curr, next: nextTemp, description: `Reverse link: curr.next = prev (now points to ${prev !== null ? arr[prev] : 'null'})`, pseudocodeLine: 4 });
    prev = curr;
    curr = nextTemp;
    if (curr < arr.length) {
      steps.push({ array: arr, prev, curr, description: `Move prev to curr, curr to next → prev = ${arr[prev]}, curr = ${arr[curr]}`, pseudocodeLine: 5 });
    }
  }
  steps.push({ array: arr, prev, description: `Reversed list head = ${arr[prev]}`, pseudocodeLine: 6 });
  return steps;
};

export default createLinkedListVisualizer({
  title: "Reverse a Linked List",
  pseudocodeLines: [
    "procedure reverseList(head):",
    "  prev = null, curr = head",
    "  while curr != null:",
    "    nextTemp = curr.next",
    "    curr.next = prev",
    "    prev = curr",
    "    curr = nextTemp",
    "  return prev"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(1)' }
});