import React, { useState, useEffect, useMemo, useRef } from "react";
import * as utils from "../../../../utils";
import * as lh from "../../../../helpers/locationHelper";
import * as lc from "../../../../constants/locationConstants";
import * as cc from "../../../../constants/creatureConstants";

import Button from "../../../../components/Button";
import CheckInput from "../../../../components/CheckInput";
import Select from "../../../../components/Select";
import SelectButton from "../../../../components/SelectButton";
import LocationSummary from "./components/LocationSummary";
import EditLocation from "./components/EditLocation";
import Location from "./components/Location";
import ModalTravelResults from "./components/ModalTravelResults";
import ModalSuggestions from "./components/ModalSuggestions";
import ModalWarning from "../../../../components/ModalWarning";

import "./styles.css";

function Map({
  UpdateLocation,
  HandleSaveLocation,
  HandleUpdateLocations,
  HandleDeleteLocations,
  HandleSelectFromBestiary,
  setSelectedCreatures,
  HandleSaveCombatConfig,
  creatures,
  combatConfig,
  setCombatConfig,
  locations,
  defaultZoom,
  userId,
  shouldRender,
  isMobileDevice,
}) {
  const mapConditionLevels = useRef(lc.hazardousness.map((h) => h.color));
  const exhaustionThreshold = useRef(8);
  const dayTimeThreshold = useRef(6 * 60);
  const nightTimeThreshold = useRef(18 * 60);
  const nearDayTimeThreshold = useRef(dayTimeThreshold.current - 60);
  const nearNightTimeThreshold = useRef(nightTimeThreshold.current - 60);
  const pxInMScale = useMemo(() => lc.BASE_PX_IN_M_SCALE * combatConfig.zoom, [combatConfig.zoom]);
  const currentNode = useMemo(() => {
    if (!combatConfig.travel.currentNode) {
      return null;
    }

    const currentNode = {
      ...combatConfig.travel.currentNode,
      x: combatConfig.travel.currentNode.x / pxInMScale,
      y: combatConfig.travel.currentNode.y / pxInMScale,
    };

    return currentNode;
  }, [combatConfig.travel.currentNode, pxInMScale]);
  const [modal, setModal] = useState(null);
  const [nodeToMove, setNodeToMove] = useState(null);
  const [mapMode, setMapMode] = useState(currentNode ? lc.MAP_MODES.TRAVEL : lc.MAP_MODES.FREE);
  const [defaultCenter, setDefaultCenter] = useState(currentNode ? { x: currentNode.x, y: currentNode.y } : { x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isMouseDragging, setIsMouseDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(defaultCenter);
  const [initialDragPosition, setInitialDragPosition] = useState(defaultCenter);
  const [locationToEdit, setLocationToEdit] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [centerOffset, setCenterOffset] = useState(defaultCenter);
  const [locHoverData, setLocHoverData] = useState(null);
  const [locationsRefs, setLocationsRefs] = useState([]);
  const [allLocationsRefs, setAllLocationsRefs] = useState([]);
  const [restTime, setRestTime] = useState(lc.REST_TIMES.h1m0);
  const [isRestSafe, setIsRestSafe] = useState(false);

  const isNewLoc = useMemo(() => locationToEdit?.exteriorLocationId && !locationToEdit._id, [locationToEdit]);
  const isPrecipitating = useMemo(
    () => combatConfig.travel.precipitation >= mapConditionLevels.current.length - 1,
    [combatConfig.travel.precipitation]
  );
  const isExtremeTemp = useMemo(() => combatConfig.travel.temperature >= mapConditionLevels.current.length - 1, [combatConfig.travel.temperature]);
  const currentTime = useMemo(() => utils.MinutesToTimeFormat(combatConfig.travel.schedule), [combatConfig.travel.schedule]);
  const exhaustionTimer = useMemo(() => (combatConfig.travel.exhaustionTimer / 60).toFixed(1), [combatConfig.travel.exhaustionTimer]);
  const exhaustionIndex = useMemo(
    () => Math.floor(Math.min(exhaustionTimer / exhaustionThreshold.current, 1) * (mapConditionLevels.current.length - 1)),
    [exhaustionTimer]
  );
  const isNightTime = useMemo(
    () => combatConfig.travel.schedule >= nightTimeThreshold.current || combatConfig.travel.schedule < nearDayTimeThreshold.current,
    [combatConfig.travel.schedule]
  );
  const isNearDayOrNightTime = useMemo(
    () =>
      (combatConfig.travel.schedule >= nearDayTimeThreshold.current && combatConfig.travel.schedule < dayTimeThreshold.current) ||
      (combatConfig.travel.schedule >= nearNightTimeThreshold.current && combatConfig.travel.schedule < nightTimeThreshold.current),
    [combatConfig.travel.schedule]
  );
  const isExhausted = useMemo(() => exhaustionTimer >= exhaustionThreshold.current, [exhaustionTimer]);
  const minZoom = useMemo(() => lc.BASE_VISION_IN_M / (lc.BASE_PX_IN_M_SCALE * lc.POINT_OF_INTEREST_RADIUS * 2), []);
  const isMinZoom = useMemo(() => combatConfig.zoom >= minZoom, [combatConfig.zoom, minZoom]);
  const maxZoom = useMemo(() => lc.BASE_VISION_IN_M / ((lc.BASE_PX_IN_M_SCALE * lc.BASE_VISION_IN_M) / 2), []);
  const isMaxZoom = useMemo(() => combatConfig.zoom <= maxZoom, [combatConfig.zoom, maxZoom]);
  const locationsContainerId = useMemo(() => `all-${userId}-locations`, [userId]);
  const map = useMemo(() => {
    let map = {};
    locations
      .map((location) => {
        //populate the obj in a flatten way
        map[location._id] = { data: location, interiorLocs: {} };
        return location;
      })
      .forEach((location, i) => {
        location.radius = lh.GetRadius(location, pxInMScale);
        location.offset = null;
        location.resetOffset = null;

        //for locs that are interior to others, add their ref
        if (map[location.exteriorLocationId]) {
          map[location.exteriorLocationId].interiorLocs[location._id] = map[location._id];
        }
      });

    return map;
  }, [locations, pxInMScale]);
  const rootLocs = useMemo(() => {
    //only keep the exterior locs
    const rootLocs = Object.keys(map).filter((locationId) => !map[locationId].data.isHidden && !map[map[locationId].data.exteriorLocationId]);
    const sortedRootLocs = lh.sortLocsByRef(rootLocs.map((locId) => map[locId].data)).map((l) => l._id);
    return sortedRootLocs;
  }, [map]);
  const isMapRendered = useMemo(() => {
    if (!shouldRender) {
      return false;
    }

    let totalLocsToRender = 0;

    const countLocsToRender = (loc) => {
      totalLocsToRender++;
      Object.values(loc.interiorLocs)
        .filter((l) => !l.data.isHidden)
        .forEach((il) => {
          countLocsToRender(il);
        });
    };

    rootLocs.forEach((locId) => {
      countLocsToRender(map[locId]);
    });

    return allLocationsRefs.length === totalLocsToRender;
  }, [allLocationsRefs.length, shouldRender, map, rootLocs]);
  const travelNodes = useMemo(() => {
    if (!currentNode) {
      return [];
    }

    let travelNodes = combatConfig.travel.travelNodes;

    //if the last node is not the current node, add current to render list
    const lastTravelledNode = combatConfig.travel.travelNodes[combatConfig.travel.travelNodes.length - 1];
    if (
      !lastTravelledNode ||
      combatConfig.travel.currentNode.x !== lastTravelledNode.x ||
      combatConfig.travel.currentNode.y !== lastTravelledNode.y ||
      combatConfig.travel.currentNode.angle !== lastTravelledNode.angle
    ) {
      travelNodes = [...travelNodes, combatConfig.travel.currentNode];
    }

    travelNodes = travelNodes.map((n, index) => ({
      ...n,
      x: n.x / pxInMScale,
      y: n.y / pxInMScale,
      isCurrent: index === travelNodes.length - 1,
    }));

    return travelNodes;
  }, [combatConfig.travel.currentNode, combatConfig.travel.travelNodes, currentNode, pxInMScale]);
  const arrowStyles = useMemo(() => {
    let nodeStyles = {};
    if (!currentNode) {
      return nodeStyles;
    }

    nodeStyles = {
      width: lc.POINT_OF_INTEREST_RADIUS,
      height: lc.POINT_OF_INTEREST_RADIUS,
      rotate: `${combatConfig.travel.currentNode.angle - 180}deg`,
    };

    return nodeStyles;
  }, [combatConfig.travel.currentNode, currentNode]);
  const visionRadius = useMemo(() => {
    if (!combatConfig.travel.currentNode) {
      return 0;
    }

    const baseVision = lc.BASE_VISION_IN_M / pxInMScale;
    let visionRadius = baseVision;

    const loc = map[combatConfig.travel.currentNode.locId] ? map[combatConfig.travel.currentNode.locId].data : combatConfig.world;
    const modifier = lc.GetPanoramicVision(loc.contexts.find((c) => c.isCurrent).panoramicVision).modifier;
    visionRadius *= modifier;

    if (combatConfig.travel.isOverlook) {
      visionRadius += baseVision * 2;
    }

    return visionRadius;
  }, [combatConfig.travel.currentNode, combatConfig.travel.isOverlook, combatConfig.world, map, pxInMScale]);
  const canTravelToPoint = useMemo(
    () => true,
    // locHoverData?.distance.isVisible
    []
  );
  const paceMove = useMemo(
    () => combatConfig.travel.pace !== lc.TRAVEL_PACES.REST && combatConfig.travel.pace !== lc.TRAVEL_PACES.ACTIVITY,
    [combatConfig.travel.pace]
  );
  const nodeStyles = useMemo(() => {
    let nodeStyles = { width: lc.POINT_OF_INTEREST_RADIUS / 3, height: lc.POINT_OF_INTEREST_RADIUS / 3 };
    if (!paceMove) {
      nodeStyles.cursor = "not-allowed";
    }

    return nodeStyles;
  }, [paceMove]);

  const handleMouseDownDrag = (e) => {
    setIsMouseDown(true);
    setInitialDragPosition({
      x: e.clientX - dragPosition.x,
      y: e.clientY - dragPosition.y,
    });
  };
  const handleMouseMoveDrag = (e) => {
    if (!isMouseDown) return;

    setIsMouseDragging(true);
    setDragPosition({
      x: e.clientX - initialDragPosition.x,
      y: e.clientY - initialDragPosition.y,
    });
  };

  function OpenModalSuggestions() {
    setModal(
      <ModalSuggestions
        notes={combatConfig.sandbox}
        onClose={(tempNotes) => {
          combatConfig.sandbox = tempNotes;
          HandleSaveCombatConfig();
          setModal(null);
        }}
      />
    );
  }

  function OpenModalTravelResults(node, isRest) {
    setIsMouseDown(false);
    if (locations.length === 0 || (!isRest && !paceMove) || isMouseDragging) {
      setIsMouseDragging(false);
      return;
    }

    if (!locHoverData) {
      return;
    }

    if (nodeToMove) {
      let originalNode = combatConfig.travel.travelNodes.find((tn) => tn.name === nodeToMove.name);
      originalNode.x = AdjustCoodernate(locHoverData.distance.centerOffset.x + (centerOffset.x - defaultCenter.x)) * -1;
      originalNode.y = AdjustCoodernate(locHoverData.distance.centerOffset.y - (centerOffset.y - defaultCenter.y));
      originalNode.angle = locHoverData.distance.centerOffset.angle;
      originalNode.locId = locHoverData.location?._id ?? userId;
      originalNode.needsReposition = false;
      HandleSaveCombatConfig();
      setNodeToMove(null);
      return;
    }

    //new current node
    let newCurrentNode = node
      ? {
          ...node,
          x: AdjustCoodernate(node.x),
          y: AdjustCoodernate(node.y),
        }
      : {
          name: null,
          notes: null,
          findResourcesDifficulty: null,
          materialRarity: null,
          isHazardous: null,
          creatures: [],
          x: AdjustCoodernate(locHoverData.distance.centerOffset.x + (centerOffset.x - defaultCenter.x)) * -1,
          y: AdjustCoodernate(locHoverData.distance.centerOffset.y - (centerOffset.y - defaultCenter.y)),
          angle: locHoverData.distance.centerOffset.angle,
          locId: locHoverData.location?._id ?? userId,
          needsReposition: false,
        };

    if (currentNode) {
      const nodeLoc = map[newCurrentNode.locId]?.data;
      const newLocation = nodeLoc ?? combatConfig.world;
      const isSameNode = combatConfig.travel.currentNode.x === newCurrentNode.x && combatConfig.travel.currentNode.y === newCurrentNode.y;
      const hasMoved =
        newLocation.size === lc.LOCATION_SIZES.POINT_OF_INTEREST && combatConfig.travel.currentNode.locId === newLocation._id ? false : !isSameNode;
      const isSafe = mapMode !== lc.MAP_MODES.TRAVEL || (!canTravelToPoint && !isRest) || locHoverData.connection;

      setModal(
        <ModalTravelResults
          systemType={combatConfig.systemType}
          isSafe={isSafe}
          isRestSafe={isRestSafe}
          mapMode={mapMode}
          onClose={setModal}
          hasMoved={hasMoved}
          newCurrentNode={newCurrentNode}
          newLocation={utils.clone(newLocation)}
          exteriorLocation={nodeLoc && map[nodeLoc.exteriorLocationId] ? utils.clone(map[nodeLoc.exteriorLocationId].data) : null}
          locHoverData={isSafe ? null : locHoverData}
          travel={combatConfig.travel}
          restTime={restTime}
          isNightTime={isNightTime}
          GetCreatureCurrentRoutine={GetCreatureCurrentRoutine}
          level={combatConfig.level}
          creatures={creatures}
          world={utils.clone(combatConfig.world)}
          mapConditionLevels={mapConditionLevels}
          GetUpdatedSchedule={GetUpdatedSchedule}
          HandleSetCurrentNode={() => HandleSetCurrentNode(newCurrentNode)}
          HandleAddTravelNode={node ? null : () => HandleAddTravelNode(newCurrentNode)}
          HandleSaveCombatConfig={HandleSaveCombatConfig}
          HandleSaveLoc={(updatedLoc) => HandleSave(updatedLoc, false)}
          encounterProb={locHoverData?.distance.encounterProb ?? 0}
          addAction={
            (node && !isSameNode) || locations.length >= lc.LOCATIONS_LIMIT
              ? null
              : () => {
                  setLocationToEdit(lc.GetNewLocation(userId, nodeLoc?._id ?? userId));
                  setModal(null);
                }
          }
          editAction={
            node && !isSameNode
              ? null
              : () => {
                  setLocationToEdit(utils.clone(newLocation));
                  setModal(null);
                }
          }
          deleteNodeAction={
            node && !isSameNode
              ? () => {
                  combatConfig.travel.travelNodes = combatConfig.travel.travelNodes.filter(
                    (tn) => tn.x !== newCurrentNode.x && tn.y !== newCurrentNode.y
                  );
                  HandleSaveCombatConfig();
                  setModal(null);
                }
              : null
          }
          moveNodeAction={
            node && !isSameNode
              ? () => {
                  node.isNodeToMove = true;
                  setNodeToMove(node);
                  setModal(null);
                }
              : null
          }
        />
      );
    } else {
      HandleSetCurrentNode(newCurrentNode);
      HandleSaveCombatConfig();
    }
  }

  function GetCreatureCurrentRoutine(locationCreature, currentContext) {
    return lh.GetCreatureCurrentRoutine(
      locationCreature,
      isNightTime ? lc.ROUTINE_SCHEDULES.NIGHT : lc.ROUTINE_SCHEDULES.DAY,
      isPrecipitating ? lc.ROUTINE_PRECIPITATIONS.PRECIPITATING : lc.ROUTINE_PRECIPITATIONS.CLEAR,
      isExtremeTemp ? lc.ROUTINE_TEMPERATURES.EXTREME : lc.ROUTINE_TEMPERATURES.NORMAL,
      currentContext?.name
    );
  }

  function HandleSetCurrentNode(newCurrentNode) {
    combatConfig.travel.currentNode = newCurrentNode;

    //update original node if it exists
    let nodeIndex = combatConfig.travel.travelNodes.findIndex((n) => n.x === newCurrentNode.x && n.y === newCurrentNode.y);
    if (nodeIndex >= 0) {
      combatConfig.travel.travelNodes.splice(nodeIndex, 1, newCurrentNode);
    }

    const newCenter = { x: newCurrentNode.x / pxInMScale, y: newCurrentNode.y / pxInMScale };
    setCenterOffset(newCenter);
    setDefaultCenter(newCenter);
  }

  function HandleAddTravelNode(newCurrentNode) {
    if (combatConfig.travel.travelNodes.length === 100) {
      combatConfig.travel.travelNodes.shift();
    }

    combatConfig.travel.travelNodes.push(newCurrentNode);
  }

  function HandleCancel() {
    UpdateEditLoc(locationToEdit._id, locationToEdit._id !== utils.reverseString(userId) ? locationToEdit : null);
    setLocationToEdit(null);
  }

  function HandleSave(location, willAdjustMap) {
    function Save() {
      if (map[location._id]) {
        allLocationsRefs.forEach((r) => {
          r.style.opacity = 0;
        });
      }

      //wait for loc save, not world
      if (locationToEdit?.exteriorLocationId) {
        MapLoadingWrapper(async () => await HandleSaveLocation(location), 200);
      } else {
        HandleSaveLocation(location);
      }

      setLocationToEdit(null);
    }

    if (willAdjustMap && combatConfig.travel.currentNode && !combatConfig.travel.currentNode.needsReposition && locationToEdit?.exteriorLocationId) {
      setModal(
        <ModalWarning
          title="Salvar Localização"
          messages={["Modificar uma localização fará o mapa ser reajustado, e todas as marcações atuais serão marcadas para ser reposicionadas"]}
          actions={[
            {
              text: "Cancelar",
              click: () => setModal(null),
              isSimple: true,
            },
            {
              text: "Salvar",
              click: () => {
                HandleLocUpdate();
                HandleSaveCombatConfig();

                Save();
                setModal(null);
              },
            },
          ]}
        />
      );
    } else {
      Save();
    }
  }

  async function HandleMove(location, newExteriorLocId, moveInteriorLocs) {
    if (map[location._id]) {
      allLocationsRefs.forEach((r) => {
        r.style.opacity = 0;
      });
    }

    if (!newExteriorLocId) {
      newExteriorLocId = userId;
    }

    let locToMoveUpdate = [
      {
        field: "exteriorLocationId",
        value: newExteriorLocId,
      },
      {
        field: "reference",
        value: { distance: null, direction: null, location: null, connectionType: null },
      },
    ];

    //if the new exterior is the world or if it has at least one non hidden loc, make the loc to move hidden
    if (!map[newExteriorLocId] || Object.keys(map[newExteriorLocId].interiorLocs).filter((il) => !il.isHidden).length > 0) {
      locToMoveUpdate.push({
        field: "isHidden",
        value: true,
      });
    } else {
      locToMoveUpdate.push({
        field: "isHidden",
        value: false,
      });
    }

    let updateLocationsReq = {
      ids: [location._id],
      updates: [locToMoveUpdate],
    };

    if (!moveInteriorLocs) {
      //this still needs work, like making then hidden since the first of area would be a problem
      // let interiorLocs = GetAllInteriorLocs(location);
      // interiorLocs.forEach((il) => {
      //   updateLocationsReq.ids.push(il.data._id);
      //   updateLocationsReq.updates.push({ field: "exteriorLocationId", value: location.exteriorLocationId });
      // });
    }

    let refLocs = GetAllRefLocs(location);
    refLocs.forEach((rl) => {
      //if loc to move has a ref, update its refs to have that ref instead, otherwize, clear it
      if (location.reference.location) {
        updateLocationsReq.ids.push(rl.data._id);
        updateLocationsReq.updates.push([
          {
            field: "reference.location",
            value: location.reference.location,
          },
        ]);
      } else {
        updateLocationsReq.ids.push(rl.data._id);
        let update = [
          {
            field: "reference",
            value: { distance: null, direction: null, location: null, connectionType: null },
          },
        ];

        //since they all won't have a ref, they need to be hidden if more than one
        if (refLocs.length > 1) {
          update.push({
            field: "isHidden",
            value: true,
          });
        }

        updateLocationsReq.updates.push(update);
      }
    });

    HandleLocUpdate();
    HandleSaveCombatConfig();

    setLocationToEdit(null);
    MapLoadingWrapper(
      async () =>
        await HandleUpdateLocations(updateLocationsReq).then(() => {
          setLocationToEdit(locations.find((l) => l._id === location._id));
        }),
      200
    );
  }

  async function HandleDelete(location, deleteInteriorLocs) {
    if (map[location._id]) {
      allLocationsRefs.forEach((r) => {
        r.style.opacity = 0;
      });
    }

    let updateLocationsReq = { ids: [], updates: [] };
    let idsToDelete = [location._id];

    let interiorLocs = GetAllInteriorLocs(location);
    if (deleteInteriorLocs) {
      idsToDelete = [...idsToDelete, ...interiorLocs.map((l) => l.data._id)];
    } else {
      //this still needs work, like making then hidden since the first of area would be a problem
      // interiorLocs.forEach((il) => {
      //   updateLocationsReq.ids.push(il.data._id);
      //   updateLocationsReq.updates.push({ field: "exteriorLocationId", value: location.exteriorLocationId });
      // });
    }

    let refLocs = GetAllRefLocs(location);
    refLocs.forEach((rl) => {
      //if loc to delete has a ref, update its refs to have that ref instead, otherwize, clear it
      if (location.reference.location) {
        updateLocationsReq.ids.push(rl.data._id);
        updateLocationsReq.updates.push([
          {
            field: "reference.location",
            value: location.reference.location,
          },
        ]);
      } else {
        updateLocationsReq.ids.push(rl.data._id);
        let update = [
          {
            field: "reference",
            value: { distance: null, direction: null, location: null, connectionType: null },
          },
        ];

        //since they all won't have a ref, they need to be hidden if more than one
        if (refLocs.length > 1) {
          update.push({
            field: "isHidden",
            value: true,
          });
        }

        updateLocationsReq.updates.push(update);
      }
    });

    if (updateLocationsReq.ids.length > 0) {
      await HandleUpdateLocations(updateLocationsReq, true);
    }

    MapLoadingWrapper(async () => await HandleDeleteLocations(idsToDelete), 200);

    HandleLocUpdate();
    HandleSaveCombatConfig();

    setLocationToEdit(null);
  }

  function HandleLocUpdate() {
    //highlights nodes that were created before this update, since the map will change and they might need to be moved
    combatConfig.travel.currentNode.needsReposition = true;
    combatConfig.travel.travelNodes.forEach((n) => {
      n.needsReposition = true;
    });
  }

  function GetUpdatedSchedule(newSchedule) {
    const dayMinutes = 1440;

    let schedule = newSchedule % dayMinutes;
    if (schedule < 0) {
      schedule = dayMinutes + schedule;
    }

    return schedule;
  }

  function HandleLocHover(e, location, node, connection) {
    let distance = { centerOffset: GetCenterOffset(e) };
    distance.isVisible = distance.centerOffset.value <= visionRadius / 8;

    if (currentNode && mapMode === lc.MAP_MODES.TRAVEL) {
      const distanceInScale = Math.round(distance.centerOffset.value * pxInMScale);
      distance.valueInUnits = utils.MInUnits(distanceInScale);

      distance.travelTimeInMin = lh.GetTravelTimeInMin(distanceInScale, combatConfig.travel);
      distance.timeInUnits = utils.MinutesToTimeInUnits(distance.travelTimeInMin);

      distance.exhaustion = Math.round(distance.travelTimeInMin * lh.GetTravelFatigueModifier(combatConfig.travel));
      distance.exhaustionInUnits = utils.MinutesToTimeInUnits(distance.exhaustion);

      if (location) {
        distance.encounterProb = GetFinalProb(location, distance.travelTimeInMin);
      }
    }

    setLocHoverData({ top: e.clientY, left: e.clientX, location, node, distance, connection });
  }

  function GetFinalProb(location, travelTimeInMin) {
    const exteriorLocation = map[location.exteriorLocationId] ? map[location.exteriorLocationId].data : null;
    const encounterLocation =
      location.size === lc.LOCATION_SIZES.POINT_OF_INTEREST && exteriorLocation && !lh.HasCertainCreature(location, GetCreatureCurrentRoutine)
        ? exteriorLocation
        : location;
    const isPointOfInterest = encounterLocation.size === lc.LOCATION_SIZES.POINT_OF_INTEREST;

    const locationContext = lh.GetCurrentContext(encounterLocation);
    const worldContext = lh.GetCurrentContext(combatConfig.world);

    const shouldlAddWorldCreatures = combatConfig.world.name !== encounterLocation.name && worldContext.name !== lc.DEFAULT_CONTEXT_NAME;
    let allCreatures = shouldlAddWorldCreatures ? [...encounterLocation.creatures, ...combatConfig.world.creatures] : encounterLocation.creatures;
    let isCertain =
      isPointOfInterest && encounterLocation.interaction?.currentCreatures
        ? encounterLocation.interaction.currentCreatures.filter((cc) => !cc.isDead).length > 0
        : allCreatures.some((c) => {
            const routine = encounterLocation.creatures.some((lc) => lc.creatureId === c.creatureId)
              ? GetCreatureCurrentRoutine(c, locationContext?.name)
              : GetCreatureCurrentRoutine(c, worldContext?.name);

            if (!routine) {
              return false;
            }

            const probability = lc.GetEncounterFrequency(routine.encounterFrequency).probability;

            return probability === 1;
          });

    if (isCertain) {
      return 1;
    }

    const finalProb = utils.ProbabilityCheckWithRatio(lc.GetHazardousness(locationContext.hazardousness).probability, travelTimeInMin / 60).finalProb;
    return finalProb;
    // return Math.min(1, utils.getProbabilityOfTwoIndependent(finalProb, combatConfig.travel.cummulativeEncounterChance));
  }

  function AdjustCoodernate(coodernate) {
    return coodernate * pxInMScale;
  }

  function GetCenterOffset(e) {
    // Get the div element that is being hovered
    const locationsDiv = document.getElementById(locationsContainerId);

    // Get the bounding rectangle of the div (position and dimensions)
    const divRect = locationsDiv.getBoundingClientRect();

    // Calculate the relative X and Y coordinates to the center of the div
    const relativeX = e.clientX - (divRect.left + divRect.width / 2) - (centerOffset.x - defaultCenter.x);
    const relativeY = (e.clientY - (divRect.top + divRect.height / 2) - (centerOffset.y - defaultCenter.y)) * -1;

    //calculate distance
    let offset = utils.GetDistanceByCoordinates(centerOffset, { x: relativeX * -1, y: relativeY });
    offset.x = relativeX;
    offset.y = relativeY;

    return offset;
  }

  function UpdateZoom(newZoom) {
    const zoomRatio = combatConfig.zoom / newZoom;
    combatConfig.zoom = newZoom;

    setDefaultCenter({ x: defaultCenter.x * zoomRatio, y: defaultCenter.y * zoomRatio });
  }

  function HandleChangeMapType(newMapMode) {
    // setDefaultCenter(newMapMode === lc.MAP_MODES.TRAVEL && currentNode ? { x: currentNode.x, y: currentNode.y } : { x: 0, y: 0 });

    setMapMode(newMapMode);
  }

  function GetAllInteriorLocs(location) {
    function AddInteriorLocsToList(loc, list) {
      Object.values(loc.interiorLocs).forEach((l) => {
        list.push(l);
        AddInteriorLocsToList(l, list);
      });
    }

    let interiorLocs = [];
    AddInteriorLocsToList(map[location._id], interiorLocs);

    return interiorLocs;
  }

  function GetAllRefLocs(location) {
    const refLocs = (map[location.exteriorLocationId] ? Object.values(map[location.exteriorLocationId].interiorLocs) : Object.values(map)).filter(
      (l) => l.data.reference.location === location._id
    );

    return refLocs;
  }

  function UpdateEditLoc(id, loc) {
    if (id != null) {
      MapLoadingWrapper(() => UpdateLocation(id, loc));
    }
  }

  async function MapLoadingWrapper(func, timer = 100) {
    setMapLoading(true);
    if (func) {
      await func();
    }

    setTimeout(() => {
      setMapLoading(false);
    }, timer);
  }

  useEffect(() => {
    if (!currentNode) {
      combatConfig.travel.pace = lc.TRAVEL_PACES.NORMAL;
    }
  }, [combatConfig.travel, currentNode, defaultCenter]);

  useEffect(() => {
    setCenterOffset(defaultCenter);
    setDragPosition({ x: 0, y: 0 });
  }, [defaultCenter]);

  useEffect(() => {
    setAllLocationsRefs([]);
    setLocationsRefs([]);
  }, [locations, mapLoading]);

  return (
    <div className="Map-container">
      {modal}
      <div
        className="world-map"
        style={{
          backgroundColor: cc.GetEnviroment(combatConfig.world.traversal.type).color,
          cursor: !paceMove
            ? "not-allowed"
            : canTravelToPoint && mapMode === lc.MAP_MODES.TRAVEL
            ? combatConfig.travel.oriented
              ? "pointer"
              : "help"
            : "default",
        }}
      >
        {/* title */}
        {locations.length === 0 ? (
          <aside className="info-msg floating-details">
            <h4>Adicione uma nova localização para vê-la no mapa</h4>
          </aside>
        ) : (
          mapMode === lc.MAP_MODES.TRAVEL && (
            <aside className="info-msg floating-details">
              {!currentNode ? (
                <h4>Clique em um ponto no mapa para posionar o grupo</h4>
              ) : (
                <h4>{map[currentNode.locId] ? map[currentNode.locId].data.name : combatConfig.world.name}</h4>
              )}
            </aside>
          )
        )}

        {/* hover */}
        {locations.length > 0 && locHoverData && paceMove && !isMouseDragging && (
          <div className="location-details floating-details" style={{ ...locHoverData.style, top: locHoverData.top, left: locHoverData.left }}>
            {locHoverData.location && (
              <LocationSummary
                userId={userId}
                location={locHoverData.location}
                connection={locHoverData.connection}
                id={locHoverData.location._id}
                setLocationToEdit={setLocationToEdit}
                setLocHoverData={setLocHoverData}
                locations={locations}
                creatures={creatures}
                world={combatConfig.world}
                schedule={isNightTime ? lc.ROUTINE_SCHEDULES.NIGHT : lc.ROUTINE_SCHEDULES.DAY}
                precipitation={isPrecipitating ? lc.ROUTINE_PRECIPITATIONS.PRECIPITATING : lc.ROUTINE_PRECIPITATIONS.CLEAR}
                temperature={isExtremeTemp ? lc.ROUTINE_TEMPERATURES.EXTREME : lc.ROUTINE_TEMPERATURES.NORMAL}
                distance={locHoverData.distance}
                willExhaust={(combatConfig.travel.exhaustionTimer + locHoverData.distance?.exhaustion ?? 0) / 60 >= exhaustionThreshold.current}
                canTravelToPoint={canTravelToPoint}
                lastEncounterLocId={combatConfig.travel.lastEncounterLocId}
              />
            )}
            {locHoverData.node?.name && (
              <div className="node-summary">
                {locHoverData.node.name && (
                  <span className={`name${locHoverData.node.needsReposition ? " needs-reposition" : ""}`}>{locHoverData.node.name}</span>
                )}
                {locHoverData.node.notes && <span className="notes">{locHoverData.node.notes}</span>}
              </div>
            )}
          </div>
        )}

        {locations.length > 0 && (
          <>
            {mapMode === lc.MAP_MODES.TRAVEL && (
              <aside className="travel-details floating-details" style={{ borderColor: mapConditionLevels.current[exhaustionIndex] }}>
                <h5>Marcha</h5>
                <div className="divider"></div>
                <Select
                  label={"Ritmo de viagem"}
                  extraWidth={75}
                  value={combatConfig}
                  valuePropertyPath="travel.pace"
                  onSelect={setCombatConfig}
                  options={lc.travelPaces}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                  optionsAtATime={8}
                  isDisabled={!currentNode}
                />
                {!paceMove ? (
                  <div className="rest-wrapper">
                    <Select
                      label={"Passagem do tempo"}
                      extraWidth={75}
                      value={restTime}
                      onSelect={setRestTime}
                      options={lc.restTimes}
                      optionDisplay={(o) => o.display}
                      optionValue={(o) => o.value}
                    />
                    <Button
                      text={combatConfig.travel.pace === lc.TRAVEL_PACES.REST ? "Descansar" : "Começar"}
                      info={[
                        {
                          text: `Chance encontro: ${
                            isRestSafe
                              ? "-"
                              : utils.turnValueIntoPercentageString(
                                  GetFinalProb(map[currentNode.locId]?.data ?? combatConfig.world, lc.GetRestTime(restTime).timeInMin)
                                )
                          }`,
                        },
                      ]}
                      onClick={() => OpenModalTravelResults(currentNode, true)}
                    />
                    <CheckInput
                      label="Tempo seguro"
                      onClick={() => setIsRestSafe(!isRestSafe)}
                      isSelected={isRestSafe}
                      info={[{ text: "Não há chance de encontro" }]}
                    />
                  </div>
                ) : (
                  <>
                    <Select
                      label={"Maior Carga"}
                      extraWidth={75}
                      value={combatConfig}
                      valuePropertyPath="travel.load"
                      onSelect={setCombatConfig}
                      options={lc.travelLoads}
                      optionDisplay={(o) => o.display}
                      optionValue={(o) => o.value}
                    />
                    <div className="df df-fd-c travel-options">
                      <CheckInput
                        label="Montados"
                        onClick={() =>
                          setCombatConfig({
                            ...combatConfig,
                            travel: { ...combatConfig.travel, isMounted: !combatConfig.travel.isMounted },
                          })
                        }
                        isSelected={combatConfig.travel.isMounted}
                        info={[{ text: "Reduz fadiga em 50%" }]}
                      />
                      <CheckInput
                        label="Local Alto"
                        onClick={() =>
                          setCombatConfig({
                            ...combatConfig,
                            travel: { ...combatConfig.travel, isOverlook: !combatConfig.travel.isOverlook },
                          })
                        }
                        isSelected={combatConfig.travel.isOverlook}
                        info={[{ text: "Amplifica visão" }]}
                      />
                      <CheckInput
                        label="Orientados"
                        onClick={() =>
                          setCombatConfig({
                            ...combatConfig,
                            travel: { ...combatConfig.travel, oriented: !combatConfig.travel.oriented },
                          })
                        }
                        isSelected={combatConfig.travel.oriented}
                        info={[
                          { text: "Ponto de referência visível para se guiar" },
                          { text: "" },
                          { text: "Chance de levemente desviar da direçao. Percepitível com o tempo" },
                        ]}
                      />
                    </div>
                  </>
                )}
                <div className="divider"></div>
                {/* <h6>Total Acumulado</h6> */}
                <h6>Desgaste Acumulado</h6>
                <div className="stat-section">
                  <button
                    onClick={() =>
                      setCombatConfig({
                        ...combatConfig,
                        travel: {
                          ...combatConfig.travel,
                          exhaustionTimer: combatConfig.travel.exhaustionTimer > 60 ? combatConfig.travel.exhaustionTimer - 60 : 0,
                        },
                      })
                    }
                    // eslint-disable-next-line eqeqeq
                    disabled={exhaustionTimer == 0}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <h5 style={isExhausted ? { color: mapConditionLevels.current[exhaustionIndex] } : {}}>
                    {exhaustionTimer % 1 === 0 ? parseInt(exhaustionTimer) : exhaustionTimer} Horas
                  </h5>
                  <button
                    onClick={() =>
                      setCombatConfig({
                        ...combatConfig,
                        travel: { ...combatConfig.travel, exhaustionTimer: combatConfig.travel.exhaustionTimer + 60 },
                      })
                    }
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                  {/* <Info
                    contents={[
                      { text: "Cada 8 horas acumuladas pode conceder exaustão" },
                      { text: "" },
                      { text: "Descansar reduz o total acumulado" },
                    ]}
                  /> */}
                </div>
              </aside>
            )}
            <aside className="map-zoom floating-details">
              <div className="stat-section">
                {/* <button onClick={() => setCenterOffset({ ...centerOffset, y: centerOffset.y + GetOffsetRatioValue().y * 2 })}>
                  <i className="fas fa-caret-up"></i>
                </button>
                <button onClick={() => setCenterOffset({ ...centerOffset, x: centerOffset.x + GetOffsetRatioValue().x })}>
                  <i className="fas fa-caret-left"></i>
                </button> */}
                <button
                  title="Centrar"
                  onClick={() => {
                    setCenterOffset(defaultCenter);
                    setDragPosition({ x: 0, y: 0 });
                  }}
                >
                  <i className="fas fa-crosshairs"></i>
                </button>
                {/* <button onClick={() => setCenterOffset({ ...centerOffset, x: centerOffset.x - GetOffsetRatioValue().x })}>
                  <i className="fas fa-caret-right"></i>
                </button>
                <button onClick={() => setCenterOffset({ ...centerOffset, y: centerOffset.y - GetOffsetRatioValue().y * 2 })}>
                  <i className="fas fa-caret-down"></i>
                </button> */}
              </div>
              <div className="stat-section">
                <button onClick={() => MapLoadingWrapper(() => UpdateZoom(minZoom))} disabled={isMinZoom}>
                  <i className="fas fa-minus-square"></i>
                </button>
                <button
                  onClick={() => MapLoadingWrapper(() => UpdateZoom(combatConfig.zoom * 1.3 >= minZoom ? minZoom : combatConfig.zoom * 1.3))}
                  disabled={isMinZoom}
                >
                  <i className="fas fa-minus"></i>
                </button>
                <button
                  title="Resetar"
                  onClick={() => {
                    if (defaultZoom.current !== combatConfig.zoom) {
                      MapLoadingWrapper(() => UpdateZoom(defaultZoom.current));
                    }
                  }}
                >
                  <i className="fas fa-search"></i>
                </button>
                <button
                  onClick={() => MapLoadingWrapper(() => UpdateZoom(combatConfig.zoom * 0.7 <= maxZoom ? maxZoom : combatConfig.zoom * 0.7))}
                  disabled={isMaxZoom}
                >
                  <i className="fas fa-plus"></i>
                </button>
                <button onClick={() => MapLoadingWrapper(() => UpdateZoom(maxZoom))} disabled={isMaxZoom}>
                  <i className="fas fa-plus-square"></i>
                </button>
              </div>
              {/* <div className="compass">N</div> */}
            </aside>
            {mapMode === lc.MAP_MODES.TRAVEL && (
              <aside className="travel-stats floating-details">
                <div className="stat-section">
                  <button
                    title="Amanhecer"
                    onClick={() => setCombatConfig({ ...combatConfig, travel: { ...combatConfig.travel, schedule: dayTimeThreshold.current } })}
                  >
                    <i className="fas fa-sun"></i>
                  </button>
                  <button
                    onClick={() =>
                      setCombatConfig({
                        ...combatConfig,
                        travel: { ...combatConfig.travel, schedule: GetUpdatedSchedule(combatConfig.travel.schedule - 60) },
                      })
                    }
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <h4>{currentTime}</h4>
                  <button
                    onClick={() =>
                      setCombatConfig({
                        ...combatConfig,
                        travel: { ...combatConfig.travel, schedule: GetUpdatedSchedule(combatConfig.travel.schedule + 60) },
                      })
                    }
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                  <button
                    title="Anoitecer"
                    onClick={() => setCombatConfig({ ...combatConfig, travel: { ...combatConfig.travel, schedule: nightTimeThreshold.current } })}
                  >
                    <i className="fas fa-moon"></i>
                  </button>
                </div>

                <div className="stat-section" style={{ borderColor: mapConditionLevels.current[combatConfig.travel.precipitation] }}>
                  <button
                    title="Limpar"
                    onClick={() => setCombatConfig({ ...combatConfig, travel: { ...combatConfig.travel, precipitation: 0 } })}
                    disabled={combatConfig.travel.precipitation === 0}
                  >
                    <i className="fas fa-rainbow"></i>
                  </button>
                  <button
                    onClick={() =>
                      setCombatConfig({ ...combatConfig, travel: { ...combatConfig.travel, precipitation: combatConfig.travel.precipitation - 1 } })
                    }
                    disabled={combatConfig.travel.precipitation === 0}
                  >
                    <i className="fas fa-minus"></i>
                  </button>

                  {isPrecipitating ? (
                    <h4 style={{ color: mapConditionLevels.current[combatConfig.travel.precipitation] }}>
                      {lc.GetRoutinePrecipitation(lc.ROUTINE_PRECIPITATIONS.PRECIPITATING).display}
                    </h4>
                  ) : (
                    <h4>{lc.GetRoutinePrecipitation(lc.ROUTINE_PRECIPITATIONS.CLEAR).display}</h4>
                  )}

                  <button
                    onClick={() =>
                      setCombatConfig({ ...combatConfig, travel: { ...combatConfig.travel, precipitation: combatConfig.travel.precipitation + 1 } })
                    }
                    disabled={isPrecipitating}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                  <button
                    title="Precipitar"
                    onClick={() =>
                      setCombatConfig({ ...combatConfig, travel: { ...combatConfig.travel, precipitation: mapConditionLevels.current.length - 1 } })
                    }
                    disabled={isPrecipitating}
                  >
                    <i className="fas fa-cloud-showers-heavy"></i>
                  </button>
                </div>

                <div className="stat-section" style={{ borderColor: mapConditionLevels.current[combatConfig.travel.temperature] }}>
                  <button
                    title="Normal"
                    onClick={() => setCombatConfig({ ...combatConfig, travel: { ...combatConfig.travel, temperature: 0 } })}
                    disabled={combatConfig.travel.temperature === 0}
                  >
                    <i className="fas fa-thermometer-empty"></i>
                  </button>
                  <button
                    onClick={() =>
                      setCombatConfig({ ...combatConfig, travel: { ...combatConfig.travel, temperature: combatConfig.travel.temperature - 1 } })
                    }
                    disabled={combatConfig.travel.temperature === 0}
                  >
                    <i className="fas fa-minus"></i>
                  </button>

                  {isExtremeTemp ? (
                    <h4 style={{ color: mapConditionLevels.current[combatConfig.travel.temperature] }}>
                      {lc.GetRoutineTemperature(lc.ROUTINE_TEMPERATURES.EXTREME).display}
                    </h4>
                  ) : (
                    <h4>{lc.GetRoutineTemperature(lc.ROUTINE_TEMPERATURES.NORMAL).display}</h4>
                  )}

                  <button
                    onClick={() =>
                      setCombatConfig({ ...combatConfig, travel: { ...combatConfig.travel, temperature: combatConfig.travel.temperature + 1 } })
                    }
                    disabled={isExtremeTemp}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                  <button
                    title="Intensa"
                    onClick={() =>
                      setCombatConfig({ ...combatConfig, travel: { ...combatConfig.travel, temperature: mapConditionLevels.current.length - 1 } })
                    }
                    disabled={isExtremeTemp}
                  >
                    <i className="fas fa-thermometer-full"></i>
                  </button>
                </div>
              </aside>
            )}
            <aside className="map-modes floating-details">
              {lc.mapModes.map((m) => (
                <SelectButton
                  isSelected={m.value === mapMode}
                  isLong={false}
                  text={m.display}
                  onClick={() => HandleChangeMapType(m.value)}
                  key={m.value}
                />
              ))}
            </aside>
          </>
        )}

        {(locations.length === 0 || mapMode !== lc.MAP_MODES.TRAVEL) && (
          <aside className="suggestions floating-details">
            <Button icon={"fas fa-lightbulb"} onClick={OpenModalSuggestions} />
          </aside>
        )}

        {!mapLoading && (
          <div
            id={locationsContainerId}
            className="locations"
            style={{
              translate: `${centerOffset.x}px ${centerOffset.y}px`,
              left: dragPosition.x + "px",
              top: dragPosition.y + "px",
              cursor: isMouseDragging ? "move" : "",
            }}
            onMouseDown={handleMouseDownDrag}
            onMouseMove={handleMouseMoveDrag}
            onMouseLeave={() => setIsMouseDown(false)}
          >
            {/* time filter */}
            {mapMode === lc.MAP_MODES.TRAVEL && (isNearDayOrNightTime || isNightTime) && (
              <div className={`max-dimentions time-filter${isNearDayOrNightTime ? " near-night-or-day" : " night"}`}></div>
            )}

            {/* travel */}
            {mapMode === lc.MAP_MODES.TRAVEL &&
              travelNodes.map((n, index) => {
                let updatedStyles = { ...nodeStyles, translate: `${n.x * -1}px ${n.y * -1}px` };
                if (n.isNodeToMove) {
                  updatedStyles.backgroundColor = "white";
                } else if (n.needsReposition) {
                  updatedStyles.backgroundColor = "red";
                }

                return (
                  <div
                    className="travel-none floating-details"
                    style={updatedStyles}
                    key={index}
                    onClick={() => OpenModalTravelResults(n)}
                    onMouseMove={(e) => HandleLocHover(e, null, n)}
                    onMouseLeave={(e) => HandleLocHover(e)}
                  >
                    {n.isCurrent && (
                      <>
                        {/* {!isNightTime && (
                          <div className="vision floating-details day-vision" style={{ width: visionRadius / 4, height: visionRadius / 4 }}></div>
                        )} */}
                        {/* <div
                          className="vision floating-details night-vision"
                          style={{ width: maxVisionRadius / 4, height: maxVisionRadius / 4 }}
                        ></div> */}
                        <div className="direction-arrow floating-details" style={arrowStyles}>
                          <div className="pointer"></div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

            {/* world */}
            <div
              className="world max-dimentions"
              onClick={() => OpenModalTravelResults()}
              onMouseMove={(e) => HandleLocHover(e, combatConfig.world)}
              onMouseLeave={(e) => HandleLocHover(e)}
            ></div>

            {/* locs */}
            {rootLocs.map((locationId) => {
              return (
                <Location
                  key={locationId}
                  loc={map[locationId]}
                  map={map}
                  locations={locations}
                  pxInMScale={pxInMScale}
                  locationsRefs={locationsRefs}
                  setLocationsRefs={setLocationsRefs}
                  allLocationsRefs={allLocationsRefs}
                  setAllLocationsRefs={setAllLocationsRefs}
                  isMapRendered={isMapRendered}
                  HandleHover={HandleLocHover}
                  travel={() => OpenModalTravelResults()}
                  zoom={combatConfig.zoom}
                  isMobileDevice={isMobileDevice}
                />
              );
            })}

            {/* final flat place */}
            <div id="flat-locs" className="Location-container"></div>
          </div>
        )}

        {/* floating */}
        <aside className="world-details floating-details">
          <LocationSummary
            userId={userId}
            location={combatConfig.world}
            map={map}
            id={userId}
            setLocationToEdit={setLocationToEdit}
            setLocHoverData={setLocHoverData}
            locations={locations}
            creatures={creatures}
            world={combatConfig.world}
            schedule={isNightTime ? lc.ROUTINE_SCHEDULES.NIGHT : lc.ROUTINE_SCHEDULES.DAY}
            precipitation={isPrecipitating ? lc.ROUTINE_PRECIPITATIONS.PRECIPITATING : lc.ROUTINE_PRECIPITATIONS.CLEAR}
            temperature={isExtremeTemp ? lc.ROUTINE_TEMPERATURES.EXTREME : lc.ROUTINE_TEMPERATURES.NORMAL}
          />
        </aside>

        {/* edit loc */}
        {locationToEdit && (
          <>
            <div className="edit-blocker"></div>
            <div className="edit-location">
              <EditLocation
                locationToEdit={locationToEdit}
                UpdateLocation={UpdateEditLoc}
                HandleSave={HandleSave}
                HandleMove={HandleMove}
                HandleDelete={locationToEdit.owner ? HandleDelete : null}
                FinishEditing={HandleCancel}
                HandleSelectFromBestiary={HandleSelectFromBestiary}
                setSelectedCreatures={setSelectedCreatures}
                creatures={creatures}
                locations={locations}
                world={combatConfig.world}
                map={map}
                GetAllInteriorLocs={GetAllInteriorLocs}
                isNewLoc={isNewLoc}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Map;
