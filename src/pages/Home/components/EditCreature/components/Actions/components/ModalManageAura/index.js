import React, { useState } from "react";

import * as utils from "../../../../../../../../utils";
import {
  CREATURE_ACTION_TYPES,
  creatureActionTypes,
  creatureActionPowerTotalPercentages,
  CREATURE_AURA_REACHES,
  creatureAuraReaches,
  damageIntensities,
  damageTypes,
  conditions,
  conditionDurations,
  difficultyClasses,
} from "../../../../../../../../constants/creatureConstants";

import Button from "../../../../../../../../components/Button";
import TextInput from "../../../../../../../../components/TextInput";
import Select from "../../../../../../../../components/Select";
import Modal from "../../../../../../../../components/Modal";

import "./styles.css";

function ModalManageAura({ aura, weakSpots, onClose }) {
  const [tempAura, setTempAura] = useState(
    aura
      ? utils.clone(aura)
      : {
          name: null,
          description: null,
          type: CREATURE_ACTION_TYPES.SAVING_THROW,
          creatureActionPowerTotalPercentage: null,
          reach: CREATURE_AURA_REACHES.MEDIUM,
          damageIntensity: null,
          damageType: null,
          condition: null,
          conditionDuration: null,
          difficultyClass: null,
          associatedWeakSpot: null,
        }
  );

  function HandleSelectType(updatedValue) {
    updatedValue.reach = null;

    if (updatedValue.type === CREATURE_ACTION_TYPES.EFFECT) {
      updatedValue.damageIntensity = null;
      updatedValue.damageType = null;
      updatedValue.condition = null;
      updatedValue.conditionDuration = null;
      updatedValue.difficultyClass = null;
    } else {
      updatedValue.effectPowerTotalPercentage = null;
    }

    setTempAura(updatedValue);
  }

  function HandleSelectDamageIntensity(updatedValue) {
    if (!updatedValue.damageIntensity) {
      updatedValue.damageType = null;
    }

    setTempAura(updatedValue);
  }

  function HandleSelectCondition(updatedValue) {
    if (!updatedValue.condition) {
      updatedValue.conditionDuration = null;
    }

    setTempAura(updatedValue);
  }

  function HandleCancel() {
    onClose();
  }

  function HandleConfirm() {
    onClose(tempAura);
  }

  function CheckFinalButtonValid() {
    if (!tempAura.name || !tempAura.reach) {
      return false;
    }

    if (tempAura.type === CREATURE_ACTION_TYPES.EFFECT && !tempAura.creatureActionPowerTotalPercentage) {
      return false;
    }

    if (tempAura.damageIntensity && !tempAura.damageType) {
      return false;
    }

    return true;
  }

  return (
    <div className="ModalManageAura-container">
      <Modal title="Aura" className="modal-action">
        <div className="new-action-wrapper">
          <section className="action-row">
            <TextInput label="Nome" value={tempAura} valuePropertyPath="name" onChange={setTempAura} className="longer-input" />
            <Select
              label={"Tipo"}
              info={[{ text: "Efeito é uma ação que, por exemplo afete a própria criatura a concedendo um benefício" }]}
              extraWidth={100}
              isLarge={true}
              value={tempAura}
              valuePropertyPath="type"
              onSelect={HandleSelectType}
              options={creatureActionTypes.filter((t) => t.value !== CREATURE_ACTION_TYPES.ATTACK)}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
            {tempAura.type === CREATURE_ACTION_TYPES.EFFECT && (
              <Select
                label={"Multiplicador (Efeito)"}
                info={[{ text: "Porcetagem do Poder Total da ação que esse Efeito representa" }]}
                extraWidth={100}
                isLarge={true}
                value={tempAura}
                valuePropertyPath="creatureActionPowerTotalPercentage"
                onSelect={setTempAura}
                options={creatureActionPowerTotalPercentages}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
              />
            )}
          </section>
          <section className="action-row">
            <TextInput
              label="Descrição (Opcional)"
              isMultiLine={true}
              value={tempAura}
              valuePropertyPath="description"
              onChange={setTempAura}
              className="longer-input"
            />
            <aside>
              <section className="action-row">
                <Select
                  label={"Alcance"}
                  extraWidth={100}
                  isLarge={true}
                  value={tempAura}
                  valuePropertyPath="reach"
                  onSelect={setTempAura}
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
              value={tempAura}
              valuePropertyPath="damageIntensity"
              onSelect={HandleSelectDamageIntensity}
              options={damageIntensities}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              optionsAtATime={4}
              isDisabled={tempAura.type === CREATURE_ACTION_TYPES.EFFECT}
            />
            <Select
              label={"Tipo de Dano"}
              extraWidth={100}
              isLarge={true}
              value={tempAura}
              valuePropertyPath="damageType"
              onSelect={setTempAura}
              options={damageTypes}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              optionsAtATime={4}
              isDisabled={!tempAura.damageIntensity || tempAura.type === CREATURE_ACTION_TYPES.EFFECT}
            />
            <Select
              label={"Dificuldade"}
              extraWidth={100}
              isLarge={true}
              nothingSelected="Nenhuma"
              value={tempAura}
              valuePropertyPath="difficultyClass"
              onSelect={setTempAura}
              options={difficultyClasses}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              optionsAtATime={4}
              isDisabled={tempAura.type === CREATURE_ACTION_TYPES.EFFECT}
            />
            <Select
              label={"Condição"}
              extraWidth={100}
              isLarge={true}
              nothingSelected="Nenhuma"
              value={tempAura}
              valuePropertyPath="condition"
              onSelect={HandleSelectCondition}
              options={conditions}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              optionsAtATime={4}
              isDisabled={tempAura.type === CREATURE_ACTION_TYPES.EFFECT}
            />
            <Select
              label={"Duração"}
              extraWidth={100}
              isLarge={true}
              value={tempAura}
              valuePropertyPath="conditionDuration"
              onSelect={setTempAura}
              options={conditionDurations}
              nothingSelected="Nenhuma"
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              optionsAtATime={4}
              isDisabled={!tempAura.condition || tempAura.type === CREATURE_ACTION_TYPES.EFFECT}
            />
          </section>
          <footer>
            <Select
              label={"Ponto Fraco associado"}
              extraWidth={100}
              isLarge={true}
              nothingSelected="Nenhum"
              value={tempAura}
              valuePropertyPath="associatedWeakSpot"
              onSelect={setTempAura}
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
                <Button text="Salvar" onClick={HandleConfirm} isDisabled={!CheckFinalButtonValid()} />
              </aside>
            </div>
          </footer>
        </div>
      </Modal>
    </div>
  );
}

export default ModalManageAura;
