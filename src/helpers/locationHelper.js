import * as utils from "../utils";
import * as lc from "../constants/locationConstants";

export const GetNormalizedValue = (value, pxInMScale) => {
  const baseRaius = lc.BASE_VISION_IN_M;

  return Math.round((baseRaius * value) / pxInMScale);
};

export const GetRadius = (location, pxInMScale) => {
  return location.radiusMultiplier ? GetNormalizedValue(location.radiusMultiplier, pxInMScale) : lc.POINT_OF_INTEREST_RADIUS;
};

export const GetRadiusMultiplier = (size) => {
  const baseValue = lc.GetLocationSize(size).baseRadiusMultiplier;
  const variance = 0.1;

  return utils.randomValueFromVariancePercentage(baseValue * 100, variance) / 100;
};

export const GetDistanceMultiplier = (distance) => {
  const baseValue = lc.GetReferenceDistance(distance).baseDistanceMultiplier;
  const variance = 0.1;
  return utils.randomValueFromVariancePercentage(baseValue * 100, variance) / 100;
};

export const GetDistanceAngle = (direction) => {
  const baseValue = lc.GetDirection(direction).baseAngle;
  const variance = 5;
  return utils.randomValueFromVarianceInt(baseValue, variance);
};

export const GetCurrentContext = (location) => {
  return location.contexts.find((c) => c.isCurrent);
};

export const GetCreatureCurrentRoutine = (creature, schedule, precipitation, temperature, context) => {
  if (creature == null) {
    return null;
  }

  let highestPriority = 0;
  let currentRoutinesWithPriority = creature.routines
    .filter((r) => (r.schedule ? schedule === r.schedule : true))
    .filter((r) => (r.precipitation ? precipitation === r.precipitation : true))
    .filter((r) => (r.temperature ? temperature === r.temperature : true))
    .filter((r) => (r.context ? context === r.context : true))
    .map((r) => {
      //get the priority
      let priority = 0;
      if (schedule && r.schedule) {
        priority++;
      }

      if (precipitation && r.precipitation) {
        priority++;
      }

      if (temperature && r.temperature) {
        priority++;
      }

      if (context && r.context) {
        priority++;
      }

      //keep track of the highest
      highestPriority = Math.max(highestPriority, priority);

      return { priority: `${priority}`, routine: r };
    })
    .filter((i) => i.priority === `${highestPriority}`);

  utils.SortArrayOfObjByStringProperty(currentRoutinesWithPriority, "priority");

  return currentRoutinesWithPriority[0]?.routine;
};
