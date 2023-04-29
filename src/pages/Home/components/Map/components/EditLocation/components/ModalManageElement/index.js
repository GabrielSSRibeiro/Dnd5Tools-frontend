import React, { useState } from "react";
import * as lc from "../../../../../../../../constants/locationConstants";
import * as cc from "../../../../../../../../constants/creatureConstants";
import * as utils from "../../../../../../../../utils";

import Modal from "../../../../../../../../components/Modal";
import Button from "../../../../../../../../components/Button";
import Select from "../../../../../../../../components/Select";

import "./styles.css";

function ModalManageElement({ element, onClose }) {
  const [tempElement, setTempElement] = useState(
    element
      ? utils.clone(element)
      : {
          type: null,
          frequency: null,
          groupSize: null,
          hazardousness: null,
          material: {
            Probability: null,
            rarity: null,
          },
        }
  );

  function HandleCancel() {
    onClose();
  }

  function HandleConfirm() {
    onClose(tempElement);
  }

  function CheckFinalButtonValid() {
    if (!tempElement.type || !tempElement.frequency) {
      return false;
    }

    return true;
  }

  return (
    <Modal title="Elemento" className="ModalManageElement-container" onClickToClose={onClose}>
      <div className="new-element-wrapper">
        <Select
          label={"Tipo"}
          extraWidth={250}
          value={tempElement}
          valuePropertyPath="type"
          onSelect={setTempElement}
          options={lc.elementTypes}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Frequência"}
          extraWidth={250}
          value={tempElement}
          valuePropertyPath="frequency"
          onSelect={setTempElement}
          options={lc.encounterFrequencies}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Tamanho do Grupo"}
          extraWidth={250}
          value={tempElement}
          valuePropertyPath="groupSize"
          onSelect={setTempElement}
          nothingSelected="Solitário"
          options={lc.groupSizes}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Periculosidade"}
          extraWidth={250}
          value={tempElement}
          valuePropertyPath="hazardousness"
          onSelect={setTempElement}
          nothingSelected="Nenhum"
          options={lc.hazardousness}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Frequência de Ser Material"}
          extraWidth={250}
          value={tempElement}
          valuePropertyPath="material.Probability"
          onSelect={setTempElement}
          nothingSelected="Nenhum"
          options={lc.elementMaterialFrequencies}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        {tempElement.material.Probability && (
          <Select
            label={"Raridade"}
            extraWidth={250}
            value={tempElement}
            valuePropertyPath="material.rarity"
            onSelect={setTempElement}
            options={cc.creatureRarities}
            optionDisplay={(o) => o.treasureDisplay}
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

export default ModalManageElement;
