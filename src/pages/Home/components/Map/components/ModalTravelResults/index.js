import React, { useState, useRef, useMemo } from "react";
import * as utils from "../../../../../../utils";
import * as cc from "../../../../../../constants/creatureConstants";
import * as lc from "../../../../../../constants/locationConstants";
import * as ch from "../../../../../../helpers/creatureHelper";
import * as lh from "../../../../../../helpers/locationHelper";
import * as th from "../../../../../../helpers/treasureHelper";

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
  mapConditionLevels,
  GetUpdatedSchedule,
  HandleSetCurrentNode,
  HandleAddTravelNode,
  HandleSaveCombatConfig,
}) {
  const viewingCurrent = useMemo(
    () => !hasMoved && travel.pace !== lc.TRAVEL_PACES.REST && travel.pace !== lc.TRAVEL_PACES.ACTIVITY,
    [hasMoved, travel.pace]
  );
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
      ? element.current?.material && utils.ProbabilityCheck(lc.GetElementMaterialFrequency(element.current.material.probability).probability)
        ? element.current.material.rarity
        : isPointOfInterest
        ? newLocation.interaction.rarity
        : null
      : newCurrentNode.materialRarity
  );
  const materialRarityDisplay = useRef(materialRarity.current ? cc.GetRarity(materialRarity.current).treasureDisplay : null);
  const isHazardous = useRef(
    newCurrentNode.isHazardous ??
      (isPointOfInterest
        ? newLocation.interaction.isHazardous
        : element.current?.hazardousness && utils.ProbabilityCheck(lc.GetHazardousness(element.current.hazardousness).probability))
  );
  const encounterLocation = useRef(isPointOfInterest && exteriorLocation && hasMoved ? exteriorLocation : newLocation);
  const currentContext = useRef(lh.GetCurrentContext(encounterLocation.current));
  const [timePassed, setTimePassed] = useState(
    travel.pace !== lc.TRAVEL_PACES.REST && travel.pace !== lc.TRAVEL_PACES.ACTIVITY ? 0 : lc.GetRestTime(restTime).timeInMin
  );
  const isEncounter = useRef(
    encounterLocation.current.creatures.some(
      (c) => GetCreatureCurrentRoutine(c, currentContext.current)?.encounterFrequency === lc.ENCOUNTER_FREQUENCIES.CERTAIN
    ) || ProbUpdatedByTravelTimeModCheck(lc.GetHazardousness(lh.GetCurrentContext(encounterLocation.current).hazardousness).probability, true)
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
          const goldPiecesMod = 0.1;

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
        ? `…com modificação de "${utils.randomItemFromArray(lc.elementAlterations.map((a) => a.display))}"`
        : "Nenhum ponto chama a atenção…")
  );
  const timeInUnits = useMemo(() => {
    if (!locHoverData) {
      return utils.MinutesToTimeInUnits(0);
    }

    return utils.ProbabilityCheck(lc.GetIrregularTerrainFrequency(newLocation.traversal.irregularTerrainFrequency).probability)
      ? utils.MinutesToTimeInUnits(Math.round(locHoverData.distance.travelTimeInMin * 1.25))
      : locHoverData.distance.timeInUnits;
  }, [locHoverData, newLocation.traversal.irregularTerrainFrequency]);
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

    HandleSaveCombatConfig();
    onClose();
  }

  function HandleSave() {
    UpdateData();

    HandleAddTravelNode();
    HandleSetCurrentNode();

    HandleSaveCombatConfig();
    onClose();
  }

  function ProbUpdatedByTravelTimeModCheck(probability, updateTimePassed = false) {
    const travelTimeMod = (hasMoved ? locHoverData.distance.travelTimeInMin : timePassed) / 60;
    const check = utils.ProbabilityCheckWithRatio(probability, travelTimeMod);

    const updatedTimePassed = Math.round(check.ratioChecked * 60);

    if (updateTimePassed && updatedTimePassed !== timePassed) {
      setTimePassed(updatedTimePassed);
    }

    return check.probabilityCheck;
  }

  function GetLocationCreatures() {
    const differentCreatureProb = 0.1;

    if (encounterLocation.current.creatures.length === 0) {
      return [];
    }

    //setup
    let locationCreatures = encounterLocation.current.creatures
      .map((c) => {
        const routine = GetCreatureCurrentRoutine(c, currentContext.current);
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

    //add creatures
    let possibleEncounterCreatures = locationCreatures.filter((c) => c.isEncounter);
    if (possibleEncounterCreatures.length > 0) {
      let addToEncounter = true;
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
      //add 1 crrature
    } else if (isEncounter.current) {
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
    const imminentEncounterProb = isNightTime ? nightTimeImminentEncounterProb : dayTimeImminentEncounterProb;

    return isEncounter.current
      ? utils.ProbabilityCheck(Math.min(imminentEncounterProb * lc.GetTravelPace(travel.pace).encounterProbMod, 1))
        ? lc.NODE_CREATURE_CONDITIONS.IMMINENT
        : lc.NODE_CREATURE_CONDITIONS.NEAR
      : ProbUpdatedByTravelTimeModCheck(lc.GetHazardousness(lh.GetCurrentContext(encounterLocation.current).hazardousness).probability)
      ? lc.NODE_CREATURE_CONDITIONS.REMAINS
      : lc.NODE_CREATURE_CONDITIONS.TRACKS;
  }

  function UpdateData() {
    //for not oriented, travel is modified randomly by 10%
    if (!travel.oriented && travel.pace !== lc.TRAVEL_PACES.REST) {
      const modifier = 0.5;
      newCurrentNode.angle = utils.randomValueFromVariancePercentage(newCurrentNode.angle, modifier);
      newCurrentNode.x = utils.randomValueFromVariancePercentage(newCurrentNode.x, modifier);
      newCurrentNode.y = utils.randomValueFromVariancePercentage(newCurrentNode.y, modifier);
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
  }

  function CheckSaveValid() {
    if (!name) {
      return false;
    }

    return true;
  }

  async function OpenModalExport(creature) {
    setModal(<ModalExport creature={creature} onClose={setModal} />);
  }

  async function OpenModalDetails() {
    setModal(
      <ModalWarning
        title="Detalhes"
        messages={[lh.GetCurrentContext(newLocation).details]}
        actions={[
          {
            text: "Fechar",
            click: () => setModal(null),
          },
        ]}
      />
    );
  }

  return (
    <Modal title="Resultado da Marcha" className="ModalTravelResults-container df">
      {modal}
      <main className="content df df-jc-c df-ai-fs df-f1">
        {/* world */}
        <aside className="details-wrapper df df-fd-c df-jc-fs">
          <h3>Mundo</h3>
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
        </aside>

        {/* loc */}
        <aside className="details-wrapper df df-fd-c df-jc-fs">
          <button className="button-simple" onClick={OpenModalDetails}>
            {newLocation.name}
          </button>
          <TextInput placeholder="Nomear ponto" value={name} onChange={setName} />
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
                        { text: `Tamanho: ${c.size}` },
                        { text: "" },
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
          {/* <Button text="Combate" onClick={() => {}} isDisabled={true} /> */}
        </aside>
      </main>

      <div className="divider"></div>

      <footer>
        <aside className="footer-actions">
          <button className="button-simple" onClick={() => onClose()}>
            Cancelar
          </button>
        </aside>
        <aside className="footer-actions">
          {HandleAddTravelNode ? (
            <>
              <Button text="Marcar no Mapa" onClick={HandleSave} isDisabled={!CheckSaveValid()} />
              <Button text="Continuar sem Marcar" onClick={HandleContinue} />
            </>
          ) : (
            <Button text="Continuar" onClick={HandleContinue} />
          )}
        </aside>
      </footer>
    </Modal>
  );
}

export default ModalTravelResults;
