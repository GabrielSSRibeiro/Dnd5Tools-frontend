export function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function averageOfArray(values, variance = 0) {
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length || 0;
  const lowerBound = avg * (1 - variance / 2);
  const higherBound = avg * (1 + variance / 2);

  return randomIntFromInterval(lowerBound, higherBound);
}

export function randomItemFromArray(array) {
  const index = randomIntFromInterval(0, array.length - 1);

  return array[index];
}

export function GetProfByLevel(level) {
  return Math.floor(2 + (level - 1) / 4);
}

export function TrimDecimalPlaces(value) {
  return Math.round(value * 100) / 100;
}

export function ProbabilityCheck(prob) {
  return Math.random() <= prob;
}
