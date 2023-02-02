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
  creatureAttributeNames,
} from "../../../../../../../../constants/creatureConstants";
import { GetActionDamangeAndConditionString } from "../../../../../../../../helpers/combatHelper";
import { GetActionReachValue } from "../../../../../../../../helpers/creatureHelper";

import Button from "../../../../../../../../components/Button";
import TextInput from "../../../../../../../../components/TextInput";
import Select from "../../../../../../../../components/Select";
import Modal from "../../../../../../../../components/Modal";

import "./styles.css";

function ModalManageAura({ level, aura, weakSpots, onClose }) {
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
          savingThrowAttribute: null,
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
      updatedValue.savingThrowAttribute = null;
    } else {
      updatedValue.effectPowerTotalPercentage = null;
    }

    if (updatedValue.type === CREATURE_ACTION_TYPES.HEALING) {
      updatedValue.damageType = null;
      updatedValue.condition = null;
      updatedValue.conditionDuration = null;
      updatedValue.difficultyClass = null;
      updatedValue.savingThrowAttribute = null;
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

    if (tempAura.type === CREATURE_ACTION_TYPES.ATTACK && tempAura.difficultyClass && !tempAura.condition) {
      return false;
    }

    if (tempAura.type === CREATURE_ACTION_TYPES.EFFECT) {
      if (!tempAura.creatureActionPowerTotalPercentage || !tempAura.description) {
        return false;
      }
    } else {
      if (!tempAura.damageIntensity && !tempAura.difficultyClass) {
        return false;
      }
    }

    if (tempAura.type === CREATURE_ACTION_TYPES.SAVING_THROW && !tempAura.difficultyClass) {
      return false;
    }

    if (tempAura.type === CREATURE_ACTION_TYPES.HEALING) {
      if (!tempAura.damageIntensity) {
        return false;
      }
    } else {
      if (tempAura.damageIntensity && !tempAura.damageType) {
        return false;
      }
    }

    if (tempAura.difficultyClass && !tempAura.savingThrowAttribute) {
      return false;
    }

    if (tempAura.difficultyClass && !tempAura.damageIntensity && !tempAura.condition) {
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
            <Select
              label={"Intensidade do Dano"}
              extraWidth={100}
              isLarge={true}
              nothingSelected="Nenhuma"
              value={tempAura}
              valuePropertyPath="damageIntensity"
              onSelect={HandleSelectDamageIntensity}
              options={damageIntensities}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              className={tempAura.type === CREATURE_ACTION_TYPES.EFFECT ? "invisible" : ""}
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
              className={
                !tempAura.damageIntensity || tempAura.type === CREATURE_ACTION_TYPES.EFFECT || tempAura.type === CREATURE_ACTION_TYPES.HEALING
                  ? "invisible"
                  : ""
              }
            />
          </section>
          <section className="action-row">
            <TextInput
              label="Descrição"
              isMultiLine={true}
              value={tempAura}
              valuePropertyPath="description"
              onChange={setTempAura}
              className="longer-input"
            />
            <aside>
              <section className="action-row">
                <Select
                  label={"Multiplicador (Efeito)"}
                  info={[{ text: "Porcetagem que esse efeito representa de uma açao com Poder Total" }]}
                  extraWidth={100}
                  isLarge={true}
                  value={tempAura}
                  valuePropertyPath="creatureActionPowerTotalPercentage"
                  onSelect={setTempAura}
                  options={creatureActionPowerTotalPercentages}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                  className={tempAura.type !== CREATURE_ACTION_TYPES.EFFECT ? "invisible" : ""}
                />
                <Select
                  label={"Classe de Dificuldade (CD)"}
                  extraWidth={100}
                  isLarge={true}
                  nothingSelected="Nenhuma"
                  value={tempAura}
                  valuePropertyPath="difficultyClass"
                  onSelect={setTempAura}
                  options={difficultyClasses}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                  className={tempAura.type === CREATURE_ACTION_TYPES.EFFECT || tempAura.type === CREATURE_ACTION_TYPES.HEALING ? "invisible" : ""}
                />
                <Select
                  label={"Atributo"}
                  extraWidth={100}
                  isLarge={true}
                  nothingSelected="Nenhuma"
                  value={tempAura}
                  valuePropertyPath="savingThrowAttribute"
                  onSelect={setTempAura}
                  options={creatureAttributeNames}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                  className={!tempAura.difficultyClass ? "invisible" : ""}
                />
              </section>
              <section className="action-row">
                <Select label={"Gatilho"} extraWidth={100} isLarge={true} className={"invisible"} />
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
                  className={tempAura.type === CREATURE_ACTION_TYPES.EFFECT || tempAura.type === CREATURE_ACTION_TYPES.HEALING ? "invisible" : ""}
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
                  className={
                    !tempAura.condition || tempAura.type === CREATURE_ACTION_TYPES.EFFECT || tempAura.type === CREATURE_ACTION_TYPES.HEALING
                      ? "invisible"
                      : ""
                  }
                />
              </section>
            </aside>
          </section>
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
              optionsAtATime={4}
            />
          </section>
          <footer>
            <Select
              label={"Ponto Fraco associado"}
              info={[
                {
                  text: "Selecione um dos Pontos Fracos da criatura para associar a essa açao",
                },
                {
                  text: "Uma açao só pode ser realizada se o Ponto Fraco nao foi destruído",
                },
              ]}
              extraWidth={100}
              isLarge={true}
              nothingSelected="Nenhum"
              value={tempAura}
              valuePropertyPath="associatedWeakSpot"
              onSelect={setTempAura}
              options={weakSpots}
              dropUp={true}
              isDisabled={weakSpots.length === 0}
            />
            <div className="extra-details">
              <span className="action-preview">
                {CheckFinalButtonValid()
                  ? GetActionReachValue(tempAura.reach, tempAura.type) + GetActionDamangeAndConditionString(tempAura, level)
                  : ""}
              </span>
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
