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

export const sortLocsByRef = (locations) => {
  const visited = new Set(); // Keep track of visited objects
  const result = [];

  function visit(location) {
    if (visited.has(location)) return; // Avoid infinite loops

    visited.add(location);
    const ref = location.reference.location;

    if (ref !== undefined && ref !== null) {
      const refObj = locations.find((l) => l._id === ref); // Assuming 'id' is the unique identifier property
      if (refObj) {
        visit(refObj); // Recursively visit referenced object first
      }
    }

    result.push(location);
  }

  locations.forEach(visit);

  return result;
};

export const GetTravelTimeInH = (distanceInScale, travel) => {
  const paceMob = lc.GetTravelPace(travel.pace).mobility;
  const mountMob = lc.GetTravelMount(travel.mount).mobility;
  const loadMob = lc.GetTravelLoad(travel.load).mobility;

  let travelDistancePerHourInM = lc.BASE_TRAVEL_DISTANCE_PER_HOUR_IN_M * paceMob * mountMob * loadMob;

  return Math.floor(distanceInScale / travelDistancePerHourInM);
};
