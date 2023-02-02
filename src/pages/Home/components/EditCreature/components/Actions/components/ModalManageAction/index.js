import React, { useState } from "react";

import * as utils from "../../../../../../../../utils";
import {
  CREATURE_ACTION_TYPES,
  creatureActionTypes,
  creatureActionPowerTotalPercentages,
  CREATURE_ACTION_FREQUENCIES,
  CREATURE_ACTION_ATTACK_REACHES,
  creatureActionFrequencies,
  damageIntensities,
  damageTypes,
  conditions,
  conditionDurations,
  difficultyClasses,
  creatureAttributeNames,
  CREATURE_ACTION_REPETITIONS,
  creatureActionRepetitions,
} from "../../../../../../../../constants/creatureConstants";
import { GetActionDamangeAndConditionString } from "../../../../../../../../helpers/combatHelper";
import { GetActionReachValue } from "../../../../../../../../helpers/creatureHelper";

import Button from "../../../../../../../../components/Button";
import TextInput from "../../../../../../../../components/TextInput";
import CheckInput from "../../../../../../../../components/CheckInput";
import Select from "../../../../../../../../components/Select";
import Modal from "../../../../../../../../components/Modal";

import "./styles.css";

function ModalManageAction({ level, action, invalidNames, weakSpots, onClose }) {
  const [tempAction, setTempAction] = useState(
    action
      ? utils.clone(action)
      : {
          name: null,
          description: null,
          type: CREATURE_ACTION_TYPES.ATTACK,
          creatureActionPowerTotalPercentage: null,
          reach: CREATURE_ACTION_ATTACK_REACHES.MELEE_CLOSE,
          frequency: CREATURE_ACTION_FREQUENCIES.COMMON,
          damageIntensity: null,
          damageType: null,
          condition: null,
          conditionDuration: null,
          difficultyClass: null,
          savingThrowAttribute: null,
          associatedWeakSpot: null,
          isSpell: false,
          repetitions: CREATURE_ACTION_REPETITIONS.NORMAL,
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
      updatedValue.creatureActionPowerTotalPercentage = null;
    }

    if (updatedValue.type === CREATURE_ACTION_TYPES.HEALING) {
      updatedValue.damageType = null;
      updatedValue.condition = null;
      updatedValue.conditionDuration = null;
      updatedValue.difficultyClass = null;
      updatedValue.savingThrowAttribute = null;
    }

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

  function CheckFinalButtonValid() {
    if (!tempAction.name || invalidNames.includes(tempAction.name) || !tempAction.reach) {
      return false;
    }

    if (tempAction.type === CREATURE_ACTION_TYPES.ATTACK && tempAction.difficultyClass && !tempAction.condition) {
      return false;
    }

    if (tempAction.type === CREATURE_ACTION_TYPES.EFFECT) {
      if (!tempAction.creatureActionPowerTotalPercentage || !tempAction.description) {
        return false;
      }
    } else {
      if (!tempAction.damageIntensity && !tempAction.difficultyClass) {
        return false;
      }
    }

    if (tempAction.type === CREATURE_ACTION_TYPES.SAVING_THROW && !tempAction.difficultyClass) {
      return false;
    }

    if (tempAction.type === CREATURE_ACTION_TYPES.HEALING) {
      if (!tempAction.damageIntensity) {
        return false;
      }
    } else {
      if (tempAction.damageIntensity && !tempAction.damageType) {
        return false;
      }
    }

    if (tempAction.difficultyClass && !tempAction.savingThrowAttribute) {
      return false;
    }

    if (tempAction.difficultyClass && !tempAction.damageIntensity && !tempAction.condition) {
      return false;
    }

    return true;
  }

  return (
    <div className="ModalManageAction-container">
      <Modal title="Ação" className="modal-action">
        <div className="new-action-wrapper">
          <section className="action-row">
            <TextInput label="Nome" value={tempAction} valuePropertyPath="name" onChange={setTempAction} className="longer-input" />
            <Select
              label={"Tipo"}
              info={[{ text: "Efeito é uma ação que, por exemplo afete a própria criatura a concedendo um benefício" }]}
              extraWidth={100}
              isLarge={true}
              value={tempAction}
              valuePropertyPath="type"
              onSelect={HandleSelectType}
              options={creatureActionTypes}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
            <Select
              label={"Intensidade do Dano"}
              extraWidth={100}
              isLarge={true}
              nothingSelected="Nenhuma"
              value={tempAction}
              valuePropertyPath="damageIntensity"
              onSelect={HandleSelectDamageIntensity}
              options={damageIntensities}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              className={tempAction.type === CREATURE_ACTION_TYPES.EFFECT ? "invisible" : ""}
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
              className={
                !tempAction.damageIntensity || tempAction.type === CREATURE_ACTION_TYPES.EFFECT || tempAction.type === CREATURE_ACTION_TYPES.HEALING
                  ? "invisible"
                  : ""
              }
            />
          </section>
          <section className="action-row">
            <TextInput
              label="Descrição"
              isMultiLine={true}
              value={tempAction}
              valuePropertyPath="description"
              onChange={setTempAction}
              className="longer-input"
            />
            <aside>
              <section className="action-row">
                <Select
                  label={"Multiplicador (Efeito)"}
                  info={[{ text: "Porcetagem que esse efeito representa de uma açao com Poder Total" }]}
                  extraWidth={100}
                  isLarge={true}
                  value={tempAction}
                  valuePropertyPath="creatureActionPowerTotalPercentage"
                  onSelect={setTempAction}
                  options={creatureActionPowerTotalPercentages}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                  className={tempAction.type !== CREATURE_ACTION_TYPES.EFFECT ? "invisible" : ""}
                />
                <Select
                  label={"Classe de Dificuldade (CD)"}
                  extraWidth={100}
                  isLarge={true}
                  nothingSelected="Nenhuma"
                  value={tempAction}
                  valuePropertyPath="difficultyClass"
                  onSelect={setTempAction}
                  options={difficultyClasses}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                  className={tempAction.type === CREATURE_ACTION_TYPES.EFFECT || tempAction.type === CREATURE_ACTION_TYPES.HEALING ? "invisible" : ""}
                />
                <Select
                  label={"Atributo"}
                  extraWidth={100}
                  isLarge={true}
                  value={tempAction}
                  valuePropertyPath="savingThrowAttribute"
                  onSelect={setTempAction}
                  options={creatureAttributeNames}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                  className={!tempAction.difficultyClass ? "invisible" : ""}
                />
              </section>
              <section className="action-row">
                <Select
                  label={"Repetições"}
                  info={[{ text: "Recomendado apenas para ações comuns de baixo poder, pois isto aumenta muito o poder da ação" }]}
                  extraWidth={100}
                  isLarge={true}
                  value={tempAction}
                  valuePropertyPath="repetitions"
                  onSelect={setTempAction}
                  options={creatureActionRepetitions}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                  className={tempAction.type === CREATURE_ACTION_TYPES.EFFECT ? "invisible" : ""}
                />
                <Select
                  label={"Condição"}
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
                  className={tempAction.type === CREATURE_ACTION_TYPES.EFFECT || tempAction.type === CREATURE_ACTION_TYPES.HEALING ? "invisible" : ""}
                />
                <Select
                  label={"Duração"}
                  extraWidth={100}
                  isLarge={true}
                  value={tempAction}
                  valuePropertyPath="conditionDuration"
                  onSelect={setTempAction}
                  options={conditionDurations}
                  nothingSelected="Nenhuma"
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                  className={
                    !tempAction.condition || tempAction.type === CREATURE_ACTION_TYPES.EFFECT || tempAction.type === CREATURE_ACTION_TYPES.HEALING
                      ? "invisible"
                      : ""
                  }
                />
              </section>
            </aside>
          </section>
          <section className="action-row">
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
              label={"Alcance"}
              extraWidth={100}
              isLarge={true}
              value={tempAction}
              valuePropertyPath="reach"
              onSelect={setTempAction}
              options={creatureActionTypes.find((t) => t.value === tempAction.type).reaches}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              optionsAtATime={4}
            />
            <CheckInput
              label="Origem Mágica"
              info={[
                { text: "Essa ação é equivalente a uma magia com componentes(V,S) e nível proporcional a raridade da criatura" },
                { text: "" },
                { text: "Efeitos relacionados/que interagem com magias afetam essa ação" },
              ]}
              onClick={() => setTempAction({ ...tempAction, isSpell: !tempAction.isSpell })}
              isSelected={tempAction.isSpell}
              className="row-check-box"
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
              value={tempAction}
              valuePropertyPath="associatedWeakSpot"
              onSelect={setTempAction}
              options={weakSpots}
              dropUp={true}
              isDisabled={weakSpots.length === 0}
            />
            <div className="extra-details">
              <span className="action-preview">
                {CheckFinalButtonValid()
                  ? GetActionReachValue(tempAction.reach, tempAction.type) + GetActionDamangeAndConditionString(tempAction, level)
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

export default ModalManageAction;
