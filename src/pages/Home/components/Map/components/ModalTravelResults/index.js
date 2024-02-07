import React, { useState, useEffect, useRef, useMemo } from "react";
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
  const [location, setLocation] = useState(utils.clone(newLocation));
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
  const materialRarity = useRef(
    //if can save
    HandleAddTravelNode
      ? //if can check
        element.current?.material.probability &&
        utils.ProbabilityCheck(lc.GetElementMaterialFrequency(element.current.material.probability).probability)
        ? element.current.material.rarity
        : //othewise, if point of interest
        isPointOfInterest
        ? room.rarity
        : //otherwise null
          null
      : //otherwise current
        newCurrentNode.materialRarity
  );
  const materialRarityDisplay = useRef(materialRarity.current ? cc.GetRarity(materialRarity.current).treasureDisplay : null);
  const isHazardous = useRef(
    newCurrentNode.isHazardous ??
      (isPointOfInterest
        ? room.isHazardous
        : element.current?.hazardousness && utils.ProbabilityCheck(lc.GetMaterialExtractionDifficulty(element.current.hazardousness).probability))
  );
  const encounterLocation = useRef(
    isPointOfInterest &&
      exteriorLocation &&
      (hasMoved || location.creatures.length === 0) &&
      !lh.HasCertainCreature(location, GetCreatureCurrentRoutine)
      ? exteriorLocation
      : location
  );

  const encounterLocContext = useRef(lh.GetCurrentContext(encounterLocation.current));
  const worldContext = useRef(lh.GetCurrentContext(world));
  const shouldlAddWorldCreatures = useRef(world.name !== encounterLocation.current.name && worldContext.current.name !== lc.DEFAULT_CONTEXT_NAME);
  const [timePassed, setTimePassed] = useState(
    travel.pace !== lc.TRAVEL_PACES.REST && travel.pace !== lc.TRAVEL_PACES.ACTIVITY ? 0 : lc.GetRestTime(restTime).timeInMin
  );
  const hasAnyCreature = useRef(encounterLocation.current.creatures.length > 0 || (shouldlAddWorldCreatures && world.creatures.length > 0));
  const isEncounter = useRef(
    hasAnyCreature.current &&
      !(roomIndex > 0) &&
      (ProbUpdatedByTravelTimeModCheck(lc.GetHazardousness(encounterLocContext.current.hazardousness).probability, true) ||
        lh.HasCertainCreature(encounterLocation.current, GetCreatureCurrentRoutine) ||
        encounterProb === 1 ||
        utils.ProbabilityCheck(travel.cummulativeEncounterChance))
  );
  const nodeCreatures = useRef(!viewingCurrent ? GetLocationCreatures() : newCurrentNode.creatures);
  const creaturesForDisplay = useRef({
    condition:
      nodeCreatures.current.filter((c) => c.condition === lc.NODE_CREATURE_CONDITIONS.IMMINENT).length >
      nodeCreatures.current.filter((c) => c.condition === lc.NODE_CREATURE_CONDITIONS.NEAR).length
        ? lc.NODE_CREATURE_CONDITIONS.IMMINENT
        : lc.NODE_CREATURE_CONDITIONS.NEAR,
    creatures: nodeCreatures.current
      .filter((c) => c.condition === lc.NODE_CREATURE_CONDITIONS.IMMINENT || c.condition === lc.NODE_CREATURE_CONDITIONS.NEAR)
      .map((nc) => {
        const creature = creatures.find((c) => c._id === nc.creatureId);

        return {
          id: nc.creatureId,
          color: cc.GetRarity(creature.rarity).color,
          size: cc.GetSize(creature.size).display,
          type: cc.GetType(creature.type).display,
          number: nc.number,
          creature,
        };
      }),
  });
  const remainsForDisplay = useRef(
    Math.round(
      nodeCreatures.current
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
    nodeCreatures.current
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
              text: isPointOfInterest ? "Sala" : "Arredores",
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
    [isPointOfInterest, isSafe, locRoomDetails, location.interaction, room]
  );

  function HandleContinue() {
    if (isSafe) {
      HandleSafeContinue();
    } else {
      UpdateData();

      HandleSetCurrentNode();
      UpdateLocData();
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
    UpdateData();

    HandleAddTravelNode();
    HandleSetCurrentNode();
    UpdateLocData();
    HandleSaveCombatConfig();

    onClose();
  }

  function ProbUpdatedByTravelTimeModCheck(probability, updateTimePassed = false) {
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
  }

  function GetLocationCreatures() {
    const differentCreatureProb = 0.5;

    if (!hasAnyCreature.current) {
      return [];
    }

    //add world context creatues
    let allCreatures = shouldlAddWorldCreatures ? [...encounterLocation.current.creatures, ...world.creatures] : encounterLocation.current.creatures;

    //setup
    let locationCreatures = allCreatures
      .filter((c) => !c.population || c.population > 0)
      .map((c) => {
        const routine = encounterLocation.current.creatures.some((lc) => lc.creatureId === c.creatureId)
          ? GetCreatureCurrentRoutine(c, encounterLocContext.current)
          : GetCreatureCurrentRoutine(c, worldContext.current);
        if (!routine) {
          return null;
        }

        const groupSize = lc.GetGroupSize(routine.groupSize);
        const probability = lc.GetEncounterFrequency(routine.encounterFrequency).probability;

        return {
          creatureId: c.creatureId,
          number: utils.randomIntFromInterval(groupSize.min, groupSize.max),
          encounterFrequency: routine.encounterFrequency,
          isEncounter: isEncounter.current ? utils.ProbabilityCheck(probability) : ProbUpdatedByTravelTimeModCheck(probability),
        };
      })
      .filter((c) => c);

    if (locationCreatures.length === 0) {
      return [];
    }

    //add creatures
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
          utils.randomItemFromArray(creatures).condition = GetCreatureCondition();

          if (!utils.ProbabilityCheck(differentCreatureProb)) {
            addToEncounter = false;
          }
        } else {
          addToEncounter = false;
        }
      }
    }

    //add 1 creature if needed
    if (
      isEncounter.current &&
      !locationCreatures.some((c) => c.condition === lc.NODE_CREATURE_CONDITIONS.IMMINENT || c.condition === lc.NODE_CREATURE_CONDITIONS.NEAR)
    ) {
      locationCreatures.sort((a, b) => b.encounterFrequency - a.encounterFrequency);
      const moreCommonCreatures = locationCreatures.filter((c) => c.encounterFrequency === locationCreatures[0].encounterFrequency);
      utils.randomItemFromArray(moreCommonCreatures).condition = GetCreatureCondition();
    }

    return locationCreatures.map((c) => ({
      creatureId: c.creatureId,
      number: c.number,
      condition: c.condition ?? lc.NODE_CREATURE_CONDITIONS.NONE,
    }));
  }

  function GetCreatureCondition() {
    const dayTimeImminentEncounterProb = 0.5;
    const nightTimeImminentEncounterProb = 1;

    return isEncounter.current
      ? utils.ProbabilityCheck(
          Math.min(
            isNightTime ? nightTimeImminentEncounterProb : dayTimeImminentEncounterProb * lc.GetTravelPace(travel.pace).imminentEncounterProbMod,
            1
          )
        )
        ? lc.NODE_CREATURE_CONDITIONS.IMMINENT
        : lc.NODE_CREATURE_CONDITIONS.NEAR
      : ProbUpdatedByTravelTimeModCheck(lc.GetHazardousness(encounterLocContext.current.hazardousness).probability)
      ? lc.NODE_CREATURE_CONDITIONS.REMAINS
      : lc.NODE_CREATURE_CONDITIONS.TRACKS;
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
    newCurrentNode.materialRarity = materialRarity.current;
    newCurrentNode.isHazardous = isHazardous.current;
    newCurrentNode.creatures = nodeCreatures.current;
    newCurrentNode.roomIndex = roomIndex;

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
      travel.exhaustionTimer += Math.round(locHoverData.distance.travelTimeInMin * lh.GetTravelFatigueModifier(travel));
    }

    if (isEncounter.current) {
      travel.cummulativeEncounterChance = 0;
    } else {
      travel.cummulativeEncounterChance = Math.min(1, travel.cummulativeEncounterChance + encounterProb);
    }
  }

  function UpdateLocData() {
    //update current creatures, doors and population data
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
    SetRoomIndex(index);
    setLocRoomDetails(ROOM_DETAILS_VIEWS.current.ROOM);
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
                    <div className="df encounter-creature" onClick={() => OpenModalExport(creature)} key={ec.creatureId}>
                      <Info contents={[{ text: creature.name }, { text: "..." }, { text: "[Exportar]", icon: "fas fa-upload" }]} tooltipOnly={true} />
                      <img
                        className="creature-avatar"
                        style={{
                          borderColor: cc.GetRarity(creature.rarity).color,
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
        <aside className="details-wrapper df df-fd-c df-jc-fs" style={{ zIndex: 2 }}>
          {isPointOfInterest ? (
            <Dungeon
              location={location}
              setLocation={setLocation}
              roomSelect={HandleSelectRoomIndex}
              creatures={creatures}
              currentRoomIndex={roomIndex}
            />
          ) : (
            <>
              <TextInput className="name" placeholder="Nomear ponto" value={name} onChange={setName} />
              {!isSafe && (
                <>
                  <h6>Encontrar Recursos: CD {findResourcesDifficulty.current}</h6>
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
                  {(materialRarityDisplay.current || isHazardous.current) && (
                    <div className="df surroundings">
                      <div className="material">
                        {materialRarityDisplay.current && <span>Material {materialRarityDisplay.current}</span>}
                        {materialRarityDisplay.current && isHazardous.current && <span> - </span>}
                        {isHazardous.current && <span>Interação Perigosa</span>}
                      </div>
                    </div>
                  )}

                  {creaturesForDisplay.current.creatures.length > 0 ? (
                    <>
                      <div className="df df-cg-5">
                        <span className={creaturesForDisplay.current.condition === lc.NODE_CREATURE_CONDITIONS.IMMINENT ? "imminent" : "near"}>
                          {lc.GetNodeCreatureCondition(creaturesForDisplay.current.condition).display}
                        </span>
                        <Info contents={[{ text: "Combate não é obrigatório e pode ser ignorado por estar voando/escondido" }]} />
                      </div>
                      <div className="creature-list">
                        {creaturesForDisplay.current.creatures.map((c) =>
                          utils.createArrayFromInt(c.number).map((_, i) => {
                            let contents = [{ text: c.creature.name }, { text: `${c.type} ${c.size}` }];

                            if (c.creature.description) {
                              contents.push({ text: "" });
                              contents.push({ text: c.creature.description.slice(0, 200) + "..." });
                            }

                            return (
                              <div className="df encounter-creature" onClick={() => {}} key={c.id + i}>
                                <Info contents={contents} tooltipOnly={true} />
                                <img
                                  className="creature-avatar"
                                  style={{
                                    borderColor: c.color,
                                  }}
                                  src={c.creature.image}
                                  alt="creature-avatar"
                                />
                              </div>
                            );
                          })
                        )}
                      </div>
                    </>
                  ) : (
                    <span>-</span>
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
          {addAction && (
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
