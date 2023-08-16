import React, { useState, useMemo } from "react";
import * as utils from "../../../../../../utils";
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
  currentLocation,
  newLocation,
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
  const [name, setName] = useState(newCurrentNode.name);
  const [notes, setNotes] = useState(newCurrentNode.notes);
  const timeInUnits = useMemo(
    () =>
      utils.ProbabilityCheck(lc.GetIrregularTerrainFrequency(newLocation.traversal.irregularTerrainFrequency).probability)
        ? utils.MinutesToTimeInUnits(Math.round(locHoverData.distance.travelTimeInMin * 1.25))
        : locHoverData.distance.timeInUnits,
    [locHoverData.distance.timeInUnits, locHoverData.distance.travelTimeInMin, newLocation.traversal.irregularTerrainFrequency]
  );
  const findResourcesDifficulty = useMemo(
    () => ch.GetDCValue(lc.GetResourceEasiness(newLocation.contexts.find((c) => c.isCurrent).resourceEasiness).difficult, level),
    [level, newLocation.contexts]
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
    <Modal title="Resultado da Marcha" className="ModalTravelResults-container df ">
      <main className="content df df-jc-fs df-f1">
        <TextInput placeholder="Nome" value={name} onChange={setName} />
        <TextInput placeholder="Notas..." value={notes} onChange={setNotes} />
        {hasMoved && (
          <div className="movement">
            <span className="bold">{locHoverData.distance.valueInUnits}</span>
            <span> percorrido(s) em </span>
            <span className="bold">{timeInUnits}</span>
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
        <h6>Encontrar Recursos: CD {findResourcesDifficulty}</h6>
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
