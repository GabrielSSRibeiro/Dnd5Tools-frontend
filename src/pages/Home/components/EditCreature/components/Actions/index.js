import React, { useState } from "react";
import * as utils from "../../../../../../utils";

import { TREASURE_TYPES } from "../../../../../../constants/treasureConstants";
import {
  CREATURE_RARITIES,
  GetRarity,
  creatureReactionsPerRound,
  creatureActionFrequencies,
  creatureAuraReaches,
  CREATURE_ACTION_FREQUENCIES,
  actionTemplates,
} from "../../../../../../constants/creatureConstants";
import { GetAverageLevel, GetActionFromTemplate } from "../../../../../../helpers/creatureHelper";

import Button from "../../../../../../components/Button";
import Select from "../../../../../../components/Select";
import Info from "../../../../../../components/Info";
import ModalManageAction from "./components/ModalManageAction";
import ModalManageReaction from "./components/ModalManageReaction";
import ModalManageAura from "./components/ModalManageAura";

import "./styles.css";

function Actions({ creature, setCreature }) {
  const [modal, setModal] = useState(null);
  const [actionTemplate, setActionTemplate] = useState(null);
  const [reActionTemplate, setReactionTemplate] = useState(null);

  const maxNumberOfActions = 6;

  function AddAction() {
    if (!actionTemplate) {
      OpenModalManageAction();
    } else {
      HandleCloseModalManageAction(null, GetActionFromTemplate(actionTemplate, creature.rarity, creature.size));
      setActionTemplate(null);
    }
  }
  function OpenModalManageAction(action, index) {
    let invalidNames = creature.actions.map((a) => a.name);
    if (index != null) {
      invalidNames = invalidNames.filter((n) => n !== action?.name);
    }

    setModal(
      <ModalManageAction
        level={creature.rarity === CREATURE_RARITIES.LEGENDARY ? GetRarity(creature.rarity).baseOutputMin : GetAverageLevel(creature.rarity)}
        action={action}
        invalidNames={invalidNames}
        weakSpots={creature.weakSpots}
        onClose={(tempAction) => HandleCloseModalManageAction(action, tempAction, index)}
      />
    );
  }
  function HandleCloseModalManageAction(action, tempAction, index) {
    //if cancel, leave
    if (!tempAction) {
      setModal(null);
      return;
    }

    //if new, add and sort
    if (!action || index == null) {
      creature.actions.push(tempAction);
      creature.actions = utils.GetArrayOfObjMultisortedByProperties(creature.actions, ["frequency", "name"]);
      setCreature({ ...creature });
      setModal(null);
      return;
    }

    //if now common, remove from treasure
    if (tempAction.frequency === CREATURE_ACTION_FREQUENCIES.COMMON) {
      creature.treasures = creature.treasures.filter((t) => t.equipment.ability !== action.name);
    }
    //if new name, update treasure
    else if (action.name !== tempAction.name) {
      creature.treasures
        .filter((t) => t.type === TREASURE_TYPES.EQUIPMENT && t.equipment.ability === action.name)
        .forEach((t) => {
          t.equipment.ability = tempAction.name;
        });
    }

    //update existing and sort
    let actionIndex = creature.actions.findIndex((a) => a.name === action.name);
    creature.actions.splice(actionIndex, 1, tempAction);
    creature.actions = utils.GetArrayOfObjMultisortedByProperties(creature.actions, ["frequency", "name"]);

    setCreature({ ...creature });
    setModal(null);
  }

  function DeleteAction(action) {
    creature.treasures = creature.treasures.filter((t) => t.equipment.ability !== action.name);

    creature.actions = creature.actions.filter((a) => a.name !== action.name);
    setCreature({ ...creature });
  }

  function AddReaction() {
    if (!reActionTemplate) {
      OpenModalManageReaction();
    } else {
      HandleCloseModalManageReaction(null, GetActionFromTemplate(reActionTemplate, creature.rarity, creature.size, true));
      setReactionTemplate(null);
    }
  }
  function OpenModalManageReaction(reaction, index) {
    let invalidNames = creature.reactions.map((a) => a.name);
    if (index != null) {
      invalidNames = invalidNames.filter((n) => n !== reaction?.name);
    }

    setModal(
      <ModalManageReaction
        level={creature.rarity === CREATURE_RARITIES.LEGENDARY ? GetRarity(creature.rarity).baseOutputMin : GetAverageLevel(creature.rarity)}
        reaction={reaction}
        invalidNames={invalidNames}
        weakSpots={creature.weakSpots}
        onClose={(tempReaction) => HandleCloseModalManageReaction(reaction, tempReaction, index)}
      />
    );
  }
  function HandleCloseModalManageReaction(reaction, tempReaction, index) {
    //if cancel, leave
    if (!tempReaction) {
      setModal(null);
      return;
    }

    //if new, add and sort
    if (!reaction || index == null) {
      creature.reactions.push(tempReaction);
      creature.reactions = utils.GetArrayOfObjMultisortedByProperties(creature.reactions, ["frequency", "name"]);
      setCreature({ ...creature });
      setModal(null);
      return;
    }

    //update existing and sort
    let reactionIndex = creature.reactions.findIndex((a) => a.name === reaction.name);
    creature.reactions.splice(reactionIndex, 1, tempReaction);
    creature.reactions = utils.GetArrayOfObjMultisortedByProperties(creature.reactions, ["frequency", "name"]);

    setCreature({ ...creature });
    setModal(null);
  }
  function DeleteReaction(reaction) {
    creature.reactions = creature.reactions.filter((r) => r.name !== reaction.name);
    setCreature({ ...creature });
  }

  function OpenModalManageAura() {
    setModal(
      <ModalManageAura
        level={creature.rarity === CREATURE_RARITIES.LEGENDARY ? GetRarity(creature.rarity).baseOutputMin : GetAverageLevel(creature.rarity)}
        aura={creature.aura}
        weakSpots={creature.weakSpots}
        onClose={(newAura) => HandleCloseModalManageAura(newAura)}
      />
    );
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
          <div className="df df-cg-5">
            <Button icon="fas fa-plus" onClick={AddAction} isDisabled={creature.actions.length >= maxNumberOfActions} />
            <Select
              extraWidth={120}
              value={actionTemplate}
              nothingSelected="Personalizado"
              onSelect={setActionTemplate}
              options={actionTemplates.filter((t) => !creature.actions.some((a) => a.name === t.display))}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
          </div>
          <div className="actions-wrapper">
            {creature.actions.length > 0 ? (
              creature.actions.map((action, i) => (
                <div className="creature-action" key={action.name}>
                  <span>{action.name}</span>
                  <div className="df df-cg-25">
                    <span>{creatureActionFrequencies.find((af) => af.value === action.frequency).display}</span>
                    <div className="df df-cg-10">
                      <button onClick={() => OpenModalManageAction(action, i)} className="edit-row" title="Editar">
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                      <button onClick={() => OpenModalManageAction(utils.clone(action))} className="edit-row" title="Copiar">
                        <i className="fas fa-copy"></i>
                      </button>
                      <button
                        onClick={() => OpenModalManageReaction({ ...utils.clone(action), repetitions: null })}
                        className="edit-row"
                        title="Criar reaçao"
                      >
                        <i className="fas fa-arrow-right"></i>
                      </button>
                      <button onClick={() => DeleteAction(action)} className="edit-row" title="Deletar">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <span className="no-common-actions">Pelo menos uma ação comum é necessária</span>
            )}
          </div>
        </div>
        <div className="reactions">
          <h2>Reações</h2>
          <div className="reactions-options-wrapper">
            <div className="df df-cg-5">
              <Button icon="fas fa-plus" onClick={AddReaction} isDisabled={creature.reactions.length >= maxNumberOfActions} />
              <Select
                extraWidth={120}
                value={reActionTemplate}
                nothingSelected="Personalizado"
                onSelect={setReactionTemplate}
                options={actionTemplates.filter((t) => !creature.reactions.some((r) => r.name === t.display))}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
              />
            </div>
            <Select
              label={"Reações / Rodada"}
              extraWidth={90}
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
            {creature.reactions.map((reaction, i) => (
              <div className="creature-action" key={reaction.name}>
                <span>{reaction.name}</span>
                <div className="df df-cg-25">
                  <span>{creatureActionFrequencies.find((af) => af.value === reaction.frequency).display}</span>
                  <div className="df df-cg-10">
                    <button onClick={() => OpenModalManageReaction(reaction, i)} className="edit-row" title="Editar">
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button onClick={() => OpenModalManageReaction(reaction)} className="edit-row" title="Copiar">
                      <i className="fas fa-copy"></i>
                    </button>
                    <button onClick={() => DeleteReaction(reaction)} className="edit-row" title="Deletar">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
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
              <div className="df df-cg-25">
                <span>{creatureAuraReaches.find((ar) => ar.value === creature.aura.reach).display}</span>
                <div className="df df-cg-10">
                  <button onClick={() => OpenModalManageAura()} className="edit-row">
                    <i className="fas fa-pencil-alt"></i>
                  </button>
                  <button onClick={() => DeleteAura()} className="edit-row">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Actions;
