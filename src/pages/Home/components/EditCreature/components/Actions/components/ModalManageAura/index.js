import React, { useState } from "react";

import * as utils from "../../../../../../../../utils";
import {
  CREATURE_ACTION_TYPES,
  creatureActionTypes,
  CREATURE_AURA_REACHES,
  creatureAuraReaches,
  damageIntensities,
  damageTypes,
  conditions,
  conditionDurations,
  difficultyClasses,
} from "../../../../../../../../data/creatureConstants";

import Button from "../../../../../../../../components/Button";
import TextInput from "../../../../../../../../components/TextInput";
import Select from "../../../../../../../../components/Select";
import Modal from "../../../../../../../../components/Modal";

import "./styles.css";

function ModalManageAura({ aura, weakSpots, onClose }) {
  const [tempAction, setTempAction] = useState(
    aura
      ? utils.clone(aura)
      : {
          name: null,
          description: null,
          type: CREATURE_ACTION_TYPES.SAVING_THROW,
          reach: CREATURE_AURA_REACHES.MEDIUM,
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
    <div className="ModalManageAura-container">
      <Modal title="Aura" className="modal-action">
        <div className="new-action-wrapper">
          <section className="action-row">
            <TextInput label="Nome" value={tempAction} valuePropertyPath="name" onChange={setTempAction} className="longer-input" />
            <Select
              label={"Tipo"}
              extraWidth={100}
              isLarge={true}
              value={tempAction}
              valuePropertyPath="type"
              onSelect={HandleSelectType}
              options={creatureActionTypes.filter((t) => t.value !== CREATURE_ACTION_TYPES.ATTACK)}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
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
                  options={creatureAuraReaches}
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
              <div></div>
              {/* <span>Ação com poder X/X</span> */}
              <aside>
                <button className="button-simple" onClick={HandleCancel}>
                  Cancelar
                </button>
                <Button text="Salvar" onClick={HandleConfirm} isDisabled={!tempAction.name || !tempAction.reach} />
              </aside>
            </div>
          </footer>
        </div>
      </Modal>
    </div>
  );
}

export default ModalManageAura;
