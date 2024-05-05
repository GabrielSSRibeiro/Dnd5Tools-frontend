import * as utils from "../utils";
import * as cc from "../constants/creatureConstants";
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
  return baseValue;
  // const variance = 0.1;
  // return utils.randomValueFromVariancePercentage(baseValue * 100, variance) / 100;
};

export const GetDistanceMultiplier = (distance) => {
  const baseValue = lc.GetReferenceDistance(distance).baseDistanceMultiplier;
  return baseValue;
  // const variance = 0.1;
  // return utils.randomValueFromVariancePercentage(baseValue * 100, variance) / 100;
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

      return { priority, routine: r };
    });

  //keep only highest priority
  currentRoutinesWithPriority = currentRoutinesWithPriority.filter((i) => i.priority === highestPriority);
  if (currentRoutinesWithPriority.length === 0) {
    return null;
  }

  return utils.randomItemFromArray(currentRoutinesWithPriority).routine;
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

export function GetAllExteriorLocs(location, map) {
  function AddExteriorLocsToList(loc, list) {
    if (map[loc.data.exteriorLocationId]) {
      list.push(map[loc.data.exteriorLocationId]);
      AddExteriorLocsToList(map[loc.data.exteriorLocationId], list);
    }
  }

  let exteriorLocs = [];
  AddExteriorLocsToList(map[location._id], exteriorLocs);

  return exteriorLocs;
}

export function GetLocRadiusForCalc(location, map) {
  function GetAllFirstLocRadius(loc) {
    const interiorLocs = Object.keys(loc.interiorLocs).map((locId) => map[locId]);
    if (interiorLocs.length === 0) {
      return loc.data.radius;
    } else {
      const interiorLoc = interiorLocs.find((l) => !l.data.reference.location && !l.data.isHidden);
      return loc.data.radius + (interiorLoc ? GetAllFirstLocRadius(interiorLoc) : 0);
    }
  }

  let radius = GetAllFirstLocRadius(location);
  return radius / 2;
}

//empiric
const COORDINATES_VARIANCE_INT = 3;
function GetUpdatedCoordinates(coordinates, baseSeed) {
  //empiric
  const seed = utils.extractNumbersFromString(baseSeed.slice(0, 10));

  const updatedCoordinates = coordinates.map((p, i) => {
    const updatedX = utils.randomValueFromVarianceInt(p.x, COORDINATES_VARIANCE_INT, seed + p.x + i);
    const updatedY = utils.randomValueFromVarianceInt(p.y, COORDINATES_VARIANCE_INT, seed + p.y + i);
    return { x: utils.GetValueInBounds(updatedX, 0, 100), y: utils.GetValueInBounds(updatedY, 0, 100) };
  });

  return updatedCoordinates;
}

function GetLocAreaClipPath(locationId, cummulativeMultiplier) {
  //empiric
  const baseNumberOfSides = 20;
  const numberOfSides = Math.round(baseNumberOfSides * cummulativeMultiplier);
  const coordinates = utils.generateRegularPolygonCoordinatesForCSSClipPath(numberOfSides);
  const updatedCoordinates = GetUpdatedCoordinates(coordinates, locationId);

  return "polygon(" + updatedCoordinates.map((p) => `${p.x}% ${p.y}%`).join(",") + ")";
}

export function generateConBgCoordinatesForCSSClipPath(location) {
  const multiplier = lc.GetReferenceDistance(location?.reference.distance)?.baseDistanceMultiplier;
  if (!multiplier) return [];

  //empiric
  const baseNumberOfPoints = 10;
  const numberOfPoints = Math.min(Math.round(baseNumberOfPoints * multiplier), 100) / 2;

  let coordinates = [{ x: 0, y: COORDINATES_VARIANCE_INT }];
  for (let i = 1; i < numberOfPoints; i++) {
    coordinates.push({ x: Math.round((100 / numberOfPoints) * i), y: COORDINATES_VARIANCE_INT });
  }

  return coordinates;
}

export function GetLocConBgClipPath(location, locationId) {
  const coordinates = generateConBgCoordinatesForCSSClipPath(location);

  const updatedCoordinates = [{ x: 0, y: 50 }, ...GetUpdatedCoordinates(coordinates, locationId), { x: 100, y: 50 }];
  return "polygon(" + updatedCoordinates.map((p) => `${p.x}% ${p.y}%`).join(",") + ")";
}

export function GetAreaStyles(location, index, isPointOfInterest, areaLocs, map) {
  //get all radius
  let cummulativeMultiplier = lc.GetLocationSize(location.size).baseRadiusMultiplier;
  let radius = location.radius;
  areaLocs.slice(index + 1).forEach((l) => {
    radius += l.radius;
    cummulativeMultiplier += lc.GetLocationSize(l.size).baseRadiusMultiplier;
  });

  //add contrast with type equal to parent but diffrent than grand parent
  const parentLoc = map[location.exteriorLocationId]?.data;
  const grandParentLoc = parentLoc ? map[parentLoc.exteriorLocationId]?.data : null;
  const filterValue = location.traversal.type === parentLoc?.traversal.type && location.traversal.type !== grandParentLoc?.traversal.type ? 0.75 : 1;

  let areaStyles = {
    width: radius / 2,
    height: radius / 2,
    backgroundColor: isPointOfInterest ? lc.GetElementType(location.interaction.type)?.color : cc.GetEnviroment(location.traversal.type)?.color,
    filter: `contrast(${filterValue})`,
  };

  //set clip-path logic
  if (!isPointOfInterest) {
    areaStyles.clipPath = GetLocAreaClipPath(location._id, cummulativeMultiplier);
    areaStyles.overflow = "unset";
    areaStyles.borderRadius = "unset";
  }

  return areaStyles;
}

export function GetOffset(location, map, pxInMScale) {
  if (!location.reference.location || !location.reference.distance || !location.reference.direction || !map[location.reference.location]) {
    return { x: 0, y: 0 };
  } else {
    const refOffset = GetOffset(map[location.reference.location].data, map, pxInMScale);
    const refLocDistFromCenter = GetLocRadiusForCalc(map[location.reference.location], map);
    const locDistFromCenter = GetLocRadiusForCalc(map[location._id], map);

    //distance will be the largest between calc dist and all bg area radius
    let calcDist = 0;
    if (location.reference.distance === lc.REFERENCE_DISTANCES.EXTERIOR_ADJACENT) {
      calcDist = map[location.exteriorLocationId]?.data.radius / 2 ?? 0;
    } else {
      calcDist = GetNormalizedValue(location.distanceMultiplier, pxInMScale) / 2;
    }

    const offsetDistance = refLocDistFromCenter + calcDist + locDistFromCenter;
    const coordinatesByDistance = utils.GetCoordinatesByDistance(refOffset, offsetDistance, location.distanceAngle);

    return { ...coordinatesByDistance, distance: offsetDistance };
  }
}

export function GetOffsetStyles(offset, includeWidth = false) {
  const offsetStyles = [];

  if (includeWidth) {
    offsetStyles.push({ key: "width", value: `${Math.sqrt(offset.x * offset.x + offset.y * offset.y) / 2}px` });
  }

  //horizontal
  if (offset.x > 0) {
    offsetStyles.push({ key: "marginRight", value: `${offset.x * -1}px` });
  } else {
    offsetStyles.push({ key: "marginLeft", value: `${offset.x}px` });
  }

  //vertical
  if (offset.y > 0) {
    offsetStyles.push({ key: "marginTop", value: `${offset.y * -1}px` });
  } else {
    offsetStyles.push({ key: "marginBottom", value: `${offset.y}px` });
  }

  return offsetStyles;
}

export function GetConnectionOffsetStyles(connectionLoc, offset, map) {
  let { x, y, distance } = offset;
  //remove the ref offset from x and y, making it the new center for the dist
  x -= map[connectionLoc.reference.location].data.offset.x;
  y -= map[connectionLoc.reference.location].data.offset.y;

  const offsetStyles = [{ key: "width", value: `${distance / 2}px` }];

  //horizontal
  if (x > 0) {
    offsetStyles.push({ key: "marginLeft", value: `${(x * -1) / 2}px` });
  } else {
    offsetStyles.push({ key: "marginRight", value: `${x / 2}px` });
  }

  //vertical
  if (y > 0) {
    offsetStyles.push({ key: "marginBottom", value: `${(y * -1) / 2}px` });
  } else {
    offsetStyles.push({ key: "marginTop", value: `${y / 2}px` });
  }

  return offsetStyles;
}

export function GetConnectionBgOffsetStyles(cbg, index, cbgs, connectionLoc, refAreaDiameter, map) {
  const offsetStyles = [];

  let { x, y, distance } = connectionLoc.offset;

  //remove the ref offset from x and y, making it the new center for the dist
  x -= map[connectionLoc.reference.location].data.offset.x;
  y -= map[connectionLoc.reference.location].data.offset.y;

  const refHeightAdditor = cbgs.slice(index).reduce((acc, cur) => acc + map[cur.getAttribute("name")].data.radius / 2, 0);
  const isRefSmaller = cbg.offsetHeight > refAreaDiameter + refHeightAdditor;

  if (isRefSmaller) {
    //adjust height
    offsetStyles.push({ key: "height", value: `${refAreaDiameter + refHeightAdditor}px` });
  }

  //special cases
  Array.from(cbg.getElementsByClassName("con-bg-area")).forEach((bga) => {
    if (bga.classList.contains("needs-adjust")) {
      const isCorner = bga.classList.contains("corner");

      //adjust further
      if (isRefSmaller && isCorner) {
        bga.style.width = `calc(100% + ${refAreaDiameter / 2}px)`;
      }
      //adjust back if not last
      else if (index !== cbgs.length - 1) {
        //control how much should be adjusted by the ref size
        const sliceIndex = refAreaDiameter > connectionLoc.radius / 2 ? index + 1 : index + 2;

        const modifier = cbgs.slice(sliceIndex).reduce((acc, cur) => acc + map[cur.getAttribute("name")].data.radius / 2, 0);
        bga.style.width = `calc(100% - ${modifier / 2}px)`;
      }
      //still adjust further as last option
      else if (isCorner) {
        bga.style.width = `calc(100% + ${refAreaDiameter / 2}px)`;
      }

      bga.classList.remove("needs-adjust");
    }
  });

  const connectionRatio = (distance - refAreaDiameter) / distance;
  offsetStyles.push({ key: "width", value: `${(distance - refAreaDiameter) / 2}px` });

  //horizontal
  if (x > 0) {
    offsetStyles.push({ key: "marginLeft", value: `${(x * connectionRatio * -1) / 2}px` });
  } else {
    offsetStyles.push({ key: "marginRight", value: `${(x * connectionRatio) / 2}px` });
  }

  //vertical
  if (y > 0) {
    offsetStyles.push({ key: "marginBottom", value: `${(y * connectionRatio * -1) / 2}px` });
  } else {
    offsetStyles.push({ key: "marginTop", value: `${(y * connectionRatio) / 2}px` });
  }

  return offsetStyles;
}

export function GetFlatUpdateStyles(nfel, ref, locData, map) {
  const flatUpdateStyles = [];
  let marginTop = ref.current.style.marginTop ? parseInt(ref.current.style.marginTop) : 0;
  let marginRight = ref.current.style.marginRight ? parseInt(ref.current.style.marginRight) : 0;
  let marginBottom = ref.current.style.marginBottom ? parseInt(ref.current.style.marginBottom) : 0;
  let marginLeft = ref.current.style.marginLeft ? parseInt(ref.current.style.marginLeft) : 0;

  GetAllExteriorLocs(locData, map)
    .map((l) => document.getElementById(l.data._id))
    .forEach((el) => {
      marginTop += el.style.marginTop ? parseInt(el.style.marginTop) : 0;
      marginRight += el.style.marginRight ? parseInt(el.style.marginRight) : 0;
      marginBottom += el.style.marginBottom ? parseInt(el.style.marginBottom) : 0;
      marginLeft += el.style.marginLeft ? parseInt(el.style.marginLeft) : 0;
    });

  marginTop += nfel.style.marginTop ? parseInt(nfel.style.marginTop) : 0;
  marginRight += nfel.style.marginRight ? parseInt(nfel.style.marginRight) : 0;
  marginBottom += nfel.style.marginBottom ? parseInt(nfel.style.marginBottom) : 0;
  marginLeft += nfel.style.marginLeft ? parseInt(nfel.style.marginLeft) : 0;

  flatUpdateStyles.push({ key: "marginTop", value: `${marginTop}px` });
  flatUpdateStyles.push({ key: "marginRight", value: `${marginRight}px` });
  flatUpdateStyles.push({ key: "marginBottom", value: `${marginBottom}px` });
  flatUpdateStyles.push({ key: "marginLeft", value: `${marginLeft}px` });

  return flatUpdateStyles;
}
