import React, { useState } from "react";

import { TREASURE_TYPES } from "../../../../../../constants/treasureConstants";
import { creatureReactionsPerRound, creatureActionFrequencies, creatureAuraReaches } from "../../../../../../constants/creatureConstants";

import Button from "../../../../../../components/Button";
import Select from "../../../../../../components/Select";
import Info from "../../../../../../components/Info";
import ModalManageAction from "./components/ModalManageAction";
import ModalManageReaction from "./components/ModalManageReaction";
import ModalManageAura from "./components/ModalManageAura";

import "./styles.css";

function Actions({ creature, setCreature }) {
  const [modal, setModal] = useState(null);

  const maxNumberOfActions = 6;

  function OpenModalManageAction(action) {
    let invalidNames = creature.actions.filter((a) => a.name !== action?.name).map((a) => a.name);

    setModal(
      <ModalManageAction
        action={action}
        invalidNames={invalidNames}
        weakSpots={creature.weakSpots}
        onClose={(tempAction) => HandleCloseModalManageAction(action, tempAction)}
      />
    );
  }
  function HandleCloseModalManageAction(action, tempAction) {
    if (tempAction) {
      if (action) {
        if (action.name !== tempAction.name) {
          creature.treasures
            .filter((t) => t.type === TREASURE_TYPES.EQUIPMENT && t.equipment.ability === action.name)
            .forEach((t) => {
              t.equipment.ability = tempAction.name;
            });
        }

        let actionIndex = creature.actions.findIndex((a) => a.name === action.name);
        creature.actions.splice(actionIndex, 1, tempAction);
      } else {
        creature.actions.push(tempAction);
      }

      setCreature({ ...creature });
    }

    setModal(null);
  }
  function DeleteAction(action) {
    creature.treasures
      .filter((t) => t.type === TREASURE_TYPES.EQUIPMENT && t.equipment.ability === action.name)
      .forEach((t) => {
        t.equipment.ability = null;
      });

    creature.actions = creature.actions.filter((a) => a.name !== action.name);
    setCreature({ ...creature });
  }

  function OpenModalManageReaction(reaction) {
    let invalidNames = creature.reactions.filter((r) => r.name !== reaction?.name).map((r) => r.name);

    setModal(
      <ModalManageReaction
        reaction={reaction}
        invalidNames={invalidNames}
        weakSpots={creature.weakSpots}
        onClose={(tempReaction) => HandleCloseModalManageReaction(reaction, tempReaction)}
      />
    );
  }
  function HandleCloseModalManageReaction(reaction, tempReaction) {
    if (tempReaction) {
      if (reaction) {
        let reactionIndex = creature.reactions.findIndex((a) => a.name === reaction.name);
        creature.reactions.splice(reactionIndex, 1, tempReaction);
      } else {
        creature.reactions.push(tempReaction);
      }

      setCreature({ ...creature });
    }

    setModal(null);
  }
  function DeleteReaction(reaction) {
    creature.reactions = creature.reactions.filter((r) => r.name !== reaction.name);
    setCreature({ ...creature });
  }

  function OpenModalManageAura() {
    setModal(<ModalManageAura aura={creature.aura} weakSpots={creature.weakSpots} onClose={(newAura) => HandleCloseModalManageAura(newAura)} />);
  }
  function HandleCloseModalManageAura(newAura) {
    if (newAura) {
      creature.aura = newAura;
      setCreature({ ...creature });
    }

    setModal(null);
  }
  function DeleteAura() {
    creature.aura = null;
    setCreature({ ...creature });
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
              <div className="creature-action" key={action.name}>
                <span>{action.name}</span>
                <div>
                  <span>{creatureActionFrequencies.find((af) => af.value === action.frequency).display}</span>
                  <button onClick={() => OpenModalManageAction(action)} className="edit-row">
                    <i className="fas fa-pencil-alt"></i>
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
              label={"Reações / Rodada"}
              extraWidth={120}
              value={creature}
              valuePropertyPath="reactionsPerRound"
              onSelect={setCreature}
              options={creatureReactionsPerRound}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              className="reaction-number"
            />
          </div>
          <div className="actions-wrapper">
            {creature.reactions.map((reaction) => (
              <div className="creature-action" key={reaction.name}>
                <span>{reaction.name}</span>
                <div>
                  <span>{creatureActionFrequencies.find((af) => af.value === reaction.frequency).display}</span>
                  <button onClick={() => OpenModalManageReaction(reaction)} className="edit-row">
                    <i className="fas fa-pencil-alt"></i>
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
      <div className="aura">
        <div className="section-label">
          <h2>Aura</h2>
          <Info contents={[{ text: "Opcional" }, { text: "Efeito ativado quando uma criatura começa sua turno dentro do alcance da aura" }]} />
        </div>
        <Button text="Definir" onClick={() => OpenModalManageAura()} isDisabled={creature.aura} />
        {creature.aura && (
          <div className="actions-wrapper">
            <div className="creature-action">
              <span>{creature.aura.name}</span>
              <div>
                <span>{creatureAuraReaches.find((ar) => ar.value === creature.aura.reach).display}</span>
                <button onClick={() => OpenModalManageAura()} className="edit-row">
                  <i className="fas fa-pencil-alt"></i>
                </button>
                <button onClick={() => DeleteAura()} className="delete-row">
                  Deletar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Actions;
