import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (prices) => {
  const steps = [];
  let minPrice = Infinity;
  let maxProfit = 0;
  steps.push({ array: prices, description: "Find max profit (buy low, sell high)", pseudocodeLine: 1 });
  for (let i = 0; i < prices.length; i++) {
    if (prices[i] < minPrice) {
      minPrice = prices[i];
      steps.push({ array: prices, highlight: [i], description: `New min price = ${minPrice} at day ${i}`, pseudocodeLine: 3 });
    }
    const profit = prices[i] - minPrice;
    if (profit > maxProfit) {
      maxProfit = profit;
      steps.push({ array: prices, highlight: [i], description: `Profit = ${profit} → new max`, pseudocodeLine: 4 });
    } else {
      steps.push({ array: prices, highlight: [i], description: `Profit = ${profit} (no improvement)`, pseudocodeLine: 2 });
    }
  }
  steps.push({ array: prices, result: maxProfit, description: `Maximum profit = ${maxProfit}` });
  return steps;
};

export default createArrayVisualizer({
  title: "Best Time to Buy and Sell Stock",
  pseudocodeLines: [
    "procedure maxProfit(prices):",
    "  minPrice = ∞, maxProfit = 0",
    "  for price in prices:",
    "    minPrice = min(minPrice, price)",
    "    maxProfit = max(maxProfit, price - minPrice)",
    "  return maxProfit"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(1)' }
});