import React, { useState, useRef, useMemo } from "react";
import * as utils from "../../../../../../utils";
import * as cc from "../../../../../../constants/creatureConstants";
import * as lc from "../../../../../../constants/locationConstants";
import * as ch from "../../../../../../helpers/creatureHelper";

import TextInput from "../../../../../../components/TextInput";
import Button from "../../../../../../components/Button";
import Modal from "../../../../../../components/Modal";

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
  level,
  mapConditionLevels,
  GetUpdatedSchedule,
  HandleSetCurrentNode,
  HandleAddTravelNode,
  HandleSaveCombatConfig,
}) {
  const isPointOfInterest = useMemo(() => newLocation.size === lc.LOCATION_SIZES.POINT_OF_INTEREST, [newLocation.size]);
  const element = useRef(
    !newCurrentNode.name && !isPointOfInterest && newLocation.traversal.elements
      ? utils.randomItemFromArray(
          newLocation.traversal.elements.filter((e) => utils.ProbabilityCheck(lc.GetEncounterFrequency(e.frequency).probability))
        )
      : null
  );
  const findResourcesDifficulty = useRef(
    newCurrentNode.findResourcesDifficulty ??
      ch.GetDCValue(lc.GetResourceEasiness(newLocation.contexts.find((c) => c.isCurrent).resourceEasiness).difficult, level)
  );
  const materialRarity = useRef(
    newCurrentNode.materialRarity ??
      (element.current && utils.ProbabilityCheck(lc.GetElementMaterialFrequency(element.current.material.probability).probability)
        ? element.current.material.rarity
        : null)
  );
  const materialRarityDisplay = useRef(materialRarity.current ? cc.GetRarity(element.current.material.rarity).treasureDisplay : null);
  const isHazardous = useRef(
    newCurrentNode.isHazardous ?? (element.current && utils.ProbabilityCheck(lc.GetHazardousness(element.current.hazardousness).probability))
  );
  const [name, setName] = useState(newCurrentNode.name ?? (element.current ? `${lc.GetElementType(element.current.type).display}...` : null));
  const [notes, setNotes] = useState(
    newCurrentNode.notes ??
      (element.current
        ? `…com modificação de "${utils.randomItemFromArray(lc.elementAlterations.map((a) => a.display))}"`
        : "Nada em especial a vista…")
  );
  const timeInUnits = useMemo(
    () =>
      utils.ProbabilityCheck(lc.GetIrregularTerrainFrequency(newLocation.traversal.irregularTerrainFrequency).probability)
        ? utils.MinutesToTimeInUnits(Math.round(locHoverData.distance.travelTimeInMin * 1.25))
        : locHoverData.distance.timeInUnits,
    [locHoverData.distance.timeInUnits, locHoverData.distance.travelTimeInMin, newLocation.traversal.irregularTerrainFrequency]
  );
  const newSchedule = useMemo(
    () => travel.schedule + locHoverData.distance.travelTimeInMin,
    [locHoverData.distance.travelTimeInMin, travel.schedule]
  );
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

  function UpdateData() {
    //for not oriented, travel is modified randomly by 10%
    if (!travel.oriented && travel.pace !== lc.TRAVEL_PACES.REST) {
      const modifier = 0.1;
      newCurrentNode.x = utils.randomValueFromVariancePercentage(newCurrentNode.x, modifier);
      newCurrentNode.y = utils.randomValueFromVariancePercentage(newCurrentNode.y, modifier);
    }

    newCurrentNode.name = name;
    newCurrentNode.notes = notes;
    newCurrentNode.findResourcesDifficulty = findResourcesDifficulty.current;
    newCurrentNode.materialRarity = materialRarity.current;
    newCurrentNode.isHazardous = isHazardous.current;

    travel.schedule = newScheduleUpdated;
    if (shoudUpdateConditions) {
      travel.precipitation = newPreciptation;
      travel.temperature = newTemperature;

      //every x hours, with variance, update preciptation and temp
      travel.nextConditionsUpdate = GetUpdatedSchedule(travel.schedule + utils.randomValueFromVarianceInt(8, 2) * 60);
    }
  }

  function CheckSaveValid() {
    if (!name) {
      return false;
    }

    return true;
  }

  return (
    <Modal title="Resultado da Marcha" className="ModalTravelResults-container df">
      <main className="content df df-jc-fs df-f1">
        <TextInput placeholder="Nome..." value={name} onChange={setName} />
        <TextInput placeholder="Notas..." value={notes} onChange={setNotes} />
        {hasMoved && (
          <div className="movement">
            <span className="bold">{locHoverData.distance.valueInUnits}</span>
            <span> percorrido(s) em </span>
            <span className="bold">{timeInUnits}</span>
          </div>
        )}
        <h4>{newLocation.name}</h4>

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
        <h6>Encontrar Recursos: CD {findResourcesDifficulty.current}</h6>
        {(materialRarityDisplay.current || isHazardous.current) && (
          <div className="material">
            {materialRarityDisplay.current && <span>Material {materialRarityDisplay.current}</span>}
            {materialRarityDisplay.current && isHazardous.current && <span>, </span>}
            {isHazardous.current && <span>Interação Perigosa</span>}
          </div>
        )}
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
