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
    if (!travel.oriented && travel.pace !== lc.TRAVEL_PACES.REST) {
      const modifier = 0.1;
      newCurrentNode.x = utils.randomValueFromVariancePercentage(newCurrentNode.x, modifier);
      newCurrentNode.y = utils.randomValueFromVariancePercentage(newCurrentNode.y, modifier);
    }

    newCurrentNode.name = name;
    newCurrentNode.notes = notes;
    travel.schedule = GetUpdatedSchedule(travel.schedule + locHoverData.distance.travelTimeInMin);
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
        {hasMoved && (
          <h4>
            {locHoverData.distance.valueInUnits} percorrido(s) em {timeInUnits}
          </h4>
        )}
        <h4>preci</h4>
        <h4>temp</h4>
        <h6>Encontrar Recursos: CD {findResourcesDifficulty}</h6>
        <TextInput label="Nome" value={name} onChange={setName} className="" />
        <TextInput label="Notas (opcional)" value={notes} onChange={setNotes} className="" />
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
