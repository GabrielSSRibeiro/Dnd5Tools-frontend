export function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function averageOfArray(values) {
  const sum = values.reduce((a, b) => a + b, 0);

  return sum / values.length || 0;
}

export function randomValueFromVariance(value, variance) {
  const lowerBound = value * (1 - variance);
  const higherBound = value * (1 + variance);

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

export function SortArrayOfObjByProperty(arrayOfObj, property) {
  function compare(a, b) {
    const bandA = a[property].toUpperCase();
    const bandB = b[property].toUpperCase();

    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }

  arrayOfObj.sort(compare);
  // return arrayOfObj;
}

export function turnValueIntoPercentageString(value) {
  return value * 100 + "%";
}

export function setObjPropertyValue(obj, accessPath, value) {
  const propertyKeys = accessPath.split(".");

  let property = obj;
  let lastKey = propertyKeys.pop();

  propertyKeys.forEach((key) => {
    property = property[key];
  });

  property[lastKey] = value;
}
