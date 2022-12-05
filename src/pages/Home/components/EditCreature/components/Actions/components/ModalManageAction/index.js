import React, { useState } from "react";

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
} from "../../../../../../../../data/creatureConstants";

import Button from "../../../../../../../../components/Button";
import TextInput from "../../../../../../../../components/TextInput";
import CheckInput from "../../../../../../../../components/CheckInput";
import Select from "../../../../../../../../components/Select";
import Modal from "../../../../../../../../components/Modal";

import "./styles.css";

function ModalManageAction({ action, weakSpots, onClose }) {
  const [tempAction, setTempAction] = useState(
    action ?? {
      name: null,
      description: null,
      type: CREATURE_ACTION_TYPES.ATTACK,
      typeDescription: null,
      reach: CREATURE_ACTION_ATTACK_REACHES.MELEE_CLOSE,
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
    updatedValue.typeDescription = null;

    setTempAction(updatedValue);
  }

  function HandleSelectDamageIntensity(updatedValue) {
    if (!updatedValue.damageIntensity) {
      updatedValue.damageType = null;
    }

    setTempAction(updatedValue);
  }

  function HandleSelectCondition(updatedValue) {
    if (!updatedValue.condition) {
      updatedValue.conditionDuration = null;
    }

    setTempAction(updatedValue);
  }

  function HandleCancel() {
    onClose();
  }

  function HandleConfirm() {
    onClose(tempAction);
  }

  return (
    <div className="ModalManageAction-container">
      <Modal title="Ação" className="modal-action">
        <div className="new-action-wrapper">
          <section className="action-row">
            <TextInput label="Nome" value={tempAction} valuePropertyPath="name" onChange={setTempAction} className="longer-input" />
            <Select
              label={"Frequência"}
              info={[{ text: "Corresponde a quantidade de rodadas entre os usos dessa habilidade" }]}
              extraWidth={100}
              isLarge={true}
              value={tempAction}
              valuePropertyPath="frequency"
              onSelect={setTempAction}
              options={creatureActionFrequencies}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
            <Select
              label={"Tipo"}
              extraWidth={100}
              isLarge={true}
              value={tempAction}
              valuePropertyPath="type"
              onSelect={HandleSelectType}
              options={creatureActionTypes}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
            {tempAction.type === CREATURE_ACTION_TYPES.OTHER && (
              <TextInput
                label="Descrição (Tipo)"
                value={tempAction}
                valuePropertyPath="typeDescription"
                onChange={setTempAction}
                className="shorter-input"
              />
            )}
          </section>
          <section className="action-row">
            <TextInput
              label="Descrição (Opcional)"
              isMultiLine={true}
              value={tempAction}
              valuePropertyPath="description"
              onChange={setTempAction}
              className="longer-input"
            />
            <aside>
              <section className="action-row">
                <Select
                  label={"Alcance"}
                  extraWidth={100}
                  isLarge={true}
                  value={tempAction}
                  valuePropertyPath="reach"
                  onSelect={setTempAction}
                  options={
                    tempAction.type === CREATURE_ACTION_TYPES.ATTACK
                      ? creatureActionAttackReaches
                      : tempAction.type === CREATURE_ACTION_TYPES.SAVING_THROW
                      ? creatureActionSavingThrowReaches
                      : creatureActionHealingReaches
                  }
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                />
              </section>
            </aside>
          </section>
          <section className="action-row">
            <Select
              label={"Intensidade"}
              extraWidth={100}
              isLarge={true}
              nothingSelected="Nenhuma"
              value={tempAction}
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
              value={tempAction}
              valuePropertyPath="damageType"
              onSelect={setTempAction}
              options={damageTypes}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              optionsAtATime={4}
              isDisabled={!tempAction.damageIntensity}
            />
            <Select
              label={"Dificuldade"}
              extraWidth={100}
              isLarge={true}
              nothingSelected="Nenhuma"
              value={tempAction}
              valuePropertyPath="difficultyClass"
              onSelect={setTempAction}
              options={difficultyClasses}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
            <Select
              label={"Condição "}
              extraWidth={100}
              isLarge={true}
              nothingSelected="Nenhuma"
              value={tempAction}
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
              value={tempAction}
              valuePropertyPath="conditionDuration"
              onSelect={setTempAction}
              options={conditionDurations}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              isDisabled={!tempAction.condition}
            />
          </section>
          <footer>
            <Select
              label={"Ponto Fraco associado"}
              extraWidth={100}
              isLarge={true}
              nothingSelected="Nenhum"
              value={tempAction}
              valuePropertyPath="associatedWeakSpot"
              onSelect={setTempAction}
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
                onClick={() => setTempAction({ ...tempAction, isSpell: !tempAction.isSpell })}
                isSelected={tempAction.isSpell}
              />
              {/* <span>Ação com poder X/X</span> */}
              <aside>
                <button className="button-simple" onClick={HandleCancel}>
                  Cancelar
                </button>
                <Button text="Adicionar" onClick={HandleConfirm} isDisabled={!tempAction.name || !tempAction.reach} />
              </aside>
            </div>
          </footer>
        </div>
      </Modal>
    </div>
  );
}

export default ModalManageAction;
