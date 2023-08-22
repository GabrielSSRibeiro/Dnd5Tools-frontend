import React, { useState } from "react";
import * as lc from "../../../../../../../../constants/locationConstants";
import * as utils from "../../../../../../../../utils";

import Modal from "../../../../../../../../components/Modal";
import ModalTextArea from "../../../../../../../../components/ModalTextArea";
import TextInput from "../../../../../../../../components/TextInput";
import Button from "../../../../../../../../components/Button";
import Select from "../../../../../../../../components/Select";

import "./styles.css";

function ModalManageContext({ context, isDefault, invalidNames, onClose }) {
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

  function CheckFinalButtonValid() {
    if (!tempContext.name || invalidNames.includes(tempContext.name) || !tempContext.firstImpressions) {
      return false;
    }

    return true;
  }

  return (
    <Modal
      title="Contexto"
      info={[
        {
          text: "Momento especiais pelo qual a localização pode estar passando. Ex: dominada pelo clã bandido/atormentada pelo dragão verde. Útil para deixar o mundo vivo e responsivo a eventos",
        },
      ]}
      className="ModalManageContext-container"
      onClickToClose={onClose}
    >
      {modal}
      <div className="new-context-wrapper df df-fd-c df-jc-fs">
        <TextInput label="Nome" value={tempContext} valuePropertyPath="name" onChange={setTempContext} disabled={isDefault} />
        <TextInput
          label="Primeiras Impressões"
          info={[
            {
              text: "O que quem se aproxima a primeira vez desse local experiencia",
            },
            {
              text: "Recomendado 1 entre: O que sentem, o que veem, o que cheiram, o que ouvem",
            },
          ]}
          value={tempContext}
          valuePropertyPath="firstImpressions"
          onChange={setTempContext}
        />
        <div className="details-wrapper">
          <button className="details-blocker" onClick={OpenModalDetails}>
            <i className="fas fa-pencil-alt"></i>
          </button>
          <TextInput label="Detalhes (opcional)" isMultiLine={true} value={tempContext} valuePropertyPath="details" onChange={setTempContext} />
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
          info={[
            {
              text: "Isso afeita em o quão longe o grupo consegue ver",
            },
            {
              text: "",
            },
            {
              text: "É representada por uma area ao redor do grupo no mapa",
            },
            {
              text: "",
            },
            {
              text: "A noite a visao panorâmica é sempre 0, tendo apenas a área de marcha sinalizada",
            },
          ]}
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
          info={[
            {
              text: "Chance de encontro por hora de exploração",
            },
            {
              text: "Essa escolha também decide a chance de encontrar corpos com recompensas",
            },
          ]}
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
        <Button text="Salvar" onClick={HandleConfirm} isDisabled={!CheckFinalButtonValid()} />
      </footer>
    </Modal>
  );
}

export default ModalManageContext;
