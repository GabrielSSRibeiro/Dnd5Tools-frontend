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
          rumors: null,
          secrets: null,
          precipitationFrequency: lc.PRECIPITATION_FREQUENCIES.LOW,
          intenseTemperatureFrequency: null,
          panoramicVision: lc.PANORAMIC_VISIONS.MEDIUM,
          hazardousness: lc.HAZARDOUSNESS.MEDIUM,
          resourceEasiness: lc.RESOURCE_EASINESS.NORMAL,
        }
  );

  function HandleCancel() {
    onClose();
  }

  function HandleConfirm() {
    onClose(tempContext);
  }

  function OpenModalDetails(property, title, placeholder) {
    setModal(
      <ModalTextArea
        title={title}
        text={tempContext[property]}
        placeholder={placeholder}
        onClose={(tempTextArea) => HandleCloseModalTextArea(tempTextArea, property)}
      />
    );
  }
  function HandleCloseModalTextArea(tempTextArea, property) {
    if (tempTextArea != null) {
      tempContext[property] = tempTextArea;
      setTempContext({ ...tempContext });
    }

    setModal(null);
  }

  function CheckFinalButtonValid() {
    if (!tempContext.name || invalidNames.includes(tempContext.name)) {
      return false;
    }

    return true;
  }

  return (
    <Modal
      title="Contexto"
      info={[
        {
          text: "Momento pelo qual a localização pode estar passando. Útil para deixar vivo e responsivo a eventos. Contextos na localização principal adicionam as criatruas a todas as localizações",
        },
        { text: "Ex: dominada pelo clã bandido/atormentada pelo dragão verde" },
      ]}
      className="ModalManageContext-container"
    >
      {modal}
      <div className="new-context-wrapper df df-fd-c df-jc-fs">
        <TextInput
          label="Nome"
          value={tempContext}
          valuePropertyPath="name"
          onChange={setTempContext}
          disabled={isDefault}
          className={isDefault ? "element-disabled" : ""}
        />
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
              text: "Isso afeita o quão longe o grupo consegue ver. Terrenos elevadas a frente podem ser vistas mesmo além dessa distância",
            },
            {
              text: "",
            },
            {
              text: "É representada por uma área ao redor do grupo no mapa. A noite, nao existe visao panorâmica",
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
          label={"Periculosidade (chance de encontro)"}
          info={[
            {
              text: "Representado por borda colorida ao redor dos detalhes da localização",
            },
            {
              text: "",
            },
            {
              text: "Essa escolha também decide a chance de encontrar corpos com recompensas",
            },
            {
              text: "",
            },
            {
              text: "Essa chance cresce até que um encontro aconteça, depois zera",
            },
            {
              text: "",
            },
            {
              text: "Quando vermelho, indica que uma MARCHA é sugerida",
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
      <footer className="df df-jc-sb">
        <div className="df df-jc-sb df-cg-15">
          <button
            title="Primeiras Impressões"
            className={`button-simple${!tempContext.firstImpressions ? " lacking-data" : ""}`}
            onClick={() =>
              OpenModalDetails(
                "firstImpressions",
                "Primeiras Impressões",
                "O que quem se aproxima a primeira vez desse local experiencia. Algo entre o que sentem, o que veem, o que cheiram, o que ouvem..."
              )
            }
          >
            <i className="fas fa-eye"></i>
          </button>
          <button title="Geral" className="button-simple" onClick={() => OpenModalDetails("details", "Geral", "Geral")}>
            <i className="fas fa-info-circle"></i>
          </button>
          <button title="Rumores" className="button-simple" onClick={() => OpenModalDetails("rumors", "Rumores", "Rumores")}>
            <i className="fas fa-assistive-listening-systems"></i>
          </button>
          <button title="Segredos" className="button-simple" onClick={() => OpenModalDetails("secrets", "Segredos", "Segredos")}>
            <i className="fas fa-mask"></i>
          </button>
        </div>
        <div className="df df-jc-sb df-cg-15">
          <button className="button-simple" onClick={HandleCancel}>
            Cancelar
          </button>
          <Button text="Salvar" onClick={HandleConfirm} isDisabled={!CheckFinalButtonValid()} />
        </div>
      </footer>
    </Modal>
  );
}

export default ModalManageContext;
