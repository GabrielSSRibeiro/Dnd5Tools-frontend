import React, { useState } from "react";

import { creatureLegendaryReactions, CREATURE_ACTION_FREQUENCIES, creatureActionFrequencies } from "../../../../../../data/creatureConstants";

import Button from "../../../../../../components/Button";
import Select from "../../../../../../components/Select";
import Info from "../../../../../../components/Info";
import ModalManageAction from "./components/ModalManageAction";
import ModalManageReaction from "./components/ModalManageReaction";
import ModalManageMultiaction from "./components/ModalManageMultiaction";
import ModalManageAura from "./components/ModalManageAura";

import "./styles.css";

function Actions({ creature, setCreature }) {
  const [modal, setModal] = useState(null);

  const maxNumberOfActions = 6;

  function OpenModalManageAction(action) {
    setModal(
      <ModalManageAction action={action} weakSpots={creature.weakSpots} onClose={(tempAction) => HandleCloseModalManageAction(action, tempAction)} />
    );
  }
  function HandleCloseModalManageAction(action, tempAction) {
    if (tempAction) {
      if (action) {
        let actionIndex = creature.actions.findIndex((a) => a.name === action.name);
        creature.actions.splice(actionIndex, 1, tempAction);
      } else {
        creature.actions.push(tempAction);
      }
    }

    setModal(null);
  }
  function DeleteAction(action) {
    creature.actions = creature.actions.filter((a) => a.name !== action.name);
    setCreature({ ...creature });
  }

  function OpenModalManageReaction(reaction) {
    setModal(<ModalManageReaction reaction={reaction} onClose={(tempReaction) => HandleCloseModalManageReaction(reaction, tempReaction)} />);
  }
  function HandleCloseModalManageReaction(reaction, tempReaction) {
    if (tempReaction) {
      if (reaction) {
        let reactionIndex = creature.reactions.findIndex((a) => a.name === reaction.name);
        creature.reactions.splice(reactionIndex, 1, tempReaction);
      } else {
        creature.reactions.push(tempReaction);
      }
    }

    setModal(null);
  }
  function DeleteReaction(reaction) {
    creature.reactions = creature.reactions.filter((r) => r.name !== reaction.name);
    setCreature({ ...creature });
  }

  function OpenModalManageMultiaction(multiaction) {
    setModal(<ModalManageMultiaction multiaction={multiaction} onClose={(newMultiaction) => HandleCloseModalManageMultiaction(newMultiaction)} />);
  }
  function HandleCloseModalManageMultiaction(newMultiaction) {
    if (newMultiaction) {
      creature.multiaction = newMultiaction;
    }

    setModal(null);
  }

  function OpenModalManageAura(aura) {
    setModal(<ModalManageAura aura={aura} onClose={(newAura) => HandleCloseModalManageAura(newAura)} />);
  }
  function HandleCloseModalManageAura(newAura) {
    if (newAura) {
      creature.aura = newAura;
    }

    setModal(null);
  }

  return (
    <div className="Actions-container">
      {modal}
      <div className="actions-row">
        <div className="actions">
          <div className="section-label">
            <h2>Ações</h2>
            <Info contents={[{ text: "Mínimo de 1 ação comum" }]} />
          </div>
          <Button text="Adicionar" onClick={() => OpenModalManageAction()} isDisabled={creature.actions.length >= maxNumberOfActions} />
          <div className="actions-wrapper">
            {creature.actions.map((action) => (
              <div className="creature-action">
                <span>{action.name}</span>
                <div>
                  <span>{creatureActionFrequencies.find((af) => af.value === action.frequency).display}</span>
                  <button onClick={() => OpenModalManageAction(action)} className="edit-row">
                    <i class="fas fa-pencil-alt"></i>
                  </button>
                  <button onClick={() => DeleteAction(action)} className="delete-row">
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="reactions">
          <h2>Reações</h2>
          <div className="reactions-options-wrapper">
            <Button text="Adicionar" onClick={() => OpenModalManageReaction()} isDisabled={creature.reactions.length >= maxNumberOfActions} />
            <Select
              label={"Reações Extras / Rodada"}
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
          <div className="actions-wrapper">
            {creature.reactions.map((reaction) => (
              <div className="creature-action">
                <span>{reaction.name}</span>
                <div>
                  <span>{creatureActionFrequencies.find((af) => af.value === reaction.frequency).display}</span>
                  <button onClick={() => OpenModalManageReaction(reaction)} className="edit-row">
                    <i class="fas fa-pencil-alt"></i>
                  </button>
                  <button onClick={() => DeleteReaction(reaction)} className="delete-row">
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="reactions-wrapper"></div>
        </div>
      </div>
      <div className="actions-divider"></div>
      {/* {creature.actions.length === 0 && creature.reactions.length === 0 && <div className="actions-divider"></div>} */}
      <div className="actions-row">
        <div className="multiaction">
          <div className="section-label">
            <h2>Multiação</h2>
            <Info contents={[{ text: "Seleciona e crie uma combinação de ações comuns" }]} />
          </div>
          <Button
            text="Selecionar"
            onClick={() => OpenModalManageMultiaction()}
            isDisabled={!creature.actions.some((a) => a.frequency === CREATURE_ACTION_FREQUENCIES.COMMON)}
          />
        </div>
        <div className="aura">
          <div className="section-label">
            <h2>Aura</h2>
            <Info contents={[{ text: "Opcional" }, { text: "Efeito ativado quando uma criatura entra no alcance da aura" }]} />
          </div>
          <Button text="Definir" onClick={() => OpenModalManageAura()} />
        </div>
      </div>
    </div>
  );
}

export default Actions;
