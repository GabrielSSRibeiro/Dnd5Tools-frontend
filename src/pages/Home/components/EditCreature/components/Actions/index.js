import React, { useState } from "react";

import { creatureLegendaryReactions } from "../../../../../../data/creatureConstants";

import Button from "../../../../../../components/Button";
import Select from "../../../../../../components/Select";
import Modal from "../../../../../../components/Modal";
import Info from "../../../../../../components/Info";

import "./styles.css";

function Actions({ creature, setCreature }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ACTION_TYPES = { ACTIONS: "Ações", REACTIONS: "Reações", MULTIACTIONS: "Multiações", AURA: "Aura" };

  function HandleOpenModal(actionType) {
    //modificar ACTION_TYPES para ter essa logica no obj
    switch (actionType) {
      case ACTION_TYPES.ACTIONS:
        break;
      case ACTION_TYPES.REACTIONS:
        break;
      case ACTION_TYPES.MULTIACTIONS:
        break;
      case ACTION_TYPES.AURA:
        break;
      default:
        break;
    }

    setIsModalOpen(!isModalOpen);
  }

  return (
    <div className="Actions-container">
      {isModalOpen && <Modal title="Teste" clickToClose={true} onClose={() => setIsModalOpen(!isModalOpen)} className=""></Modal>}
      <div className="actions-row">
        <div className="actions">
          <div className="section-label">
            <h2>{ACTION_TYPES.ACTIONS}</h2>
            <Info contents={[{ text: "Mínimo de 1 ação comum" }]} />
          </div>
          <Button text="Adicionar" onClick={() => HandleOpenModal(ACTION_TYPES.ACTIONS)} />
          <div className="actions-wrapper">
            {creature.actions.map((a) => (
              <div className="creature-action">{a}</div>
            ))}
          </div>
        </div>
        <div className="reactions">
          <h2>{ACTION_TYPES.REACTIONS}</h2>
          <div className="reactions-options-wrapper">
            <Button text="Adicionar" onClick={() => HandleOpenModal(ACTION_TYPES.REACTIONS)} />
            <Select
              label={"Reações Lendárias"}
              extraWidth={75}
              value={creature}
              valuePropertyPath="movements.swimming"
              onSelect={setCreature}
              nothingSelected="Nenhuma"
              options={creatureLegendaryReactions}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              className="reaction-number"
            />
          </div>
          <div className="reactions-wrapper"></div>
        </div>
      </div>
      <div className="actions-divider"></div>
      <div className="actions-row">
        <div className="multiactions">
          <div className="section-label">
            <h2>{ACTION_TYPES.MULTIACTIONS}</h2>
            <Info contents={[{ text: "Seleciona e crie uma combinação de ações comuns" }]} />
          </div>
          <Button text="Selecionar" onClick={() => HandleOpenModal(ACTION_TYPES.MULTIACTIONS)} isDisabled={true} />
        </div>
        <div className="aura">
          <div className="section-label">
            <h2>{ACTION_TYPES.AURA}</h2>
            <Info contents={[{ text: "Opcional" }, { text: "Efeito ativado quando uma criatura entra no alcance da aura" }]} />
          </div>
          <Button text="Definir" onClick={() => HandleOpenModal(ACTION_TYPES.AURA)} />
        </div>
      </div>
    </div>
  );
}

export default Actions;
