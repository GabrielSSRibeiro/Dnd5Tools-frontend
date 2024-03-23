import * as utils from "../utils";
import * as lc from "../constants/locationConstants";

export const GetNormalizedValue = (multiplier, pxInMScale) => {
  const baseRaius = lc.BASE_VISION_IN_M;

  return Math.round((baseRaius * multiplier) / pxInMScale);
};

export const GetRadius = (location, pxInMScale) => {
  const PoIRadiusMultiplier = lc.POINT_OF_INTEREST_RADIUS / 300;
  return GetNormalizedValue(location.radiusMultiplier > 0 ? location.radiusMultiplier : PoIRadiusMultiplier, pxInMScale);
  // return location.radiusMultiplier ? GetNormalizedValue(location.radiusMultiplier, pxInMScale) : lc.POINT_OF_INTEREST_RADIUS;
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

export const GetDistanceAngle = (direction, mod = 0) => {
  const baseValue = lc.GetDirection(direction).baseAngle;
  return baseValue + mod;
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

export const GetTravelTimeInMin = (distanceInScale, travel) => {
  const paceMob = lc.GetTravelPace(travel.pace).mobility;
  const loadMob = lc.GetTravelLoad(travel.load).mobility;

  let travelDistancePerHourInM = lc.BASE_TRAVEL_DISTANCE_PER_HOUR_IN_M * paceMob * loadMob;
  if (travelDistancePerHourInM === 0) {
    return 0;
  }

  return Math.floor((60 * distanceInScale) / travelDistancePerHourInM);
};

export const GetTravelFatigueModifier = (travel) => {
  const paceFatigue = lc.GetTravelPace(travel.pace).fatigue;
  const mountFatigue = travel.isMounted ? 0.5 : 1;
  const loadFatigue = lc.GetTravelLoad(travel.load).fatigue;

  const travelFatigueModifier = paceFatigue * mountFatigue * loadFatigue;
  return travelFatigueModifier;
};

export const GetLocationDataForExport = (location, creatures) => {
  let locationDataForExport = [location.name.toUpperCase()];

  if (location.contexts[0].firstImpressions) {
    locationDataForExport.push(location.contexts[0].firstImpressions);
  }

  if (location.contexts[0].details) {
    locationDataForExport.push(location.contexts[0].details);
  }

  if (location.contexts[0].rumors) {
    locationDataForExport.push(location.contexts[0].rumors);
  }

  if (location.contexts[0].secrets) {
    locationDataForExport.push(location.contexts[0].secrets);
  }

  if (location.creatures.length > 0) {
    if (location.size === lc.LOCATION_SIZES.POINT_OF_INTEREST) {
      locationDataForExport.push("Entrada");
    }

    locationDataForExport.push(location.creatures.map((lc) => creatures.find((c) => c._id === lc.creatureId).name).join(", "));
  }

  location.interaction?.rooms
    .filter((r) => r)
    .forEach((r) => {
      if (r.purpose) {
        locationDataForExport.push(r.purpose);
      }

      if (r.firstImpressions) {
        locationDataForExport.push(r.firstImpressions);
      }

      if (r.secrets) {
        locationDataForExport.push(r.secrets);
      }

      if (r.creatures.length > 0) {
        locationDataForExport.push(r.creatures.map((rc) => creatures.find((c) => c._id === rc.creatureId).name).join(", "));
      }
    });

  locationDataForExport.push("---------------------------------");

  return locationDataForExport;
};

export const HasCertainCreature = (location, GetCreatureCurrentRoutine) => {
  const context = GetCurrentContext(location);

  return location.size === lc.LOCATION_SIZES.POINT_OF_INTEREST && location.interaction?.currentCreatures
    ? location.interaction.currentCreatures.filter((cc) => !cc.isDead).length > 0
    : location.creatures.some((c) => GetCreatureCurrentRoutine(c, context)?.encounterFrequency === lc.ENCOUNTER_FREQUENCIES.CERTAIN);
};
