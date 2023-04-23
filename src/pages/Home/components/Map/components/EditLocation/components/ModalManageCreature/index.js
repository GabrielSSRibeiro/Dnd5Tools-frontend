import React, { useState } from "react";
import * as lc from "../../../../../../../../constants/locationConstants";
import * as utils from "../../../../../../../../utils";

import ModalManageCreatureRoutine from "../ModalManageCreatureRoutine";
import Modal from "../../../../../../../../components/Modal";
import Button from "../../../../../../../../components/Button";

import "./styles.css";

function ModalManageCreature({ creature, contexts, onClose }) {
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

  return (
    <Modal title="Criatura" className="ModalManageCreature-container" onClickToClose={onClose}>
      {modal}
      <div className="new-creature-wrapper">
        <div className="creature-detail-group">
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
              <button onClick={() => DeleteRoutine(r)}>
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
      <footer>
        <button className="button-simple" onClick={HandleCancel}>
          Cancelar
        </button>
        <Button text="Salvar" onClick={HandleConfirm} />
      </footer>
    </Modal>
  );
}

export default ModalManageCreature;
