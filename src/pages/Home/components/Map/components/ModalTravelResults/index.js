import React, { useState, useRef, useMemo, useCallback } from "react";
import * as utils from "../../../../../../utils";
import * as cc from "../../../../../../constants/creatureConstants";
import * as lc from "../../../../../../constants/locationConstants";
import * as ch from "../../../../../../helpers/creatureHelper";
import * as lh from "../../../../../../helpers/locationHelper";
import * as th from "../../../../../../helpers/treasureHelper";

import Dungeon from "../Dungeon";
import Info from "../../../../../../components/Info";
import SelectButton from "../../../../../../components/SelectButton";
import TextInput from "../../../../../../components/TextInput";
import Button from "../../../../../../components/Button";
import Modal from "../../../../../../components/Modal";
import ModalExport from "../../../../../../components/ModalExport";

import "./styles.css";

function ModalTravelResults({
  isSafe,
  isRestSafe,
  mapMode,
  onClose,
  hasMoved,
  newCurrentNode,
  newLocation,
  exteriorLocation,
  locHoverData,
  travel,
  restTime,
  isNightTime,
  GetCreatureCurrentRoutine,
  level,
  creatures,
  world,
  mapConditionLevels,
  GetUpdatedSchedule,
  HandleSetCurrentNode,
  HandleAddTravelNode,
  HandleSaveCombatConfig,
  HandleSaveLoc,
  encounterProb,
  addAction,
  editAction,
  deleteNodeAction,
  moveNodeAction,
}) {
  const avatarProportion = useRef(60);
  const [timePassed, setTimePassed] = useState(
    travel.pace !== lc.TRAVEL_PACES.REST && travel.pace !== lc.TRAVEL_PACES.ACTIVITY ? 0 : lc.GetRestTime(restTime).timeInMin
  );
  const ProbUpdatedByTravelTimeModCheck = useCallback(
    (probability, updateTimePassed = false) => {
      try {
        const travelTimeMod = (hasMoved ? locHoverData.distance.travelTimeInMin : timePassed) / 60;
        const check = utils.ProbabilityCheckWithRatio(probability, travelTimeMod);
        const updatedTimePassed = Math.round(check.ratioChecked * 60);

        if (updateTimePassed && updatedTimePassed !== timePassed) {
          setTimePassed(updatedTimePassed);
        }

        return check.probabilityCheck;
      } catch (error) {
        return false;
      }
    },
    [hasMoved, locHoverData, timePassed]
  );
  const DETAILS_VIEWS = useRef({
    MARCH: 0,
    FIRST_IMPRESSIONS: 1,
    DETAILS: 2,
    RUMORS: 3,
    SECRETS: 4,
    CREATURES: 5,
  });
  const ROOM_DETAILS_VIEWS = useRef({
    ROOM: 0,
    FIRST_IMPRESSIONS: 1,
    SECRETS: 2,
  });
  const defaultNotes = useRef("Nenhum ponto chama a atençao…");
  const viewingCurrent = useMemo(
    () => !hasMoved && travel.pace !== lc.TRAVEL_PACES.REST && travel.pace !== lc.TRAVEL_PACES.ACTIVITY,
    [hasMoved, travel.pace]
  );
  const [location, setLocation] = useState(GetModalLocation());
  const currentContext = useMemo(() => lh.GetCurrentContext(location), [location]);
  const allLocationCreatures = useMemo(() => {
    let allLocationCreatures = newLocation.creatures;

    newLocation.interaction?.rooms
      .filter((r) => r)
      .forEach((r) => {
        r.creatures.forEach((c) => {
          if (!allLocationCreatures.some((lc) => lc.creatureId === c.creatureId)) {
            allLocationCreatures.push(c);
          }
        });
      });

    return newLocation.creatures;
  }, [newLocation.creatures, newLocation.interaction]);
  const isPointOfInterest = useMemo(() => newLocation.size === lc.LOCATION_SIZES.POINT_OF_INTEREST, [newLocation.size]);
  const encounterLocation = useRef(
    isPointOfInterest &&
      exteriorLocation &&
      (hasMoved || location.creatures.length === 0) &&
      !lh.HasCertainCreature(location, GetCreatureCurrentRoutine)
      ? exteriorLocation
      : location
  );
  const [addExteriorCreatures, setAddExteriorCreatures] = useState(
    (hasMoved || timePassed) && isPointOfInterest && encounterLocation.current._id !== location._id
  );
  const [roomIndex, SetRoomIndex] = useState(
    newCurrentNode.roomIndex != null && location.interaction?.rooms.some((_, i) => i === newCurrentNode.roomIndex)
      ? newCurrentNode.roomIndex
      : isPointOfInterest
      ? -1
      : null
  );
  const room = useMemo(
    () => (roomIndex != null ? (roomIndex === -1 ? location.interaction : location.interaction.rooms[roomIndex]) : null),
    [location.interaction, roomIndex]
  );
  const roomDimentions = useMemo(() => {
    if (!room || !room.size) return null;

    const sizeInMeters = lc.GetRoomSize(room.size).meters;
    if (sizeInMeters) {
      return `${sizeInMeters}m x ${sizeInMeters}m x ${lc.GetRoomHeight(room.height).metersDisplay} (altura)`;
    } else {
      return `${lc.GetRoomHeight(room.height).metersDisplay} (altura)`;
    }
  }, [room]);
  const roomType = useMemo(() => {
    if (!room || !room.type) return null;

    return `${lc.GetElementType(room.type).display}${room.isHazardous ? " (perigoso)" : ""}`;
  }, [room]);

  const element = useRef(
    HandleAddTravelNode && !isPointOfInterest && !isSafe && newLocation.traversal.elements
      ? utils.randomItemFromArray(
          newLocation.traversal.elements.filter((e) => ProbUpdatedByTravelTimeModCheck(lc.GetEncounterFrequency(e.frequency).probability))
        )
      : null
  );
  const findResourcesDifficulty = useRef(
    newCurrentNode.findResourcesDifficulty ??
      ch.GetDCValue(lc.GetResourceEasiness(newLocation.contexts.find((c) => c.isCurrent).resourceEasiness).difficult, level)
  );
  const materialRarity = useMemo(
    () =>
      //if can save
      HandleAddTravelNode
        ? //if can check
          element.current?.material.probability &&
          utils.ProbabilityCheck(lc.GetElementMaterialFrequency(element.current.material.probability).probability)
          ? element.current.material.rarity
          : //othewise, if point of interest
          isPointOfInterest
          ? room?.rarity
          : //otherwise null
            null
        : //otherwise current
          newCurrentNode.materialRarity,
    [HandleAddTravelNode, isPointOfInterest, newCurrentNode.materialRarity, room]
  );
  const materialRarityDisplay = useMemo(() => (materialRarity ? cc.GetRarity(materialRarity).treasureDisplay : null), [materialRarity]);
  const isHazardous = useMemo(
    () =>
      isPointOfInterest
        ? null
        : newCurrentNode.isHazardous ??
          (element.current?.hazardousness && utils.ProbabilityCheck(lc.GetMaterialExtractionDifficulty(element.current.hazardousness).probability)),
    [isPointOfInterest, newCurrentNode.isHazardous]
  );

  const encounterLocContext = useRef(lh.GetCurrentContext(encounterLocation.current));
  const worldContext = useRef(lh.GetCurrentContext(world));
  const shouldAddWorldCreatures = useRef(world.name !== encounterLocation.current.name && worldContext.current.name !== lc.DEFAULT_CONTEXT_NAME);

  const hasAnyCreature = useRef(encounterLocation.current.creatures.length > 0 || (shouldAddWorldCreatures.current && world.creatures.length > 0));
  const isEncounter = useRef(
    hasAnyCreature.current &&
      !(roomIndex > 0) &&
      !isRestSafe &&
      (ProbUpdatedByTravelTimeModCheck(lc.GetHazardousness(encounterLocContext.current.hazardousness).probability, true) ||
        lh.HasCertainCreature(encounterLocation.current, GetCreatureCurrentRoutine) ||
        encounterProb === 1 ||
        utils.ProbabilityCheck(travel.cummulativeEncounterChance))
  );
  const [killedCreaturesIndeces, setKilledCreaturesIndeces] = useState([]);
  const nodeCreatures = useMemo(() => {
    function GetNodeCreatures() {
      function GetCreatureCondition() {
        const dayTimeImminentEncounterProb = 0.5;
        const nightTimeImminentEncounterProb = 1;

        return isEncounter.current
          ? //emcounter conditions
            utils.ProbabilityCheck(
              Math.min(
                isNightTime ? nightTimeImminentEncounterProb : dayTimeImminentEncounterProb * lc.GetTravelPace(travel.pace).imminentEncounterProbMod,
                1
              )
            )
            ? lc.NODE_CREATURE_CONDITIONS.IMMINENT
            : lc.NODE_CREATURE_CONDITIONS.NEAR
          : //other
          ProbUpdatedByTravelTimeModCheck(lc.GetHazardousness(encounterLocContext.current.hazardousness).probability)
          ? lc.NODE_CREATURE_CONDITIONS.REMAINS
          : lc.NODE_CREATURE_CONDITIONS.TRACKS;
      }

      function GetHighestEncounterFrequencyCreaturesInBinding(binding, creatures, context) {
        let creaturesWithProb = binding.map((b) => {
          const routine = GetCreatureCurrentRoutine(
            creatures.find((c) => c.creatureId === b),
            context
          );
          return { id: b, probability: routine ? lc.GetEncounterFrequency(routine.encounterFrequency).probability : 0 };
        });

        creaturesWithProb.sort((a, b) => b.probability - a.probability);
        const maxProbability = creaturesWithProb[0].probability;
        creaturesWithProb = creaturesWithProb.filter((obj) => obj.probability === maxProbability);

        return creaturesWithProb.map((obj) => obj.id);
      }

      function AddBoundCreatures(creature, locationCreatures) {
        const locBinding = encounterLocation.current.boundCreatures.find((b) => b.includes(creature.creatureId));
        const worldBinding = world.boundCreatures.find((b) => b.includes(creature.creatureId));
        const binding = utils.randomItemFromArray(shouldAddWorldCreatures.current && worldBinding ? [locBinding, worldBinding] : [locBinding]);

        if (binding) {
          creature.binding = binding;
          locationCreatures
            .filter((c) => c.condition == null && binding.includes(c.creatureId))
            .forEach((c) => {
              c.condition = GetCreatureCondition();
              c.binding = binding;
            });
        }
      }

      let newNodeCreatures = newCurrentNode.currentCreatures ?? [];
      if (newNodeCreatures.length === 0) {
        const differentCreatureProb = 0.5;

        if (!hasAnyCreature.current) {
          return [];
        }

        let allCreatures = shouldAddWorldCreatures.current
          ? [...encounterLocation.current.creatures, ...world.creatures]
          : encounterLocation.current.creatures;

        //setup
        let locationCreatures = allCreatures
          //keep only creatures that remain
          .filter((c) => !c.population || c.population.current > 0)
          .map((c, i, self) => {
            let details = encounterLocation.current.creatures.some((lc) => lc.creatureId === c.creatureId)
              ? {
                  routine: GetCreatureCurrentRoutine(c, encounterLocContext.current),
                  creatures: encounterLocation.current.creatures,
                  context: encounterLocContext.current,
                }
              : { routine: GetCreatureCurrentRoutine(c, worldContext.current), creatures: world.creatures, context: encounterLocContext.current };
            if (!details.routine) {
              return null;
            }

            const groupSize = lc.GetGroupSize(details.routine.groupSize);
            const number = utils.randomIntFromInterval(groupSize.min, groupSize.max);
            const probability = lc.GetEncounterFrequency(details.routine.encounterFrequency).probability;

            //check if no binding or this is the first creature with the highest encounter frequency in the binding
            const binding =
              encounterLocation.current.boundCreatures.find((b) => b.includes(c.creatureId)) ??
              world.boundCreatures.find((b) => b.includes(c.creatureId));
            const hefcib = binding ? GetHighestEncounterFrequencyCreaturesInBinding(binding, details.creatures, details.context) : [];
            const isHighest = hefcib.includes(c.creatureId);
            const previousCreatures = self.slice(0, i);
            const shouldCheckProb =
              !binding || (isHighest && (previousCreatures.length === 0 || !previousCreatures.some((sc) => hefcib.includes(sc.creatureId))));

            return {
              creatureId: c.creatureId,
              binding: c.binding,
              number: c.population ? Math.min(c.population.current, number) : number,
              encounterFrequency: details.routine.encounterFrequency,
              isEncounter:
                isEncounter.current && shouldCheckProb ? utils.ProbabilityCheck(probability) : ProbUpdatedByTravelTimeModCheck(probability),
            };
          })
          .filter((c) => c);

        //if no creatures, return empty
        if (locationCreatures.length === 0) {
          return [];
        }

        //add creatures that isEncounter
        let possibleEncounterCreatures = locationCreatures.filter((c) => c.isEncounter);
        if (possibleEncounterCreatures.length > 0) {
          let addToEncounter = true;

          let certainCreatures = possibleEncounterCreatures.filter((c) => c.encounterFrequency === lc.ENCOUNTER_FREQUENCIES.CERTAIN);
          if (certainCreatures.length > 0) {
            certainCreatures.forEach((c) => {
              c.condition = GetCreatureCondition();
            });

            if (!utils.ProbabilityCheck(differentCreatureProb)) {
              addToEncounter = false;
            }
          }

          while (addToEncounter) {
            let creatures = possibleEncounterCreatures.filter((c) => c.condition == null);
            if (creatures.length > 0) {
              let creature = utils.randomItemFromArray(creatures);
              creature.condition = GetCreatureCondition();

              //add bound creatures
              AddBoundCreatures(creature, locationCreatures);

              if (!utils.ProbabilityCheck(differentCreatureProb)) {
                addToEncounter = false;
              }
            } else {
              addToEncounter = false;
            }
          }
        }

        //if none isEncounter, add 1 creature
        if (
          isEncounter.current &&
          !locationCreatures.some((c) => c.condition === lc.NODE_CREATURE_CONDITIONS.IMMINENT || c.condition === lc.NODE_CREATURE_CONDITIONS.NEAR)
        ) {
          locationCreatures.sort((a, b) => b.encounterFrequency - a.encounterFrequency);
          const moreCommonCreatures = locationCreatures.filter((c) => c.encounterFrequency === locationCreatures[0].encounterFrequency);
          let creature = utils.randomItemFromArray(moreCommonCreatures);
          creature.condition = GetCreatureCondition();

          //add bound creatures
          AddBoundCreatures(creature, locationCreatures);
        }

        locationCreatures.forEach((locC) => {
          utils.createArrayFromInt(locC.number).forEach((_, index, arr) => {
            newNodeCreatures.push({
              creatureId: locC.creatureId,
              bindingFirst: locC.binding && locC.binding[0] === locC.creatureId && index === 0,
              bindingLast: locC.binding && locC.binding[locC.binding.length - 1] === locC.creatureId && index === arr.length - 1,
              isDead: false,
              condition: locC.condition ?? lc.NODE_CREATURE_CONDITIONS.NONE,
            });
          });
        });

        newCurrentNode.currentCreatures = newNodeCreatures;
      }

      return newNodeCreatures;
    }

    if (!location) return [];

    return roomIndex != null
      ? //rooms
        roomIndex === -1 && addExteriorCreatures
        ? //entrance
          GetNodeCreatures()
        : //room
          room?.currentCreatures ?? []
      : //loc
      viewingCurrent
      ? //current node
        newCurrentNode.creatures
      : //new node
        GetNodeCreatures();
  }, [
    location,
    addExteriorCreatures,
    GetCreatureCurrentRoutine,
    ProbUpdatedByTravelTimeModCheck,
    isNightTime,
    newCurrentNode,
    room,
    roomIndex,
    travel.pace,
    viewingCurrent,
    world.creatures,
    world.boundCreatures,
  ]);
  const uniqueNodeCreatures = useMemo(() => {
    let uniqueNodeCreatures = [];
    Object.values(utils.GroupArrayBy(nodeCreatures, "creatureId")).forEach((creatureList) => {
      uniqueNodeCreatures.push({ ...creatureList[0], number: creatureList.length });
    });

    return uniqueNodeCreatures;
  }, [nodeCreatures]);
  const GetRoomCreatures = useCallback(() => {
    if (!location) return [];

    //calc dist
    const nearCreatures = nodeCreatures.filter((c) => c.condition === lc.NODE_CREATURE_CONDITIONS.NEAR).length;
    const maxNearDist = 36;
    const midDist = 18;
    const imminentCreatures = nodeCreatures.filter((c) => c.condition === lc.NODE_CREATURE_CONDITIONS.IMMINENT).length;
    const maxImminentDist = 9;

    const isImminent = imminentCreatures > nearCreatures;
    const isBase = nearCreatures === 0 || imminentCreatures === 0;
    const maxDist = isBase ? (isImminent ? maxImminentDist : maxNearDist) : (maxNearDist - maxImminentDist) * (nearCreatures / imminentCreatures);
    const minValue = 1;
    const maxValue = 8;
    const numberOfReducers = maxDist === maxNearDist ? 3 : maxDist >= midDist ? 2 : 1;
    const reducerList = utils.createArrayFromInt(numberOfReducers).map((_) => utils.randomIntFromInterval(minValue, maxValue));
    const totalReducer = reducerList.reduce((acc, curr) => acc + curr, 0);
    const finalDistance = maxDist - totalReducer;

    return {
      condition: isImminent ? lc.NODE_CREATURE_CONDITIONS.IMMINENT : lc.NODE_CREATURE_CONDITIONS.NEAR,
      distance: `(${Math.round(finalDistance)}m)`,
      creatures: nodeCreatures
        .filter((c) => !c.condition || c.condition === lc.NODE_CREATURE_CONDITIONS.IMMINENT || c.condition === lc.NODE_CREATURE_CONDITIONS.NEAR)
        .map((nc, index) => {
          const creature = creatures.find((c) => c._id === nc.creatureId);
          const isDead = isPointOfInterest ? nc.isDead : killedCreaturesIndeces.includes(index);

          return {
            id: nc.creatureId,
            bindingFirst: nc.bindingFirst,
            bindingLast: nc.bindingLast,
            color: cc.GetRarity(creature.rarity).color,
            size: cc.GetSize(creature.size).display,
            type: cc.GetType(creature.type).display,
            creature,
            isDead: isDead,
            isSelected: nc.isSelected ?? false,
          };
        }),
    };
  }, [location, isPointOfInterest, nodeCreatures, creatures, killedCreaturesIndeces]);
  const finalCreatures = useMemo(() => {
    let finalCreatures = GetRoomCreatures();

    if (addExteriorCreatures) {
      finalCreatures.creatures.forEach((fc) => {
        location.interaction.currentCreatures.push({ creatureId: fc.id, isDead: fc.isDead });
      });
      setAddExteriorCreatures(false);
    }

    return finalCreatures;
  }, [GetRoomCreatures, addExteriorCreatures, location]);
  const hasSelectedCreature = useMemo(() => finalCreatures.creatures.some((c) => c.isSelected), [finalCreatures]);

  const remainsForDisplay = useRef(
    Math.round(
      uniqueNodeCreatures
        .filter((c) => c.condition === lc.NODE_CREATURE_CONDITIONS.REMAINS)
        .map((nc) => {
          const creature = creatures.find((c) => c._id === nc.creatureId);
          const goldPiecesQuantity = cc.GetRarity(creature.rarity).goldPiecesQuantity;
          const goldPiecesMod = 0.5;

          return th.getGoldPiecesAmount(goldPiecesQuantity) * goldPiecesMod;
        })
        .reduce((partialSum, a) => partialSum + a, 0)
    )
  );
  const tracksForDisplay = useRef(
    uniqueNodeCreatures
      .filter((c) => c.condition === lc.NODE_CREATURE_CONDITIONS.TRACKS)
      .map((nc) => {
        const creature = creatures.find((c) => c._id === nc.creatureId);

        return `${nc.number} ${cc.GetType(creature.type).display} ${cc.GetSize(creature.size).display}`;
      })
  );
  const [modal, setModal] = useState(null);
  const [locDetails, setLocDetails] = useState(DETAILS_VIEWS.current.MARCH);
  const [locRoomDetails, setLocRoomDetails] = useState(ROOM_DETAILS_VIEWS.current.ROOM);
  const [name, setName] = useState(
    newCurrentNode.name ??
      (isPointOfInterest
        ? lc.GetElementType(newLocation.interaction.type).display
        : element.current
        ? `${lc.GetElementType(element.current.type).display}...variando "${utils.randomItemFromArray(lc.elementAlterations.map((a) => a.display))}"`
        : defaultNotes.current)
  );
  const timeInUnits = useMemo(() => {
    if (!locHoverData) {
      return utils.MinutesToTimeInUnits(0);
    }

    return locHoverData.distance.timeInUnits;
    // return utils.ProbabilityCheck(lc.GetIrregularTerrainFrequency(newLocation.traversal.irregularTerrainFrequency).probability)
    //   ? utils.MinutesToTimeInUnits(Math.round(locHoverData.distance.travelTimeInMin * 1.25))
    //   : locHoverData.distance.timeInUnits;
  }, [locHoverData]);
  const timeRestedDisplay = useMemo(
    () => `${utils.MinutesToTimeInUnits(timePassed)} passado(s) em ${lc.GetTravelPace(travel.pace).resultDisplay}`,
    [timePassed, travel.pace]
  );
  const elmentsForDisplay = useMemo(() => {
    if (isPointOfInterest || !location.traversal.elements) return null;

    const elements = location.traversal.elements.filter((e) => e.type !== element.current?.type);
    if (elements.length === 0) return null;

    return elements
      .map((e) => {
        const prob = lc.GetEncounterFrequency(e.frequency).probability;
        const options = ["cima esquerda", "cima", "cima direita", "esquerda", "direita", "baixo esquerda", "baixo", "baixo direita"];
        let elements = [];
        while (utils.ProbabilityCheck(prob)) {
          elements.push(utils.randomItemFromArray(options));
        }

        if (elements.length === 0) return null;
        utils.sortByCustomOrder(elements, options);

        return `${lc.GetElementType(e.type).display} (${elements.join(", ")})`;
      })
      .filter((e) => e)
      .join(", ");
  }, [isPointOfInterest, location.traversal.elements]);
  const newSchedule = useMemo(() => {
    if (!locHoverData) {
      return travel.schedule;
    }

    if (timePassed > 0) {
      return travel.schedule + timePassed;
    }

    return travel.schedule + locHoverData.distance.travelTimeInMin;
  }, [locHoverData, timePassed, travel.schedule]);
  const newScheduleUpdated = useMemo(() => GetUpdatedSchedule(newSchedule), [GetUpdatedSchedule, newSchedule]);
  const shoudUpdateConditions = useMemo(
    () =>
      travel.nextConditionsUpdate == null ||
      (travel.schedule < travel.nextConditionsUpdate && newSchedule >= travel.nextConditionsUpdate) ||
      (travel.schedule > travel.nextConditionsUpdate && travel.schedule > newScheduleUpdated && newScheduleUpdated >= travel.nextConditionsUpdate),
    [newSchedule, newScheduleUpdated, travel.nextConditionsUpdate, travel.schedule]
  );
  const newPreciptation = useMemo(() => {
    if (!shoudUpdateConditions) {
      return travel.precipitation;
    }

    const probCheck = Math.random();
    const probability = lc.GetPrecipitationFrequency(newLocation.contexts.find((c) => c.isCurrent).precipitationFrequency)?.probability ?? 0;

    if (probability === 0) {
      return 0;
    }

    const newPreciptation = Math.floor(Math.min(probCheck / (1 - probability), 1) * (mapConditionLevels.current.length - 1));

    return newPreciptation;
  }, [mapConditionLevels, newLocation.contexts, shoudUpdateConditions, travel.precipitation]);
  const newTemperature = useMemo(() => {
    if (!shoudUpdateConditions) {
      return travel.temperature;
    }

    const probCheck = Math.random();
    const probability =
      lc.GetIntenseTemperatureFrequency(newLocation.contexts.find((c) => c.isCurrent).intenseTemperatureFrequency)?.probability ?? 0;

    if (probability === 0) {
      return 0;
    }

    const newTemperature = Math.floor(Math.min(probCheck / (1 - probability), 1) * (mapConditionLevels.current.length - 1));

    return newTemperature;
  }, [mapConditionLevels, newLocation.contexts, shoudUpdateConditions, travel.temperature]);
  const detailsViews = useMemo(
    () => [
      {
        text: "Marcha",
        icon: null,
        onClick: () => setLocDetails(DETAILS_VIEWS.current.MARCH),
        isSelected: locDetails === DETAILS_VIEWS.current.MARCH,
        isDisabled: false,
        marginLeft: 0,
        className: null,
      },
      {
        text: null,
        icon: "fas fa-eye",
        onClick: () => setLocDetails(DETAILS_VIEWS.current.FIRST_IMPRESSIONS),
        isSelected: locDetails === DETAILS_VIEWS.current.FIRST_IMPRESSIONS,
        isDisabled: !currentContext.firstImpressions,
        marginLeft: -130,
        className: "icon-view",
      },
      {
        text: null,
        icon: "fas fa-info-circle",
        onClick: () => setLocDetails(DETAILS_VIEWS.current.DETAILS),
        isSelected: locDetails === DETAILS_VIEWS.current.DETAILS,
        isDisabled: !currentContext.details,
        marginLeft: -130,
        className: "icon-view",
      },
      {
        text: null,
        icon: "fas fa-assistive-listening-systems",
        onClick: () => setLocDetails(DETAILS_VIEWS.current.RUMORS),
        isSelected: locDetails === DETAILS_VIEWS.current.RUMORS,
        isDisabled: !currentContext.rumors,
        marginLeft: -130,
        className: "icon-view",
      },
      {
        text: null,
        icon: "fas fa-mask",
        onClick: () => setLocDetails(DETAILS_VIEWS.current.SECRETS),
        isSelected: locDetails === DETAILS_VIEWS.current.SECRETS,
        isDisabled: !currentContext.secrets,
        marginLeft: -130,
        className: "icon-view",
      },
      {
        text: "Criaturas",
        icon: null,
        onClick: () => setLocDetails(DETAILS_VIEWS.current.CREATURES),
        isSelected: locDetails === DETAILS_VIEWS.current.CREATURES,
        isDisabled: allLocationCreatures.length === 0,
        marginLeft: -80,
        className: "creatures-view",
      },
    ],
    [allLocationCreatures.length, currentContext.details, currentContext.firstImpressions, currentContext.rumors, currentContext.secrets, locDetails]
  );
  const roomDetailsViews = useMemo(
    () =>
      location.interaction
        ? [
            {
              text: "Área",
              icon: null,
              onClick: () => setLocRoomDetails(ROOM_DETAILS_VIEWS.current.ROOM),
              isSelected: locRoomDetails === ROOM_DETAILS_VIEWS.current.ROOM,
              isDisabled: isSafe,
              marginLeft: 4,
              className: null,
            },
            {
              text: null,
              icon: "fas fa-eye",
              onClick: () => setLocRoomDetails(ROOM_DETAILS_VIEWS.current.FIRST_IMPRESSIONS),
              isSelected: locRoomDetails === ROOM_DETAILS_VIEWS.current.FIRST_IMPRESSIONS,
              isDisabled: room == null || !room.firstImpressions,
              marginLeft: -128,
              className: "icon-view",
            },
            {
              text: null,
              icon: "fas fa-mask",
              onClick: () => setLocRoomDetails(ROOM_DETAILS_VIEWS.current.SECRETS),
              isSelected: locRoomDetails === ROOM_DETAILS_VIEWS.current.SECRETS,
              isDisabled: room == null || !room.secrets,
              marginLeft: -128,
              className: "icon-view",
            },
          ]
        : null,
    [isSafe, locRoomDetails, location.interaction, room]
  );

  function GetBaseRoomCreatures(creatures, context) {
    let baseRoomCreatures = [];

    creatures.forEach((c) => {
      const routine = GetCreatureCurrentRoutine(c, context);
      if (routine) {
        const probability = lc.GetEncounterFrequency(routine.encounterFrequency).probability;
        if (utils.ProbabilityCheck(probability)) {
          const groupSize = lc.GetGroupSize(routine.groupSize);
          const number = utils.randomIntFromInterval(groupSize.min, groupSize.max);
          utils.createArrayFromInt(number).forEach((_) => {
            baseRoomCreatures.push({ creatureId: c.creatureId, isDead: false });
          });
        }
      }
    });

    return baseRoomCreatures;
  }

  function GetModalLocation() {
    if (!newLocation.interaction) return newLocation;

    const modalLocContext = lh.GetCurrentContext(newLocation);

    if (!newLocation.interaction.currentCreatures) {
      newLocation.interaction.currentCreatures = GetBaseRoomCreatures(newLocation.creatures, modalLocContext);
    }

    newLocation.interaction.rooms
      .filter((r) => r && !r.currentCreatures)
      .forEach((r) => {
        r.currentCreatures = GetBaseRoomCreatures(r.creatures, modalLocContext);
      });

    return newLocation;
  }

  function HandleContinue() {
    if (isSafe) {
      HandleSafeContinue();
    } else {
      UpdateLocData();
      UpdateData();

      HandleSetCurrentNode();
      HandleSaveCombatConfig();

      onClose();
    }
  }

  function HandleSafeContinue() {
    HandleSetCurrentNode(newCurrentNode);
    travel.cummulativeEncounterChance = 0;
    HandleSaveCombatConfig();

    onClose();
  }

  function HandleSave() {
    UpdateLocData();
    UpdateData();

    HandleAddTravelNode();
    HandleSetCurrentNode();
    HandleSaveCombatConfig();

    onClose();
  }

  function UpdateData() {
    //for not oriented, travel is modified randomly by 10%
    if (!travel.oriented && travel.pace !== lc.TRAVEL_PACES.REST) {
      const angleModifier = 22.5;
      const newAngle = newCurrentNode.angle + utils.randomIntFromInterval(angleModifier * -1, angleModifier);
      const distance = utils.GetDistanceByCoordinates(travel.currentNode, newCurrentNode);
      const newCoordinates = utils.GetCoordinatesByDistance(travel.currentNode, distance.value, newAngle);
      newCurrentNode.angle = newAngle;
      newCurrentNode.x = newCoordinates.x;
      newCurrentNode.y = newCoordinates.y;
    }

    newCurrentNode.name = !isPointOfInterest ? name : null;
    newCurrentNode.findResourcesDifficulty = findResourcesDifficulty.current;
    newCurrentNode.materialRarity = materialRarity;
    newCurrentNode.isHazardous = isHazardous;
    newCurrentNode.roomIndex = roomIndex;

    let killedCreatures = [];
    Object.values(utils.GroupArrayBy(finalCreatures.creatures, "id")).forEach((creatureList) => {
      killedCreatures.push({ id: creatureList[0].id, number: creatureList.filter((c) => c.isDead).length });
    });

    newCurrentNode.creatures = nodeCreatures.filter((c) => {
      let foundCreature = killedCreatures.find((kc) => kc.id === c.creatureId && kc.number > 0);
      if (foundCreature) {
        foundCreature.number--;
        return false;
      }

      return true;
    });

    //clear temp data
    newCurrentNode.currentCreatures = null;

    travel.schedule = newScheduleUpdated;
    if (shoudUpdateConditions) {
      travel.precipitation = newPreciptation;
      travel.temperature = newTemperature;

      //every x hours, with variance, update preciptation and temp
      travel.nextConditionsUpdate = GetUpdatedSchedule(travel.schedule + utils.randomValueFromVarianceInt(8, 2) * 60);
    }

    if (travel.pace === lc.TRAVEL_PACES.REST) {
      travel.exhaustionTimer = Math.max(travel.exhaustionTimer - timePassed, 0);
    } else if (travel.pace === lc.TRAVEL_PACES.ACTIVITY) {
      travel.exhaustionTimer += timePassed * lc.GetTravelPace(travel.pace).fatigue;
    } else {
      travel.exhaustionTimer += locHoverData.distance.exhaustion;
    }

    if (isEncounter.current) {
      travel.cummulativeEncounterChance = 0;
    } else {
      travel.cummulativeEncounterChance = Math.min(1, travel.cummulativeEncounterChance + encounterProb);
    }
  }

  function UpdateLocData() {
    //update population data
    let killedCreatures = [];
    Object.values(utils.GroupArrayBy(finalCreatures.creatures, "id")).forEach((creatureList) => {
      killedCreatures.push({ id: creatureList[0].id, number: creatureList.filter((c) => c.isDead).length });
    });

    location.creatures
      .filter((lc) => lc.population)
      .forEach((lc) => {
        let totalKilled = killedCreatures.find((c) => c.id === lc.creatureId)?.number;
        if (totalKilled > 0) {
          lc.population.current = Math.max(0, lc.population.current - totalKilled);
        }
      });

    HandleSaveLoc(location);
  }

  function CheckSaveValid() {
    if (!name || name === defaultNotes.current) {
      return false;
    }

    return true;
  }

  async function OpenModalExport(creature) {
    setModal(<ModalExport creature={creature} showDetails={true} onClose={() => setModal(null)} />);
  }

  function HandleSelectRoomIndex(index) {
    if (hasSelectedCreature) {
      let creaturesToMove = [];
      room.currentCreatures = room.currentCreatures.filter((cc) => {
        if (cc.isSelected) {
          cc.isSelected = false;
          creaturesToMove.push(cc);
          return false;
        }

        return true;
      });

      //add to new room
      if (index === -1) {
        location.interaction.currentCreatures.push(...creaturesToMove);
      } else {
        location.interaction.rooms[index].currentCreatures.push(...creaturesToMove);
      }
      setLocation({ ...location });
    } else {
      SetRoomIndex(index);
      setLocRoomDetails(ROOM_DETAILS_VIEWS.current.ROOM);
    }
  }

  function ToggleCreatureSelection(index) {
    if (room) {
      room.currentCreatures[index].isSelected = !room.currentCreatures[index].isSelected;
      setLocation({ ...location });
    } else {
      if (killedCreaturesIndeces.includes(index)) {
        setKilledCreaturesIndeces(killedCreaturesIndeces.filter((i) => i !== index));
      } else {
        setKilledCreaturesIndeces([...killedCreaturesIndeces, index]);
      }
    }
  }

  function SetCreaturesStatus(isDead) {
    room.currentCreatures
      .filter((cc) => cc.isSelected)
      .forEach((cc) => {
        cc.isDead = isDead;
        cc.isSelected = false;
      });
    setLocation({ ...location });
  }

  return (
    <Modal title={newLocation.name} className="ModalTravelResults-container df">
      {modal}
      <main className="content df df-jc-c df-ai-fs df-f1">
        {/* world */}
        <aside className="details-wrapper df df-fd-c df-jc-fs">
          <div className="df df-cg-5" style={{ zIndex: 1 }}>
            {detailsViews.map((d, index) => (
              <div key={index} style={{ zIndex: -1 - index, marginLeft: d.marginLeft }}>
                <SelectButton
                  text={d.text}
                  icon={d.icon}
                  isDisabled={d.isDisabled}
                  onClick={d.onClick}
                  isSelected={d.isSelected}
                  className={`details-views${d.className ? ` ${d.className}` : ""}`}
                />
              </div>
            ))}
          </div>
          {locDetails === DETAILS_VIEWS.current.MARCH &&
            (isSafe ? (
              <>
                <span>Grupo movido seguramente sem marcha</span>
                <span>Tempo não é passado e outros fatores não são afetados</span>
              </>
            ) : (
              <>
                {viewingCurrent ? (
                  <span>-</span>
                ) : (
                  <div className="movement">
                    {hasMoved ? (
                      <>
                        <span className="bold">{locHoverData.distance.valueInUnits}</span>
                        <span> percorrido(s) em </span>
                        <span className="bold">{timeInUnits}</span>
                      </>
                    ) : (
                      <span>{timeRestedDisplay}</span>
                    )}
                  </div>
                )}

                {newPreciptation !== travel.precipitation && (
                  <h4>
                    {newPreciptation === mapConditionLevels.current.length - 1
                      ? "Tempo está precipitando"
                      : newPreciptation < travel.precipitation
                      ? "O tempo melhorou"
                      : "O tempo piorou"}
                  </h4>
                )}
                {newTemperature !== travel.temperature && (
                  <h4>
                    {newTemperature === mapConditionLevels.current.length - 1
                      ? "Temperatura está intensa"
                      : newTemperature < travel.temperature
                      ? "A temperatura melhorou"
                      : "A temperatura piorou"}
                  </h4>
                )}
              </>
            ))}
          {locDetails === DETAILS_VIEWS.current.FIRST_IMPRESSIONS && <span> {currentContext.firstImpressions} </span>}
          {locDetails === DETAILS_VIEWS.current.DETAILS && <span> {currentContext.details} </span>}
          {locDetails === DETAILS_VIEWS.current.RUMORS && <span> {currentContext.rumors} </span>}
          {locDetails === DETAILS_VIEWS.current.SECRETS && <span> {currentContext.secrets} </span>}
          {locDetails === DETAILS_VIEWS.current.CREATURES && (
            <div className="creature-list">
              {allLocationCreatures.length > 0 &&
                allLocationCreatures.map((ec) => {
                  const creature = creatures.find((c) => c._id === ec.creatureId);

                  return (
                    <div
                      className="df encounter-creature"
                      onClick={() => OpenModalExport(creature)}
                      key={ec.creatureId}
                      style={{
                        width: avatarProportion.current,
                        height: avatarProportion.current,
                        borderColor: cc.GetRarity(creature.rarity).color,
                      }}
                    >
                      <Info contents={[{ text: creature.name }, { text: "..." }, { text: "[Exportar]", icon: "fas fa-upload" }]} tooltipOnly={true} />
                      <img
                        className="creature-avatar"
                        style={{
                          width: avatarProportion.current,
                          height: avatarProportion.current,
                          left: creature.imageX != null ? creature.imageX * avatarProportion.current : cc.DEFAULT_AVATAR_POSITION,
                          top: creature.imageY != null ? creature.imageY * avatarProportion.current : cc.DEFAULT_AVATAR_POSITION,
                          transform: `scale(${creature.imageScale != null ? creature.imageScale : cc.DEFAULT_AVATAR_SCALE})`,
                          transformOrigin: "top left",
                        }}
                        src={creature.image}
                        alt="creature-avatar"
                      />
                    </div>
                  );
                })}
            </div>
          )}
        </aside>

        {/* loc */}
        <aside className="details-wrapper dungeon df df-fd-c df-jc-fs" style={{ zIndex: 2 }}>
          {isPointOfInterest ? (
            <fieldset className="df dungeon-wrapper" disabled={isSafe}>
              <Dungeon
                location={location}
                setLocation={setLocation}
                roomSelect={HandleSelectRoomIndex}
                creatures={creatures}
                currentRoomIndex={roomIndex}
                isMovingCreatures={hasSelectedCreature}
              />
            </fieldset>
          ) : (
            <>
              <TextInput className="name" placeholder="Nomear ponto" value={name} onChange={setName} />
              {!isSafe && (
                <>
                  {isEncounter && elmentsForDisplay && <span className="elements-display">{elmentsForDisplay}</span>}

                  <span>Encontrar Recursos: CD {findResourcesDifficulty.current}</span>
                  {tracksForDisplay.current.length > 0 && (
                    <span>
                      Rastros de: <span className="bold">"{tracksForDisplay.current.join(", ")}"</span>
                    </span>
                  )}
                  {remainsForDisplay.current > 0 && (
                    <span>
                      Restos mortais com o equivalente a <span className="bold">{remainsForDisplay.current}</span> PO
                    </span>
                  )}
                </>
              )}
            </>
          )}
        </aside>

        {/* surroundings */}
        <aside className="details-wrapper df df-fd-c df-jc-fs">
          {roomDetailsViews && (
            <div className="df df-cg-5" style={{ zIndex: 1 }}>
              {roomDetailsViews.map((d, index) => (
                <div key={index} style={{ zIndex: -1 - index, marginLeft: d.marginLeft }}>
                  <SelectButton
                    text={d.text}
                    icon={d.icon}
                    isDisabled={d.isDisabled}
                    onClick={d.onClick}
                    isSelected={d.isSelected}
                    className={`details-views${d.className ? ` ${d.className}` : ""}`}
                  />
                </div>
              ))}
            </div>
          )}
          {isSafe ? (
            <span>-</span>
          ) : (
            <>
              {locRoomDetails === ROOM_DETAILS_VIEWS.current.ROOM && (
                <div className="df df-jc-fs df-fd-c df-rg-10 room-data">
                  {room?.purpose && <span> {room.purpose} </span>}
                  {roomDimentions && <span> {roomDimentions} </span>}
                  {roomType && <span> {roomType} </span>}
                  {(materialRarityDisplay || isHazardous) && (
                    <div className="df surroundings">
                      <div className="material">
                        {materialRarityDisplay && <span>Material {materialRarityDisplay}</span>}
                        {materialRarityDisplay && isHazardous && <span> - </span>}
                        {isHazardous && <span>Interação Perigosa</span>}
                      </div>
                    </div>
                  )}
                  {/* creatures */}
                  {finalCreatures.creatures.length > 0 ? (
                    <>
                      {/* label and actions */}
                      <div className="df df-cg-5">
                        {room && (
                          <fieldset className="df df-cg-10" disabled={!hasSelectedCreature}>
                            <button
                              title="Matar"
                              className={`button-simple kill${!hasSelectedCreature ? " element-disabled" : ""}`}
                              onClick={() => SetCreaturesStatus(true)}
                            >
                              <i className="fas fa-skull"></i>
                            </button>
                            <button
                              title="Salvar"
                              className={`button-simple save${!hasSelectedCreature ? " element-disabled" : ""}`}
                              onClick={() => SetCreaturesStatus(false)}
                            >
                              <i className="fas fa-heart"></i>
                            </button>
                            <span> - </span>
                          </fieldset>
                        )}
                        {isPointOfInterest ? (
                          <span className="imminent"> {lc.GetNodeCreatureCondition(lc.NODE_CREATURE_CONDITIONS.IMMINENT).display}</span>
                        ) : (
                          <span className={finalCreatures.condition === lc.NODE_CREATURE_CONDITIONS.IMMINENT ? "imminent" : "near"}>
                            {`${lc.GetNodeCreatureCondition(finalCreatures.condition).display} ${finalCreatures.distance}`}
                          </span>
                        )}
                        <Info
                          contents={[
                            { text: "Combate não é obrigatório e pode ser evitado" },
                            { text: "" },
                            { text: "Clique em uma criatura para interagir" },
                          ]}
                        />
                      </div>

                      {/* list */}
                      <div className="creature-list">
                        {finalCreatures.creatures.map((c, index) => {
                          let contents = [{ text: c.creature.name }, { text: `${c.type} ${c.size}` }];

                          if (c.creature.description) {
                            contents.push({ text: "" });
                            contents.push({ text: c.creature.description.slice(0, 200) + "..." });
                          }

                          return (
                            <div className="df df-cg-10" key={index}>
                              {index > 0 && c.bindingFirst && <div> - </div>}
                              <div
                                className={`df encounter-creature${c.isSelected ? " selected-creature" : ""}`}
                                onClick={() => ToggleCreatureSelection(index)}
                                style={{
                                  width: avatarProportion.current,
                                  height: avatarProportion.current,
                                  borderColor: c.color,
                                }}
                              >
                                <img
                                  className={`creature-avatar${c.isDead ? " dead-creature" : ""}`}
                                  style={{
                                    width: avatarProportion.current,
                                    height: avatarProportion.current,
                                    left: c.creature.imageX != null ? c.creature.imageX * avatarProportion.current : cc.DEFAULT_AVATAR_POSITION,
                                    top: c.creature.imageY != null ? c.creature.imageY * avatarProportion.current : cc.DEFAULT_AVATAR_POSITION,
                                    transform: `scale(${c.creature.imageScale != null ? c.creature.imageScale : cc.DEFAULT_AVATAR_SCALE})`,
                                    transformOrigin: "top left",
                                  }}
                                  src={c.creature.image}
                                  alt="creature-avatar"
                                />
                                {c.isDead && <i className="fas fa-skull dead-icon"></i>}
                                <Info contents={contents} tooltipOnly={true} />
                              </div>
                              {index < finalCreatures.creatures.length - 1 && c.bindingLast && <div> - </div>}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    !room?.purpose && !roomDimentions && !roomType && !materialRarityDisplay && !isHazardous && <span>-</span>
                  )}
                </div>
              )}
              {locRoomDetails === ROOM_DETAILS_VIEWS.current.FIRST_IMPRESSIONS && <span> {room.firstImpressions} </span>}
              {locRoomDetails === ROOM_DETAILS_VIEWS.current.SECRETS && <span> {room.secrets} </span>}
            </>
          )}
        </aside>
      </main>

      <div className="divider"></div>

      <footer>
        <div className="df df-jc-fs df-cg-20 df-f1">
          {addAction && !isPointOfInterest && (
            <button className="df df-cg-5 button-simple" onClick={addAction}>
              <i className="fas fa-plus"></i>
              Adicionar
            </button>
          )}
          {editAction && (
            <button className="df df-cg-5 button-simple" onClick={editAction}>
              <i className="fas fa-pen"></i>
              Editar
            </button>
          )}

          {deleteNodeAction && (
            <button className="df df-cg-5 button-simple" onClick={deleteNodeAction}>
              <i className="fas fa-trash"></i>
              Deletar
            </button>
          )}
          {moveNodeAction && (
            <button className="df df-cg-5 button-simple" onClick={moveNodeAction}>
              <i className="fas fa-exchange-alt"></i>
              Reposicionar
            </button>
          )}
        </div>
        <aside className="footer-actions">
          <button className="button-simple" onClick={() => onClose()}>
            Cancelar
          </button>
        </aside>
        {mapMode === lc.MAP_MODES.TRAVEL && (
          <aside className="footer-actions">
            {HandleAddTravelNode && !isPointOfInterest && !isSafe && (
              <Button text="Marcar no Mapa" icon="fas fa-bookmark" onClick={HandleSave} isDisabled={!CheckSaveValid()} />
            )}
            {(HandleAddTravelNode || moveNodeAction) && <Button text="Mover seguro" icon="fas fa-location-arrow" onClick={HandleSafeContinue} />}
            {!isSafe && <Button text="Continuar e Salvar" onClick={HandleContinue} />}
          </aside>
        )}
      </footer>
    </Modal>
  );
}

export default ModalTravelResults;
