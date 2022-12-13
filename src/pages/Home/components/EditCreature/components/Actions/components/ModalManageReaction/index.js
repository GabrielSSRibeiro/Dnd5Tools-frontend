import React, { useState } from "react";

import * as utils from "../../../../../../../../utils";
import {
  CREATURE_ACTION_TYPES,
  creatureActionTypes,
  CREATURE_ACTION_FREQUENCIES,
  creatureActionAttackReaches,
  creatureActionSavingThrowReaches,
  CREATURE_ACTION_ATTACK_REACHES,
  creatureActionHealingReaches,
  creatureActionFrequencies,
  damageIntensities,
  damageTypes,
  conditions,
  conditionDurations,
  difficultyClasses,
  CREATURE_REACTION_TRIGGERS,
  creatureReactionTriggers,
} from "../../../../../../../../data/creatureConstants";

import Button from "../../../../../../../../components/Button";
import TextInput from "../../../../../../../../components/TextInput";
import CheckInput from "../../../../../../../../components/CheckInput";
import Select from "../../../../../../../../components/Select";
import Modal from "../../../../../../../../components/Modal";

import "./styles.css";

function ModalManageReaction({ reaction, invalidNames, weakSpots, onClose }) {
  const [tempReaction, setTempReaction] = useState(
    reaction
      ? utils.clone(reaction)
      : {
          name: null,
          description: null,
          type: CREATURE_ACTION_TYPES.ATTACK,
          reach: CREATURE_ACTION_ATTACK_REACHES.MELEE_CLOSE,
          trigger: CREATURE_REACTION_TRIGGERS.ON_DAMAGE_TAKEN,
          triggerDescription: null,
          frequency: CREATURE_ACTION_FREQUENCIES.COMMON,
          damageIntensity: null,
          damageType: null,
          condition: null,
          conditionDuration: null,
          difficultyClass: null,
          associatedWeakSpot: null,
          isSpell: false,
        }
  );

  function HandleSelectType(updatedValue) {
    updatedValue.reach = null;

    setTempReaction(updatedValue);
  }

  function HandleSelectTrigger(updatedValue) {
    updatedValue.triggerDescription = null;

    setTempReaction(updatedValue);
  }

  function HandleSelectDamageIntensity(updatedValue) {
    if (!updatedValue.damageIntensity) {
      updatedValue.damageType = null;
    }

    setTempReaction(updatedValue);
  }

  function HandleSelectCondition(updatedValue) {
    if (!updatedValue.condition) {
      updatedValue.conditionDuration = null;
    }

    setTempReaction(updatedValue);
  }

  function HandleCancel() {
    onClose();
  }

  function HandleConfirm() {
    onClose(tempReaction);
  }

  return (
    <div className="ModalManageReaction-container">
      <Modal title="Reação" className="modal-action">
        <div className="new-action-wrapper">
          <section className="action-row">
            <TextInput label="Nome" value={tempReaction} valuePropertyPath="name" onChange={setTempReaction} className="longer-input" />
            <Select
              label={"Frequência"}
              info={[{ text: "Corresponde a quantidade de rodadas entre os usos dessa habilidade" }]}
              extraWidth={100}
              isLarge={true}
              value={tempReaction}
              valuePropertyPath="frequency"
              onSelect={setTempReaction}
              options={creatureActionFrequencies}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
            <Select
              label={"Tipo"}
              extraWidth={100}
              isLarge={true}
              value={tempReaction}
              valuePropertyPath="type"
              onSelect={HandleSelectType}
              options={creatureActionTypes}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
          </section>
          <section className="action-row">
            <TextInput
              label="Descrição (Opcional)"
              isMultiLine={true}
              value={tempReaction}
              valuePropertyPath="description"
              onChange={setTempReaction}
              className="longer-input"
            />
            <aside>
              <section className="action-row">
                <Select
                  label={"Alcance"}
                  extraWidth={100}
                  isLarge={true}
                  value={tempReaction}
                  valuePropertyPath="reach"
                  onSelect={setTempReaction}
                  options={
                    tempReaction.type === CREATURE_ACTION_TYPES.ATTACK
                      ? creatureActionAttackReaches
                      : tempReaction.type === CREATURE_ACTION_TYPES.SAVING_THROW
                      ? creatureActionSavingThrowReaches
                      : creatureActionHealingReaches
                  }
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                />
              </section>
              <section className="action-row">
                <Select
                  label={"Gatilho"}
                  extraWidth={100}
                  isLarge={true}
                  value={tempReaction}
                  valuePropertyPath="trigger"
                  onSelect={HandleSelectTrigger}
                  options={creatureReactionTriggers}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                />
                {tempReaction.trigger === CREATURE_ACTION_TYPES.OTHER && (
                  <TextInput
                    label="Descrição (Gatilho)"
                    value={tempReaction}
                    valuePropertyPath="triggerDescription"
                    onChange={setTempReaction}
                    className="shorter-input"
                  />
                )}
              </section>
            </aside>
          </section>
          <section className="action-row">
            <Select
              label={"Intensidade"}
              extraWidth={100}
              isLarge={true}
              nothingSelected="Nenhuma"
              value={tempReaction}
              valuePropertyPath="damageIntensity"
              onSelect={HandleSelectDamageIntensity}
              options={damageIntensities}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
            <Select
              label={"Tipo de Dano"}
              extraWidth={100}
              isLarge={true}
              value={tempReaction}
              valuePropertyPath="damageType"
              onSelect={setTempReaction}
              options={damageTypes}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              optionsAtATime={4}
              isDisabled={!tempReaction.damageIntensity}
            />
            <Select
              label={"Dificuldade"}
              extraWidth={100}
              isLarge={true}
              nothingSelected="Nenhuma"
              value={tempReaction}
              valuePropertyPath="difficultyClass"
              onSelect={setTempReaction}
              options={difficultyClasses}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
            <Select
              label={"Condição "}
              extraWidth={100}
              isLarge={true}
              nothingSelected="Nenhuma"
              value={tempReaction}
              valuePropertyPath="condition"
              onSelect={HandleSelectCondition}
              options={conditions}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              optionsAtATime={4}
            />
            <Select
              label={"Duração"}
              extraWidth={100}
              isLarge={true}
              value={tempReaction}
              valuePropertyPath="conditionDuration"
              onSelect={setTempReaction}
              options={conditionDurations}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              isDisabled={!tempReaction.condition}
            />
          </section>
          <footer>
            <Select
              label={"Ponto Fraco associado"}
              extraWidth={100}
              isLarge={true}
              nothingSelected="Nenhum"
              value={tempReaction}
              valuePropertyPath="associatedWeakSpot"
              onSelect={setTempReaction}
              options={weakSpots}
              dropUp={true}
            />
            <div className="extra-details">
              <CheckInput
                label="Magia"
                info={[
                  { text: "Efeitos relacionados a magias afetam essa ação" },
                  { text: "Magias não podem ser selecionadas como efeito para possível recompensa" },
                ]}
                onClick={() => setTempReaction({ ...tempReaction, isSpell: !tempReaction.isSpell })}
                isSelected={tempReaction.isSpell}
              />
              {/* <span>Ação com poder X/X</span> */}
              <aside>
                <button className="button-simple" onClick={HandleCancel}>
                  Cancelar
                </button>
                <Button
                  text="Salvar"
                  onClick={HandleConfirm}
                  isDisabled={!tempReaction.name || invalidNames.includes(tempReaction.name) || !tempReaction.reach}
                />
              </aside>
            </div>
          </footer>
        </div>
      </Modal>
    </div>
  );
}

export default ModalManageReaction;
