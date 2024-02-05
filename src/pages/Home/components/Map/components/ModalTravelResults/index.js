import React, { useState, useRef, useMemo } from "react";
import * as utils from "../../../../../../utils";
import * as cc from "../../../../../../constants/creatureConstants";
import * as lc from "../../../../../../constants/locationConstants";
import * as ch from "../../../../../../helpers/creatureHelper";
import * as lh from "../../../../../../helpers/locationHelper";
import * as th from "../../../../../../helpers/treasureHelper";

import Dungeon from "../Dungeon";
import Info from "../../../../../../components/Info";
import TextInput from "../../../../../../components/TextInput";
import Button from "../../../../../../components/Button";
import Modal from "../../../../../../components/Modal";
import ModalExport from "../../../../../../components/ModalExport";
import ModalWarning from "../../../../../../components/ModalWarning";

import "./styles.css";

function ModalTravelResults({
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
}) {
  const defaultNotes = useRef("Nenhum ponto chama a atençao…");
  const viewingCurrent = useMemo(
    () => !hasMoved && travel.pace !== lc.TRAVEL_PACES.REST && travel.pace !== lc.TRAVEL_PACES.ACTIVITY,
    [hasMoved, travel.pace]
  );
  const [location, setLocation] = useState(utils.clone(newLocation));
  const isPointOfInterest = useMemo(() => newLocation.size === lc.LOCATION_SIZES.POINT_OF_INTEREST, [newLocation.size]);
  const element = useRef(
    HandleAddTravelNode && !isPointOfInterest && newLocation.traversal.elements
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
    HandleAddTravelNode
      ? (
          element.current?.material.probability &&
          utils.ProbabilityCheck(lc.GetElementMaterialFrequency(element.current.material.probability).probability)
            ? element.current.material.rarity
            : isPointOfInterest
        )
        ? newLocation.interaction.rarity
        : null
      : newCurrentNode.materialRarity
  );
  const materialRarityDisplay = useRef(materialRarity.current ? cc.GetRarity(materialRarity.current).treasureDisplay : null);
  const isHazardous = useRef(
    newCurrentNode.isHazardous ??
      (isPointOfInterest
        ? newLocation.interaction.isHazardous
        : element.current?.hazardousness && utils.ProbabilityCheck(lc.GetMaterialExtractionDifficulty(element.current.hazardousness).probability))
  );
  const encounterLocation = useRef(
    isPointOfInterest &&
      exteriorLocation &&
      (hasMoved || newLocation.creatures.length === 0) &&
      !lh.HasCertainCreature(newLocation, GetCreatureCurrentRoutine)
      ? exteriorLocation
      : newLocation
  );
  const currentContext = useRef(lh.GetCurrentContext(encounterLocation.current));
  const worldContext = useRef(lh.GetCurrentContext(world));
  const shouldlAddWorldCreatures = useRef(world.name !== encounterLocation.current.name && worldContext.current.name !== lc.DEFAULT_CONTEXT_NAME);
  const [timePassed, setTimePassed] = useState(
    travel.pace !== lc.TRAVEL_PACES.REST && travel.pace !== lc.TRAVEL_PACES.ACTIVITY ? 0 : lc.GetRestTime(restTime).timeInMin
  );
  const hasAnyCreature = useRef(encounterLocation.current.creatures.length > 0 || (shouldlAddWorldCreatures && world.creatures.length > 0));
  const isEncounter = useRef(
    hasAnyCreature.current &&
      (ProbUpdatedByTravelTimeModCheck(lc.GetHazardousness(currentContext.current.hazardousness).probability, true) ||
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
  const [name, setName] = useState(
    newCurrentNode.name ??
      (isPointOfInterest
        ? lc.GetElementType(newLocation.interaction.type).display
        : element.current
        ? `${lc.GetElementType(element.current.type).display}...`
        : null)
  );
  const [notes, setNotes] = useState(
    newCurrentNode.notes ??
      (isPointOfInterest
        ? null
        : element.current
        ? `…com modificaçao de "${utils.randomItemFromArray(lc.elementAlterations.map((a) => a.display))}"`
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

  function HandleContinue() {
    UpdateData();

    HandleSetCurrentNode();
    UpdateLocData();
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
          ? GetCreatureCurrentRoutine(c, currentContext.current)
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
      : ProbUpdatedByTravelTimeModCheck(lc.GetHazardousness(currentContext.current.hazardousness).probability)
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

    newCurrentNode.name = name;
    newCurrentNode.notes = notes;
    newCurrentNode.findResourcesDifficulty = findResourcesDifficulty.current;
    newCurrentNode.materialRarity = materialRarity.current;
    newCurrentNode.isHazardous = isHazardous.current;
    newCurrentNode.creatures = nodeCreatures.current;

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
    if (!name) {
      return false;
    }

    return true;
  }

  async function OpenModalExport(creature, onClose = () => setModal(null)) {
    setModal(<ModalExport creature={creature} showDetails={true} onClose={onClose} />);
  }

  async function OpenModalDetails() {
    const locContext = lh.GetCurrentContext(newLocation);

    let messages = [];

    if (locContext.details) {
      messages.push(locContext.details);
    }

    if (locContext.rumors) {
      messages.push("-------------------------------- Rumores");
      messages.push(locContext.rumors);
    }

    if (locContext.secrets) {
      messages.push("-------------------------------- Segredos");
      messages.push(locContext.secrets);
    }

    if (messages.length > 0) {
      setModal(
        <ModalWarning
          title={newLocation.name}
          messages={messages}
          actions={[
            {
              text: "Fechar",
              click: () => setModal(null),
            },
          ]}
        >
          <div className="creature-list">
            {newLocation.creatures.length > 0 &&
              newLocation.creatures.map((ec) => {
                const creature = creatures.find((c) => c._id === ec.creatureId);

                return (
                  <div className="df encounter-creature" onClick={() => OpenModalExport(creature, OpenModalDetails)} key={ec.creatureId}>
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
        </ModalWarning>
      );
    }
  }

  function HandleNameChange(newValue) {
    if (notes === defaultNotes.current) {
      setNotes(null);
    }

    setName(newValue);
  }

  return (
    <Modal title="Resultado da Marcha" className="ModalTravelResults-container df">
      {modal}
      <main className="content df df-jc-c df-ai-fs df-f1">
        {/* world */}
        <aside className="details-wrapper df df-fd-c df-jc-fs">
          <h3>Mundo</h3>
          {viewingCurrent ? (
            !isPointOfInterest && <span>-</span>
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

          {isPointOfInterest && <Dungeon location={location} setLocation={setLocation} creatures={creatures} isEdit={false} />}
        </aside>

        {/* loc */}
        <aside className="details-wrapper df df-fd-c df-jc-fs">
          <button className="button-simple" onClick={OpenModalDetails}>
            {newLocation.name}
          </button>
          <TextInput className="name" placeholder="Nomear ponto" value={name} onChange={HandleNameChange} />
          <TextInput placeholder="Notas..." value={notes} onChange={setNotes} />
          {(materialRarityDisplay.current || isHazardous.current) && (
            <div className="material">
              {materialRarityDisplay.current && <span>Material {materialRarityDisplay.current}</span>}
              {materialRarityDisplay.current && isHazardous.current && <span>, </span>}
              {isHazardous.current && <span>Interação Perigosa</span>}
            </div>
          )}
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
        </aside>

        {/* surroundings */}
        <aside className="details-wrapper df df-fd-c df-jc-fs">
          <div className="df surroundings">
            <h3>Arredores</h3>
            <Info contents={[{ text: "Combate não é obrigatório e pode ser ignorado por estar voando/escondido" }]} />
          </div>
          <h6>Encontrar Recursos: CD {findResourcesDifficulty.current}</h6>

          {creaturesForDisplay.current.creatures.length > 0 && (
            <>
              <span className={creaturesForDisplay.current.condition === lc.NODE_CREATURE_CONDITIONS.IMMINENT ? "imminent" : "near"}>
                {lc.GetNodeCreatureCondition(creaturesForDisplay.current.condition).display}
              </span>
              <div className="creature-list">
                {creaturesForDisplay.current.creatures.map((c) => (
                  <div className="df encounter-creature" onClick={() => OpenModalExport(c.creature)} key={c.id}>
                    <Info
                      contents={[
                        { text: c.creature.name },
                        { text: "" },
                        { text: `${c.type} ${c.size}` },
                        { text: "..." },
                        { text: "[Exportar]", icon: "fas fa-upload" },
                      ]}
                      tooltipOnly={true}
                    />
                    <img
                      className="creature-avatar"
                      style={{
                        borderColor: c.color,
                      }}
                      src={c.creature.image}
                      alt="creature-avatar"
                    />
                    <span>x{c.number}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </aside>
      </main>

      <div className="divider"></div>

      <footer>
        <div className="df df-jc-fs df-cg-20 df-f1">
          <button className="df df-cg-5 button-simple" onClick={addAction}>
            <i className="fas fa-plus"></i>
            Adicionar
          </button>
          <button className="df df-cg-5 button-simple" onClick={editAction}>
            <i className="fas fa-pen"></i>
            Editar
          </button>
        </div>
        <aside className="footer-actions">
          <button className="button-simple" onClick={() => onClose()}>
            Cancelar
          </button>
        </aside>
        <aside className="footer-actions">
          {HandleAddTravelNode && !isPointOfInterest && (
            <Button text="Marcar no Mapa" icon="fas fa-bookmark" onClick={HandleSave} isDisabled={!CheckSaveValid()} />
          )}
          <Button text="Continuar e Salvar" onClick={HandleContinue} />
        </aside>
      </footer>
    </Modal>
  );
}

export default ModalTravelResults;
