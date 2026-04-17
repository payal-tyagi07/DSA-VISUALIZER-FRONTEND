import { createStringVisualizer } from '../visualizations/stringFactory';

const generateSteps = (s) => {
  const steps = [];
  const str = s.trim();
  let i = 0, n = str.length;
  let seenDigit = false, seenDot = false, seenE = false;
  steps.push({ string: s, description: "Validate number", pseudocodeLine: 1 });
  if (i < n && (str[i] === '+' || str[i] === '-')) {
    steps.push({ string: s, highlight: [i], description: "Sign at start", pseudocodeLine: 2 });
    i++;
  }
  while (i < n && str[i] >= '0' && str[i] <= '9') {
    seenDigit = true;
    steps.push({ string: s, highlight: [i], description: `Digit ${str[i]}`, pseudocodeLine: 3 });
    i++;
  }
  if (i < n && str[i] === '.') {
    seenDot = true;
    steps.push({ string: s, highlight: [i], description: "Decimal point", pseudocodeLine: 4 });
    i++;
    while (i < n && str[i] >= '0' && str[i] <= '9') {
      seenDigit = true;
      steps.push({ string: s, highlight: [i], description: `Digit after decimal ${str[i]}`, pseudocodeLine: 5 });
      i++;
    }
  }
  if (!seenDigit) {
    steps.push({ string: s, result: false, description: "No digit → invalid" });
    return steps;
  }
  if (i < n && (str[i] === 'e' || str[i] === 'E')) {
    seenE = true;
    steps.push({ string: s, highlight: [i], description: "Exponent", pseudocodeLine: 6 });
    i++;
    if (i < n && (str[i] === '+' || str[i] === '-')) {
      steps.push({ string: s, highlight: [i], description: "Exponent sign", pseudocodeLine: 7 });
      i++;
    }
    let hasExpDigit = false;
    while (i < n && str[i] >= '0' && str[i] <= '9') {
      hasExpDigit = true;
      steps.push({ string: s, highlight: [i], description: `Exponent digit ${str[i]}`, pseudocodeLine: 8 });
      i++;
    }
    if (!hasExpDigit) {
      steps.push({ string: s, result: false, description: "Exponent without digit → invalid" });
      return steps;
    }
  }
  const valid = i === n;
  steps.push({ string: s, result: valid, description: valid ? "Valid number" : "Invalid number" });
  return steps;
};

export default createStringVisualizer({
  title: "Valid Number",
  pseudocodeLines: [
    "procedure isNumber(s):",
    "  trim, handle sign",
    "  check digits before dot",
    "  check dot and digits after",
    "  check exponent and digits",
    "  return if end of string"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(1)' }
});