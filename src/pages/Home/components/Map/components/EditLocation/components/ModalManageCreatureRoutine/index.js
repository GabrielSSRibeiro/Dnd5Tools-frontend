import React, { useState } from "react";
import * as lc from "../../../../../../../../constants/locationConstants";
import * as utils from "../../../../../../../../utils";

import Modal from "../../../../../../../../components/Modal";
import Button from "../../../../../../../../components/Button";
import Select from "../../../../../../../../components/Select";

import "./styles.css";

function ModalManageCreatureRoutine({ routine, routines, contexts, onClose }) {
  const [tempRoutine, setTempRoutine] = useState(
    routine
      ? utils.clone(routine)
      : {
          schedule: null,
          precipitation: null,
          temperature: null,
          context: null,
          encounterFrequency: null,
        }
  );

  function HandleCancel() {
    onClose();
  }

  function HandleConfirm() {
    onClose(tempRoutine);
  }

  return (
    <Modal title="Rotina" className="ModalManageCreatureRoutine-container" onClickToClose={onClose}>
      <div className="new-creature-wrapper">
        <Select
          label={"Horários"}
          extraWidth={250}
          value={tempRoutine}
          valuePropertyPath="schedule"
          nothingSelected="Todos"
          onSelect={setTempRoutine}
          options={lc.routineSchedules}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Precipitação"}
          extraWidth={250}
          value={tempRoutine}
          valuePropertyPath="precipitation"
          nothingSelected="Todas"
          onSelect={setTempRoutine}
          options={lc.precipitationFrequencies}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Temperatura"}
          extraWidth={250}
          value={tempRoutine}
          valuePropertyPath="temperature"
          nothingSelected="Todas"
          onSelect={setTempRoutine}
          options={lc.intenseTemperatureFrequencies}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Contexto"}
          extraWidth={250}
          value={tempRoutine}
          valuePropertyPath="context"
          nothingSelected="Todos"
          onSelect={setTempRoutine}
          options={contexts}
        />
        <Select
          label={"Frequência de Encontro"}
          extraWidth={250}
          value={tempRoutine}
          valuePropertyPath="encounterFrequency"
          onSelect={setTempRoutine}
          options={lc.encounterFrequencies.filter(
            (f) => f.value === routine?.encounterFrequency || !routines.some((r) => r.encounterFrequency === f.value)
          )}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
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

export default ModalManageCreatureRoutine;
