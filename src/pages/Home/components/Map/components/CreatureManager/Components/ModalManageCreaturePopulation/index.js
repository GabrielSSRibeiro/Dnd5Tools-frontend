import React, { useState, useRef } from "react";
import * as utils from "../../../../../../../../utils";

import Modal from "../../../../../../../../components/Modal";
import Button from "../../../../../../../../components/Button";
import Select from "../../../../../../../../components/Select";

import "./styles.css";

function ModalManageCreaturePopulation({ population, onClose }) {
  const [tempPopulation, setTempPopulation] = useState(
    population
      ? utils.clone(population)
      : {
          value: null,
          current: null,
        }
  );
  const populations = useRef([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 100]);

  function HandleCancel() {
    onClose();
  }

  function HandleConfirm() {
    const isInfinity = tempPopulation.value == null;
    onClose(isInfinity ? null : tempPopulation, isInfinity);
  }

  function HandleChangeValue(newValue) {
    newValue.current = newValue.value;
    setTempPopulation(newValue);
  }

  function CheckFinalButtonValid() {
    return true;
  }

  return (
    <Modal
      title="População"
      className="ModalManageCreaturePopulation-container"
      onClickToClose={onClose}
      info={[
        {
          text: "Até quantas criaturas podem ser encontradas quando explorando a localização",
        },
      ]}
    >
      <div className="new-population-wrapper">
        <Select
          label={"Total"}
          extraWidth={250}
          value={tempPopulation}
          valuePropertyPath="value"
          nothingSelected="Infinito"
          onSelect={HandleChangeValue}
          options={populations.current}
        />
        <div className="df df-cg-25">
          <div className="df df-cg-5">
            <Button
              icon="fas fa-minus-square"
              onClick={() => setTempPopulation({ ...tempPopulation, current: 0 })}
              isDisabled={!tempPopulation.value || tempPopulation.current === 0}
            />
            <Button
              icon="fas fa-minus"
              onClick={() => setTempPopulation({ ...tempPopulation, current: tempPopulation.current - 1 })}
              isDisabled={!tempPopulation.value || tempPopulation.current === 0}
            />
          </div>
          <h2>{tempPopulation.value ? `${tempPopulation.current} / ${tempPopulation.value}` : <i className="fas fa-infinity"></i>}</h2>
          <div className="df df-cg-5">
            <Button
              icon="fas fa-plus"
              onClick={() => setTempPopulation({ ...tempPopulation, current: tempPopulation.current + 1 })}
              isDisabled={!tempPopulation.value || tempPopulation.current === tempPopulation.value}
            />
            <Button
              icon="fas fa-plus-square"
              onClick={() => setTempPopulation({ ...tempPopulation, current: tempPopulation.value })}
              isDisabled={!tempPopulation.value || tempPopulation.current === tempPopulation.value}
            />
          </div>
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

export default ModalManageCreaturePopulation;
