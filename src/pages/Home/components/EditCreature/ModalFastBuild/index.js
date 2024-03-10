import React, { useState } from "react";

import * as utils from "../../../../../utils";
import Select from "../../../../../components/Select";
import CheckInput from "../../../../../components/CheckInput";
import Button from "../../../../../components/Button";
import Modal from "../../../../../components/Modal";

import {
  CREATURE_RARITIES,
  CREATURE_SIZES,
  creatureRarities,
  creatureSizes,
  creatureTypes,
  CREATURE_MOVEMENTS,
  CREATURE_ACTION_TYPES,
  CREATURE_ACTION_ATTACK_REACHES,
  CREATURE_ACTION_FREQUENCIES,
  DAMAGE_INTENSITIES,
  DAMAGE_TYPES,
  CREATURE_ACTION_REPETITIONS,
  CREATURE_ARMOR_CLASSES,
} from "../../../../../constants/creatureConstants";

import "./styles.css";

function ModalFastBuild({ creature, onClose }) {
  const [tempCreature, setTempCreature] = useState(utils.clone(creature));
  const [hasMeleeAction, setHasMeleeAction] = useState(true);
  const [hasRangedAction, setHasRangedAction] = useState(true);

  const ACTION_DETAILS = [
    {
      rarity: CREATURE_RARITIES.COMMON,
      repetitions: CREATURE_ACTION_REPETITIONS.NORMAL,
      armorClass: CREATURE_ARMOR_CLASSES.LOW,
    },
    {
      rarity: CREATURE_RARITIES.UNCOMMON,
      repetitions: CREATURE_ACTION_REPETITIONS.MULTIACTION_COMMOM,
      armorClass: CREATURE_ARMOR_CLASSES.MEDIUM,
    },
    {
      rarity: CREATURE_RARITIES.RARE,
      repetitions: CREATURE_ACTION_REPETITIONS.MULTIACTION_COMMOM,
      armorClass: CREATURE_ARMOR_CLASSES.MEDIUM,
    },
    {
      rarity: CREATURE_RARITIES.VERY_RARE,
      repetitions: CREATURE_ACTION_REPETITIONS.MULTIACTION_EXTRA,
      armorClass: CREATURE_ARMOR_CLASSES.HIGH,
    },
    {
      rarity: CREATURE_RARITIES.LEGENDARY,
      repetitions: CREATURE_ACTION_REPETITIONS.MULTIACTION_EXTREME,
      armorClass: CREATURE_ARMOR_CLASSES.EXTREME,
    },
  ];

  const SIZE_DETAILS = [
    {
      size: CREATURE_SIZES.TINY,
      speed: CREATURE_MOVEMENTS.LOW,
      melee: CREATURE_ACTION_ATTACK_REACHES.MELEE_CLOSE,
      ranged: CREATURE_ACTION_ATTACK_REACHES.RANGED_CLOSE,
    },
    {
      size: CREATURE_SIZES.SMALL,
      speed: CREATURE_MOVEMENTS.MEDIUM,
      melee: CREATURE_ACTION_ATTACK_REACHES.MELEE_CLOSE,
      ranged: CREATURE_ACTION_ATTACK_REACHES.RANGED_CLOSE,
    },
    {
      size: CREATURE_SIZES.MEDIUM,
      speed: CREATURE_MOVEMENTS.MEDIUM,
      melee: CREATURE_ACTION_ATTACK_REACHES.MELEE_CLOSE,
      ranged: CREATURE_ACTION_ATTACK_REACHES.RANGED_CLOSE,
    },
    {
      size: CREATURE_SIZES.LARGE,
      speed: CREATURE_MOVEMENTS.HIGH,
      melee: CREATURE_ACTION_ATTACK_REACHES.MELEE_EXTRA,
      ranged: CREATURE_ACTION_ATTACK_REACHES.RANGED_EXTRA,
    },
    {
      size: CREATURE_SIZES.HUGE,
      speed: CREATURE_MOVEMENTS.HIGH,
      melee: CREATURE_ACTION_ATTACK_REACHES.MELEE_EXTRA,
      ranged: CREATURE_ACTION_ATTACK_REACHES.RANGED_EXTRA,
    },
    {
      size: CREATURE_SIZES.GARGANTUAN,
      speed: CREATURE_MOVEMENTS.EXTREME,
      melee: CREATURE_ACTION_ATTACK_REACHES.MELEE_FAR,
      ranged: CREATURE_ACTION_ATTACK_REACHES.RANGED_FAR,
    },
  ];

  function HandleCancel() {
    onClose();
  }

  function CheckFinalButtonValid() {
    if (!tempCreature.rarity || !tempCreature.size || !tempCreature.type || (!hasMeleeAction && !hasRangedAction)) {
      return false;
    }

    return true;
  }

  function HandleConfirm() {
    const actionDetailsIndex = ACTION_DETAILS.findIndex((r) => r.rarity === tempCreature.rarity);
    const sizeDetails = SIZE_DETAILS.find((r) => r.size === tempCreature.size);
    tempCreature.armorClass = ACTION_DETAILS[Math.floor(actionDetailsIndex)].armorClass;
    tempCreature.movements.speed = sizeDetails.speed;

    if (hasMeleeAction) {
      if (actionDetailsIndex === 0) {
        tempCreature.actions.push({
          name: "Ataque próximo rápido",
          description: null,
          type: CREATURE_ACTION_TYPES.ATTACK,
          reach: sizeDetails.melee,
          frequency: CREATURE_ACTION_FREQUENCIES.UNCOMMON,
          damageIntensity: DAMAGE_INTENSITIES.LOW,
          damageType: DAMAGE_TYPES.SLASHING,
          condition: null,
          conditionDuration: null,
          difficultyClass: null,
          savingThrowAttribute: null,
          associatedWeakSpot: null,
          isSpell: false,
          repetitions: ACTION_DETAILS[actionDetailsIndex + 1].repetitions,
        });
      }

      tempCreature.actions.push({
        name: "Ataque próximo",
        description: null,
        type: CREATURE_ACTION_TYPES.ATTACK,
        reach: sizeDetails.melee,
        frequency: CREATURE_ACTION_FREQUENCIES.COMMON,
        damageIntensity: DAMAGE_INTENSITIES.MEDIUM,
        damageType: DAMAGE_TYPES.SLASHING,
        condition: null,
        conditionDuration: null,
        difficultyClass: null,
        savingThrowAttribute: null,
        associatedWeakSpot: null,
        isSpell: false,
        repetitions: ACTION_DETAILS[actionDetailsIndex].repetitions,
      });

      tempCreature.actions.push({
        name: "Ataque próximo pesado",
        description: null,
        type: CREATURE_ACTION_TYPES.ATTACK,
        reach: sizeDetails.melee,
        frequency: CREATURE_ACTION_FREQUENCIES.RARE,
        damageIntensity: DAMAGE_INTENSITIES.HIGH,
        damageType: DAMAGE_TYPES.SLASHING,
        condition: null,
        conditionDuration: null,
        difficultyClass: null,
        savingThrowAttribute: null,
        associatedWeakSpot: null,
        isSpell: false,
        repetitions: ACTION_DETAILS[Math.floor(actionDetailsIndex / 2)].repetitions,
      });
    }

    if (hasRangedAction) {
      if (actionDetailsIndex === 0) {
        tempCreature.actions.push({
          name: "Ataque a distância rápido",
          description: null,
          type: CREATURE_ACTION_TYPES.ATTACK,
          reach: sizeDetails.ranged,
          frequency: CREATURE_ACTION_FREQUENCIES.UNCOMMON,
          damageIntensity: DAMAGE_INTENSITIES.LOW,
          damageType: DAMAGE_TYPES.PIERCING,
          condition: null,
          conditionDuration: null,
          difficultyClass: null,
          savingThrowAttribute: null,
          associatedWeakSpot: null,
          isSpell: false,
          repetitions: ACTION_DETAILS[actionDetailsIndex + 1].repetitions,
        });
      }

      tempCreature.actions.push({
        name: "Ataque a distância",
        description: null,
        type: CREATURE_ACTION_TYPES.ATTACK,
        reach: sizeDetails.ranged,
        frequency: CREATURE_ACTION_FREQUENCIES.COMMON,
        damageIntensity: DAMAGE_INTENSITIES.MEDIUM,
        damageType: DAMAGE_TYPES.PIERCING,
        condition: null,
        conditionDuration: null,
        difficultyClass: null,
        savingThrowAttribute: null,
        associatedWeakSpot: null,
        isSpell: false,
        repetitions: ACTION_DETAILS[actionDetailsIndex].repetitions,
      });

      tempCreature.actions.push({
        name: "Ataque a distância pesado",
        description: null,
        type: CREATURE_ACTION_TYPES.ATTACK,
        reach: sizeDetails.ranged,
        frequency: CREATURE_ACTION_FREQUENCIES.RARE,
        damageIntensity: DAMAGE_INTENSITIES.HIGH,
        damageType: DAMAGE_TYPES.PIERCING,
        condition: null,
        conditionDuration: null,
        difficultyClass: null,
        savingThrowAttribute: null,
        associatedWeakSpot: null,
        isSpell: false,
        repetitions: ACTION_DETAILS[Math.floor(actionDetailsIndex / 2)].repetitions,
      });
    }

    onClose(tempCreature);
  }

  return (
    <Modal className="ModalFastBuild-container" title="Descrição" onClickToClose={onClose}>
      <div className="definitions">
        <Select
          label={"Raridade"}
          extraWidth={150}
          value={tempCreature}
          valuePropertyPath="rarity"
          onSelect={setTempCreature}
          options={creatureRarities}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Tamanho"}
          optionsAtATime={6}
          extraWidth={100}
          value={tempCreature}
          valuePropertyPath="size"
          onSelect={setTempCreature}
          options={creatureSizes}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Tipo"}
          optionsAtATime={10}
          extraWidth={100}
          value={tempCreature}
          valuePropertyPath="type"
          onSelect={setTempCreature}
          options={creatureTypes}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
      </div>
      <div className="actions">
        <CheckInput label="Tem Ataques Corco a Corpo" onClick={() => setHasMeleeAction(!hasMeleeAction)} isSelected={hasMeleeAction} />
        <CheckInput label="Tem Ataques a Distância" onClick={() => setHasRangedAction(!hasRangedAction)} isSelected={hasRangedAction} />
      </div>
      <footer>
        <button className="button-simple" onClick={HandleCancel}>
          Cancelar
        </button>
        <Button text="Salvar" onClick={HandleConfirm} isDisabled={!CheckFinalButtonValid()} />
      </footer>
    </Modal>
  );
}

export default ModalFastBuild;
