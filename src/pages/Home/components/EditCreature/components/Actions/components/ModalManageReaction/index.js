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
  CREATURE_REACTION_TRIGGERS,
  creatureReactionTriggers,
} from "../../../../../../../../constants/creatureConstants";
import { GetActionDamangeAndConditionString } from "../../../../../../../../helpers/combatHelper";
import { GetActionReachValue } from "../../../../../../../../helpers/creatureHelper";

import Button from "../../../../../../../../components/Button";
import TextInput from "../../../../../../../../components/TextInput";
import CheckInput from "../../../../../../../../components/CheckInput";
import Select from "../../../../../../../../components/Select";
import Modal from "../../../../../../../../components/Modal";

import "./styles.css";

function ModalManageReaction({ level, reaction, invalidNames, weakSpots, onClose }) {
  const [tempReaction, setTempReaction] = useState(
    reaction
      ? utils.clone(reaction)
      : {
          name: null,
          description: null,
          type: CREATURE_ACTION_TYPES.ATTACK,
          creatureActionPowerTotalPercentage: null,
          reach: CREATURE_ACTION_ATTACK_REACHES.MELEE_CLOSE,
          trigger: CREATURE_REACTION_TRIGGERS.ON_DAMAGE_TAKEN,
          triggerDescription: null,
          frequency: CREATURE_ACTION_FREQUENCIES.COMMON,
          damageIntensity: null,
          damageType: null,
          condition: null,
          conditionDuration: null,
          difficultyClass: null,
          savingThrowAttribute: null,
          associatedWeakSpot: null,
          isSpell: false,
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

  function CheckFinalButtonValid() {
    if (!tempReaction.name || invalidNames.includes(tempReaction.name) || !tempReaction.reach || !tempReaction.trigger) {
      return false;
    }

    if (tempReaction.type === CREATURE_ACTION_TYPES.ATTACK && tempReaction.difficultyClass && !tempReaction.condition) {
      return false;
    }

    if (tempReaction.type === CREATURE_ACTION_TYPES.EFFECT) {
      if (!tempReaction.creatureActionPowerTotalPercentage || !tempReaction.description) {
        return false;
      }
    } else {
      if (!tempReaction.damageIntensity && !tempReaction.difficultyClass) {
        return false;
      }
    }

    if (tempReaction.type === CREATURE_ACTION_TYPES.SAVING_THROW && !tempReaction.difficultyClass) {
      return false;
    }

    if (tempReaction.type === CREATURE_ACTION_TYPES.HEALING) {
      if (!tempReaction.damageIntensity) {
        return false;
      }
    } else {
      if (tempReaction.damageIntensity && !tempReaction.damageType) {
        return false;
      }
    }

    if (tempReaction.difficultyClass && !tempReaction.savingThrowAttribute) {
      return false;
    }

    if (tempReaction.difficultyClass && !tempReaction.damageIntensity && !tempReaction.condition) {
      return false;
    }

    if (tempReaction.trigger === CREATURE_REACTION_TRIGGERS.OTHER && !tempReaction.triggerDescription) {
      return false;
    }

    return true;
  }

  return (
    <div className="ModalManageReaction-container">
      <Modal title="Reação" className="modal-action">
        <div className="new-action-wrapper">
          <section className="action-row">
            <TextInput label="Nome" value={tempReaction} valuePropertyPath="name" onChange={setTempReaction} className="longer-input" />
            <Select
              label={"Tipo"}
              info={[{ text: "Efeito é uma ação que, por exemplo afete a própria criatura a concedendo um benefício" }]}
              extraWidth={100}
              isLarge={true}
              value={tempReaction}
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
              value={tempReaction}
              valuePropertyPath="damageIntensity"
              onSelect={HandleSelectDamageIntensity}
              options={damageIntensities}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              className={tempReaction.type === CREATURE_ACTION_TYPES.EFFECT ? "invisible" : ""}
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
              className={
                !tempReaction.damageIntensity ||
                tempReaction.type === CREATURE_ACTION_TYPES.EFFECT ||
                tempReaction.type === CREATURE_ACTION_TYPES.HEALING
                  ? "invisible"
                  : ""
              }
            />
          </section>
          <section className="action-row">
            <TextInput
              label="Descrição"
              isMultiLine={true}
              value={tempReaction}
              valuePropertyPath="description"
              onChange={setTempReaction}
              className="longer-input"
            />
            <aside>
              <section className="action-row">
                <Select
                  label={"Multiplicador (Efeito)"}
                  info={[{ text: "Porcetagem que esse efeito representa de uma açao com Poder Total" }]}
                  extraWidth={100}
                  isLarge={true}
                  value={tempReaction}
                  valuePropertyPath="creatureActionPowerTotalPercentage"
                  onSelect={setTempReaction}
                  options={creatureActionPowerTotalPercentages}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                  className={tempReaction.type !== CREATURE_ACTION_TYPES.EFFECT ? "invisible" : ""}
                />
                <Select
                  label={"Classe de Dificuldade (CD)"}
                  extraWidth={100}
                  isLarge={true}
                  nothingSelected="Nenhuma"
                  value={tempReaction}
                  valuePropertyPath="difficultyClass"
                  onSelect={setTempReaction}
                  options={difficultyClasses}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                  className={
                    tempReaction.type === CREATURE_ACTION_TYPES.EFFECT || tempReaction.type === CREATURE_ACTION_TYPES.HEALING ? "invisible" : ""
                  }
                />
                <Select
                  label={"Atributo"}
                  extraWidth={100}
                  isLarge={true}
                  value={tempReaction}
                  valuePropertyPath="savingThrowAttribute"
                  onSelect={setTempReaction}
                  options={creatureAttributeNames}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                  className={!tempReaction.difficultyClass ? "invisible" : ""}
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
                <Select
                  label={"Condição"}
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
                  className={
                    tempReaction.type === CREATURE_ACTION_TYPES.EFFECT || tempReaction.type === CREATURE_ACTION_TYPES.HEALING ? "invisible" : ""
                  }
                />
                <Select
                  label={"Duração"}
                  extraWidth={100}
                  isLarge={true}
                  value={tempReaction}
                  valuePropertyPath="conditionDuration"
                  onSelect={setTempReaction}
                  options={conditionDurations}
                  nothingSelected="Nenhuma"
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                  className={
                    !tempReaction.condition ||
                    tempReaction.type === CREATURE_ACTION_TYPES.EFFECT ||
                    tempReaction.type === CREATURE_ACTION_TYPES.HEALING
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
              value={tempReaction}
              valuePropertyPath="frequency"
              onSelect={setTempReaction}
              options={creatureActionFrequencies}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
            <Select
              label={"Alcance"}
              extraWidth={100}
              isLarge={true}
              value={tempReaction}
              valuePropertyPath="reach"
              onSelect={setTempReaction}
              options={creatureActionTypes.find((t) => t.value === tempReaction.type).reaches}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              optionsAtATime={4}
            />
            <TextInput
              label="Descrição (Gatilho)"
              value={tempReaction}
              valuePropertyPath="triggerDescription"
              onChange={setTempReaction}
              className={`shorter-input${tempReaction.trigger !== CREATURE_REACTION_TRIGGERS.OTHER ? " invisible" : ""}`}
            />
            <CheckInput
              label="Origem Mágica"
              info={[
                { text: "Essa ação é equivalente a uma magia com componentes(V,S) e nível proporcional a raridade da criatura" },
                { text: "" },
                { text: "Efeitos relacionados/que interagem com magias afetam essa ação" },
              ]}
              onClick={() => setTempReaction({ ...tempReaction, isSpell: !tempReaction.isSpell })}
              isSelected={tempReaction.isSpell}
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
              value={tempReaction}
              valuePropertyPath="associatedWeakSpot"
              onSelect={setTempReaction}
              options={weakSpots}
              dropUp={true}
              isDisabled={weakSpots.length === 0}
            />
            <div className="extra-details">
              <span className="action-preview">
                {CheckFinalButtonValid()
                  ? GetActionReachValue(tempReaction.reach, tempReaction.type) + GetActionDamangeAndConditionString(tempReaction, level)
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

export default ModalManageReaction;
