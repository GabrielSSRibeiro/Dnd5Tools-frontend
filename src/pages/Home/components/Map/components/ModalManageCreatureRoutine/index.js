import React, { useState, useMemo } from "react";
import * as lc from "../../../../../../constants/locationConstants";
import * as utils from "../../../../../../utils";

import Modal from "../../../../../../components/Modal";
import Button from "../../../../../../components/Button";
import Select from "../../../../../../components/Select";

import "./styles.css";

function ModalManageCreatureRoutine({ routine, contexts, isPointOfInterest, onClose }) {
  const [tempRoutine, setTempRoutine] = useState(
    routine
      ? utils.clone(routine)
      : {
          schedule: null,
          precipitation: null,
          temperature: null,
          context: contexts[0],
          groupSize: lc.GROUP_SIZES.SOLO,
          encounterFrequency: null,
        }
  );
  const encounterFrequencies = useMemo(() => {
    let encounterFrequencies = lc.encounterFrequencies;

    if (!isPointOfInterest) {
      encounterFrequencies = encounterFrequencies.filter((f) => f.value !== lc.ENCOUNTER_FREQUENCIES.CERTAIN);
    }

    return encounterFrequencies;
  }, [isPointOfInterest]);

  function HandleCancel() {
    onClose();
  }

  function HandleConfirm() {
    onClose(tempRoutine);
  }

  function CheckFinalButtonValid() {
    if (!tempRoutine.encounterFrequency) {
      return false;
    }

    return true;
  }

  return (
    <Modal
      title="Rotina"
      className="ModalManageCreatureRoutine-container"
      onClickToClose={onClose}
      info={[
        {
          text: "Uma rotina define como é possivel encontrar uma criatura em uma localização",
        },
      ]}
    >
      <div className="new-creature-wrapper">
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
          options={lc.routinePrecipitations}
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
          options={lc.routineTemperatures}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Tamanho de Grupo"}
          extraWidth={250}
          value={tempRoutine}
          valuePropertyPath="groupSize"
          onSelect={setTempRoutine}
          options={lc.groupSizes}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        {!isPointOfInterest && (
          <Select
            label={"Frequência de Encontro"}
            info={[{ text: "Quando um encontro é sorteado para acontecer na localização, qual a chance de essa criatura aparecer" }]}
            extraWidth={250}
            value={tempRoutine}
            valuePropertyPath="encounterFrequency"
            onSelect={setTempRoutine}
            options={encounterFrequencies}
            optionDisplay={(o) => o.display}
            optionValue={(o) => o.value}
          />
        )}
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

export default ModalManageCreatureRoutine;
