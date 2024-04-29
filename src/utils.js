import moment from "moment";

export function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function averageOfArray(values) {
  const sum = values.reduce((a, b) => a + b, 0);

  return sum / values.length || 0;
}

export function randomValueFromVarianceInt(value, varianceInt) {
  const lowerBound = value - varianceInt;
  const higherBound = value + varianceInt;

  return randomIntFromInterval(lowerBound, higherBound);
}

export function randomValueFromVariancePercentage(value, variancePercentage) {
  const lowerBound = value * (1 - variancePercentage);
  const higherBound = value * (1 + variancePercentage);

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

export function TrimDecimalPlaces(value) {
  return Math.round(value * 100) / 100;
}

export function ProbabilityCheck(prob) {
  return Math.random() <= prob;
}

export function SortArrayOfObjByStringProperty(arrayOfObj, property, isDescending = false) {
  function compare(a, b) {
    const bandA = a[property].toUpperCase();
    const bandB = b[property].toUpperCase();

    let comparison = 0;
    if (bandA > bandB) {
      comparison = isDescending ? -1 : 1;
    } else if (bandA < bandB) {
      comparison = isDescending ? 1 : -1;
    }
    return comparison;
  }

  arrayOfObj.sort(compare);
}

export function turnValueIntoPercentageString(value) {
  return Math.round(value * 100) + "%";
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
  return Array.from(Array(int).keys());
}

export function downloadData(data, exportName) {
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(data);
  var downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

export const GetValueAsDiceString = (value, keepRemainder = false, dicedPercentage = 1, includeAverage = false) => {
  const valueToTransform = Math.round(value * dicedPercentage);
  let remainingValue = value - valueToTransform;

  let diceDetails = [{ sides: 4 }, { sides: 6 }, { sides: 8 }, { sides: 10 }, { sides: 12 }];

  diceDetails.forEach((dd) => {
    dd.average = (1 + dd.sides) / 2;
    dd.result = Math.floor(valueToTransform / dd.average);
    dd.remainder = valueToTransform - Math.ceil(dd.result * dd.average);
  });
  const selectedRemainder = Math.max(...diceDetails.filter((dd) => dd.remainder !== valueToTransform).map((dd) => dd.remainder));

  const selectedDie = diceDetails.find((dd) => dd.remainder === selectedRemainder);
  if (keepRemainder) {
    remainingValue += selectedDie ? selectedDie.remainder : valueToTransform;
  }

  let diceString = selectedDie?.result > 0 ? `${selectedDie.result}d${selectedDie.sides}` : "";
  if (remainingValue > 0) {
    if (diceString) {
      diceString += "+";
    }
    diceString += `${remainingValue}`;
  }

  if (includeAverage) {
    diceString += `(${value})`;
  }

  return diceString;
};

export const GroupArrayBy = (arr, property) => {
  return arr.reduce((group, item) => {
    (group[item[property]] = group[item[property]] || []).push(item);
    return group;
  }, {});
};

export const GetCoordinatesByDistance = (pA, distance, angle) => {
  // Convert angle to radians
  const radians = (angle * Math.PI) / 180;

  // Calculate change in x and y coordinates
  const deltaX = distance * Math.cos(radians);
  const deltaY = distance * Math.sin(radians);

  // Calculate coordinates of point B
  const x2 = Math.round(pA.x + deltaX);
  const y2 = Math.round(pA.y + deltaY);

  return { x: x2, y: y2 };
};

export const GetDistanceByCoordinates = (pA, pB) => {
  const xDiff = pB.x - pA.x;
  const yDiff = pB.y - pA.y;
  const value = Math.sqrt(xDiff ** 2 + yDiff ** 2);
  const angleRadians = Math.atan2(pB.y - pA.y, pB.x - pA.x);
  const angle = (angleRadians * 180) / Math.PI;

  return { value, angle };
};

export const MInUnits = (m, fixedValue = null) => {
  if (m < 1000) {
    return `${m}m`;
  }

  const adjustedValue = m < 1000 ? m : m / 1000;
  return `${fixedValue ? adjustedValue.toFixed(fixedValue) : Math.round(adjustedValue)}km`;
};

export const MinutesToTimeInUnits = (minutes) => {
  const timeInUnits =
    minutes < 60 ? `${minutes} min(s)` : minutes < 60 * 24 ? `${Math.floor(minutes / 60)} hora(s)` : `${Math.floor(minutes / (60 * 24))} dia(s)`;
  return timeInUnits;
};

export const MinutesToTimeFormat = (minutes) => {
  const duration = moment.duration(minutes, "minutes");
  const hours = Math.floor(duration.asHours());
  const formattedTime = moment().startOf("day").add(hours, "hours").add(duration.minutes(), "minutes").format("HH:mm");
  return formattedTime;
};

export const ProbabilityCheckWithRatio = (probability, ratio) => {
  const fullProbTimes = Math.floor(ratio);
  const parcialProb = ratio % 1;

  //checks every 1 hour / split since full prob is per hour
  const hourCheckSplit = 6;

  let probArray = createArrayFromInt(fullProbTimes * hourCheckSplit).map((_) => probability / hourCheckSplit);

  if (parcialProb > 0) {
    probArray.push(probability * parcialProb);
  }

  let probChecked = 0;
  const probabilityCheck = probArray.some((p) => {
    const result = ProbabilityCheck(p);
    probChecked += p;

    return result;
  });

  const ratioChecked = probChecked / probability;

  return {
    probabilityCheck,
    ratioChecked,
    finalProb: getProbabilityOfTwoIndependent(getProbabilityOfOneSuccess(probability, fullProbTimes), probability * parcialProb),
  };
};

export function getProbabilityOfOneSuccess(p, n) {
  return 1 - Math.pow(1 - p, n);
}

export function getProbabilityOfTwoIndependent(p1, p2) {
  const p1Andp2 = p1 * p2;
  return p1 + p2 - p1Andp2;
}

export function sortByCustomOrder(array, customOrder) {
  array.sort((a, b) => {
    const indexA = customOrder.indexOf(a);
    const indexB = customOrder.indexOf(b);

    return indexA - indexB;
  });
}

export function SwapElementsInArray(array, index1, index2) {
  // Check if the provided indices are within the bounds of the array
  if (index1 < 0 || index1 >= array.length || index2 < 0 || index2 >= array.length) {
    return;
  }

  // Swap the elements using array destructuring
  [array[index1], array[index2]] = [array[index2], array[index1]];
}
