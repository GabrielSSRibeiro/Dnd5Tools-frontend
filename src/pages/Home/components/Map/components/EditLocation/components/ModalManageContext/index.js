import React, { useState } from "react";
import * as lc from "../../../../../../../../constants/locationConstants";
import * as utils from "../../../../../../../../utils";

import Modal from "../../../../../../../../components/Modal";
import ModalTextArea from "../../../../../../../../components/ModalTextArea";
import TextInput from "../../../../../../../../components/TextInput";
import Button from "../../../../../../../../components/Button";
import Select from "../../../../../../../../components/Select";

import "./styles.css";

function ModalManageContext({ context, onClose }) {
  const [modal, setModal] = useState(null);
  const [tempContext, setTempContext] = useState(
    context
      ? utils.clone(context)
      : {
          isCurrent: false,
          name: null,
          firstImpressions: null,
          details: null,
          precipitationFrequency: null,
          intenseTemperatureFrequency: null,
          panoramicVision: lc.PANORAMIC_VISIONS.MEDIUM,
          hazardousness: lc.HAZARDOUSNESS.LOW,
          resourceEasiness: lc.RESOURCE_EASINESS.NORMAL,
        }
  );

  function HandleCancel() {
    onClose();
  }

  function HandleConfirm() {
    onClose(tempContext);
  }

  function OpenModalDetails() {
    setModal(<ModalTextArea title="Descrição" text={tempContext.details} onClose={HandleCloseModalTextArea} />);
  }
  function HandleCloseModalTextArea(tempTextArea) {
    if (tempTextArea != null) {
      tempContext.details = tempTextArea;
      setTempContext({ ...tempContext });
    }

    setModal(null);
  }

  return (
    <Modal title="Contexto" className="ModalManageContext-container" onClickToClose={onClose}>
      {modal}
      <div className="new-context-wrapper df df-fd-c df-jc-fs">
        <TextInput label="Nome" value={tempContext} valuePropertyPath="name" onChange={setTempContext} />
        <TextInput label="Primeiras Impressões" value={tempContext} valuePropertyPath="firstImpressions" onChange={setTempContext} />
        <div className="details-wrapper">
          <button className="details-blocker" onClick={OpenModalDetails}>
            <i className="fas fa-pencil-alt"></i>
          </button>
          <TextInput label="Detalhes" isMultiLine={true} value={tempContext} valuePropertyPath="details" onChange={setTempContext} />
        </div>
        <Select
          label={"Chance de Precipitação"}
          extraWidth={250}
          value={tempContext}
          valuePropertyPath="precipitationFrequency"
          onSelect={setTempContext}
          nothingSelected="Nenhuma"
          options={lc.precipitationFrequencies}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Chance de Temperatura Intensa"}
          extraWidth={250}
          value={tempContext}
          valuePropertyPath="intenseTemperatureFrequency"
          onSelect={setTempContext}
          nothingSelected="Nenhuma"
          options={lc.intenseTemperatureFrequencies}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Visão Panorâmica"}
          extraWidth={250}
          value={tempContext}
          valuePropertyPath="panoramicVision"
          onSelect={setTempContext}
          options={lc.panoramicVisions}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Periculosidade"}
          extraWidth={250}
          value={tempContext}
          valuePropertyPath="hazardousness"
          onSelect={setTempContext}
          options={lc.hazardousness}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Facilidade de Recursos"}
          extraWidth={250}
          value={tempContext}
          valuePropertyPath="resourceEasiness"
          onSelect={setTempContext}
          options={lc.resourceEasiness}
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

export default ModalManageContext;
