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
  if (!array) {
    return null;
  }

  const index = randomIntFromInterval(0, Math.max(array.length - 1, 0));

  return array[index];
}

export function randomIndexFromArrayOfProbs(probArray) {
  const randValue = Math.random();

  let probSum = 0;
  const pickedIndex = probArray.findIndex((p) => {
    probSum += p;
    return randValue <= probSum;
  });

  return pickedIndex ?? probArray.length - 1;
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
}

export function turnValueIntoPercentageString(value) {
  return value * 100 + "%";
}

function getKeyDetails(key) {
  let [k, ...rest] = key.split("[");

  let keyDetails = { key: k, indicesArray: [] };
  if (rest.length > 0) {
    let indicesArray = rest.map((e) => parseInt(e.split("]")[0]));

    keyDetails.indicesArray = indicesArray;
  }

  return keyDetails;
}

export function setObjPropertyValue(obj, accessPath, value) {
  const propertyKeys = accessPath.split(".");

  let property = obj;
  let lastKeyDetails = getKeyDetails(propertyKeys.pop());

  //traverse middle path
  propertyKeys.forEach((key) => {
    let keyDetails = getKeyDetails(key);

    if (keyDetails.key) {
      property = property[keyDetails.key];
    }

    keyDetails.indicesArray.forEach((i) => (property = property[i]));
  });

  if (lastKeyDetails.indicesArray.length > 0) {
    if (lastKeyDetails.key) {
      property = property[lastKeyDetails.key];
    }

    let lastIndex = lastKeyDetails.indicesArray.pop();
    lastKeyDetails.indicesArray.forEach((i) => (property = property[i]));

    property[lastIndex] = value;
  } else {
    property[lastKeyDetails.key] = value;
  }
}

export function getObjPropertyValue(obj, accessPath) {
  const propertyKeys = accessPath.split(".");

  let property = obj;

  //traverse middle path
  propertyKeys.forEach((key) => {
    let keyDetails = getKeyDetails(key);

    if (keyDetails.key) {
      property = property[keyDetails.key];
    }

    keyDetails.indicesArray.forEach((i) => (property = property[i]));
  });

  return property;
}

export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function createArrayFromInt(int) {
  return Array.from(Array(int));
}
