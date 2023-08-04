import React, { useState } from "react";
import * as lc from "../../../../../../../../constants/locationConstants";
import * as utils from "../../../../../../../../utils";

import ModalManageCreatureRoutine from "../ModalManageCreatureRoutine";
import Modal from "../../../../../../../../components/Modal";
import Button from "../../../../../../../../components/Button";

import "./styles.css";

function ModalManageCreature({ name, creature, contexts, onClose }) {
  const [modal, setModal] = useState(null);
  const [tempCreature, setTempCreature] = useState(
    creature
      ? utils.clone(creature)
      : {
          creatureId: null,
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
    <Modal title={name} className="ModalManageCreature-container" onClickToClose={onClose}>
      {modal}
      <div className="new-creature-wrapper">
        <div className="creature-detail-group-title">
          <span>Rotinas</span>
          <button onClick={() => OpenModalManageRoutine()}>
            <i className="fas fa-plus"></i>
          </button>
        </div>
        {tempCreature.routines.map((r) => (
          <div className="creature-detail-group-item" key={r.encounterFrequency}>
            <span>{contexts.find((c) => c === r.context) ?? "-"}</span>

            <span>{r.schedule ? <i className={lc.GetRoutineSchedule(r.schedule).icon}></i> : "-"}</span>
            <span>{r.precipitation ? <i className={lc.GetRoutinePrecipitation(r.precipitation).icon}></i> : "-"}</span>
            <span>{r.temperature ? <i className={lc.GetRoutineTemperature(r.temperature).icon}></i> : "-"}</span>
            <span>
              {lc.GetGroupSize(r.groupSize).routineDisplay} <i className="fas fa-dragon"></i>
            </span>
            <span>% {lc.GetEncounterFrequency(r.encounterFrequency).display}</span>
            <div className="group-item-actions">
              <button onClick={() => OpenModalManageRoutine(r)}>
                <i className="fas fa-pencil-alt"></i>
              </button>
              <button onClick={() => DeleteRoutine(r)} disabled={tempCreature.routines.length === 1}>
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
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
