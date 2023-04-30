import React, { useState } from "react";
import * as lc from "../../../../../../../../constants/locationConstants";
import * as utils from "../../../../../../../../utils";

import ModalManageCreatureRoutine from "../ModalManageCreatureRoutine";
import Modal from "../../../../../../../../components/Modal";
import Button from "../../../../../../../../components/Button";
import Select from "../../../../../../../../components/Select";

import "./styles.css";

function ModalManageCreature({ creature, contexts, onClose }) {
  const [modal, setModal] = useState(null);
  const [tempCreature, setTempCreature] = useState(
    creature
      ? utils.clone(creature)
      : {
          creatureId: null,
          groupSize: null,
          routines: [],
        }
  );

  function OpenModalManageRoutine(routine) {
    setModal(
      <ModalManageCreatureRoutine
        routine={routine}
        routines={tempCreature.routines}
        contexts={contexts}
        onClose={(tempRoutine) => HandleCloseModalManageRoutine(routine, tempRoutine)}
      />
    );
  }
  function HandleCloseModalManageRoutine(routine, tempRoutine) {
    if (tempRoutine) {
      if (routine) {
        let index = tempCreature.routines.findIndex((r) => r.encounterFrequency === routine.encounterFrequency);
        tempCreature.routines.splice(index, 1, tempRoutine);
      } else {
        tempCreature.routines.push(tempRoutine);
      }

      setTempCreature({ ...tempCreature });
    }

    setModal(null);
  }
  function DeleteRoutine(routine) {
    tempCreature.routines = tempCreature.routines.filter((r) => r.encounterFrequency !== routine.encounterFrequency);
    setTempCreature({ ...tempCreature });
  }

  function HandleCancel() {
    onClose();
  }

  function HandleConfirm() {
    onClose(tempCreature);
  }

  function CheckFinalButtonValid() {
    return true;
  }

  return (
    <Modal title="Criatura" className="ModalManageCreature-container" onClickToClose={onClose}>
      {modal}
      <div className="new-creature-wrapper">
        <Select
          label={"Tamanho do Grupo"}
          extraWidth={250}
          value={tempCreature}
          valuePropertyPath="groupSize"
          nothingSelected="Solitário"
          onSelect={setTempCreature}
          options={lc.groupSizes}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <div className="creature-detail-group">
          <div className="creature-detail-group-title">
            <span>Rotinas</span>
            <button onClick={() => OpenModalManageRoutine()}>
              <i class="fas fa-plus"></i>
            </button>
          </div>
          {tempCreature.routines.map((r) => (
            <div className="creature-detail-group-item" key={r.encounterFrequency}>
              <span>{lc.GetRoutineSchedule(r.schedule)?.display ?? "-"}</span>
              <span>{lc.GetPrecipitationFrequency(r.precipitation)?.display ?? "-"}</span>
              <span>{lc.GetIntenseTemperatureFrequency(r.temperature)?.display ?? "-"}</span>
              <span>{contexts.find((c) => c === r.context) ?? "-"}</span>
              <span>{lc.GetGroupSize(r.groupSize)?.display ?? "-"}</span>
              <span>{lc.GetEncounterFrequency(r.encounterFrequency)?.display ?? "-"}</span>
              <div className="group-item-actions">
                <button onClick={() => OpenModalManageRoutine(r)}>
                  <i className="fas fa-pencil-alt"></i>
                </button>
                <button onClick={() => DeleteRoutine(r)} disabled={tempCreature.routines.length === 1}>
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer>
        <button className="button-simple" onClick={HandleCancel}>
          Cancelar
        </button>
        <Button text="Salvar" onClick={HandleConfirm} isDisabled={!CheckFinalButtonValid()} />
      </footer>
    </Modal>
  );
}

export default ModalManageCreature;
