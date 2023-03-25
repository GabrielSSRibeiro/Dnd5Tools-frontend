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
  CREATURE_ACTION_TYPES,
  CREATURE_ACTION_ATTACK_REACHES,
  CREATURE_ACTION_FREQUENCIES,
  DAMAGE_INTENSITIES,
  DAMAGE_TYPES,
  CREATURE_ACTION_REPETITIONS,
} from "../../../../../constants/creatureConstants";

import "./styles.css";

function ModalFastBuild({ creature, onClose }) {
  const [tempCreature, setTempCreature] = useState(utils.clone(creature));
  const [hasMeleeAction, setHasMeleeAction] = useState(false);
  const [hasRangedAction, setHasRangedAction] = useState(false);

  const REPETITIONS = [
    {
      rarity: CREATURE_RARITIES.COMMON,
      value: CREATURE_ACTION_REPETITIONS.NORMAL,
    },
    {
      rarity: CREATURE_RARITIES.UNCOMMON,
      value: CREATURE_ACTION_REPETITIONS.MULTIACTION_COMMOM,
    },
    {
      rarity: CREATURE_RARITIES.RARE,
      value: CREATURE_ACTION_REPETITIONS.MULTIACTION_COMMOM,
    },
    {
      rarity: CREATURE_RARITIES.VERY_RARE,
      value: CREATURE_ACTION_REPETITIONS.MULTIACTION_EXTRA,
    },
    {
      rarity: CREATURE_RARITIES.LEGENDARY,
      value: CREATURE_ACTION_REPETITIONS.MULTIACTION_EXTREME,
    },
  ];

  const REACHES = [
    {
      size: CREATURE_SIZES.TINY,
      melee: CREATURE_ACTION_ATTACK_REACHES.MELEE_CLOSE,
      ranged: CREATURE_ACTION_ATTACK_REACHES.RANGED_CLOSE,
    },
    {
      size: CREATURE_SIZES.SMALL,
      melee: CREATURE_ACTION_ATTACK_REACHES.MELEE_CLOSE,
      ranged: CREATURE_ACTION_ATTACK_REACHES.RANGED_CLOSE,
    },
    {
      size: CREATURE_SIZES.MEDIUM,
      melee: CREATURE_ACTION_ATTACK_REACHES.MELEE_CLOSE,
      ranged: CREATURE_ACTION_ATTACK_REACHES.RANGED_CLOSE,
    },
    {
      size: CREATURE_SIZES.LARGE,
      melee: CREATURE_ACTION_ATTACK_REACHES.MELEE_EXTRA,
      ranged: CREATURE_ACTION_ATTACK_REACHES.RANGED_EXTRA,
    },
    {
      size: CREATURE_SIZES.HUGE,
      melee: CREATURE_ACTION_ATTACK_REACHES.MELEE_EXTRA,
      ranged: CREATURE_ACTION_ATTACK_REACHES.RANGED_EXTRA,
    },
    {
      size: CREATURE_SIZES.GARGANTUAN,
      melee: CREATURE_ACTION_ATTACK_REACHES.MELEE_FAR,
      ranged: CREATURE_ACTION_ATTACK_REACHES.RANGED_FAR,
    },
  ];

  function HandleCancel() {
    onClose();
  }

  function HandleConfirm() {
    const repetitions = REPETITIONS.find((r) => r.rarity === tempCreature.rarity).value;
    const reach = REACHES.find((r) => r.size === tempCreature.size);

    if (hasMeleeAction) {
      tempCreature.actions.push({
        name: "Ataque Corco a Corpo",
        description: null,
        type: CREATURE_ACTION_TYPES.ATTACK,
        reach: reach.melee,
        frequency: CREATURE_ACTION_FREQUENCIES.COMMON,
        damageIntensity: DAMAGE_INTENSITIES.MEDIUM,
        damageType: DAMAGE_TYPES.SLASHING,
        condition: null,
        conditionDuration: null,
        difficultyClass: null,
        savingThrowAttribute: null,
        associatedWeakSpot: null,
        isSpell: false,
        repetitions,
      });
    }

    if (hasRangedAction) {
      tempCreature.actions.push({
        name: "Ataque a Distância",
        description: null,
        type: CREATURE_ACTION_TYPES.ATTACK,
        reach: reach.ranged,
        frequency: CREATURE_ACTION_FREQUENCIES.COMMON,
        damageIntensity: DAMAGE_INTENSITIES.MEDIUM,
        damageType: DAMAGE_TYPES.PIERCING,
        condition: null,
        conditionDuration: null,
        difficultyClass: null,
        savingThrowAttribute: null,
        associatedWeakSpot: null,
        isSpell: false,
        repetitions,
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
        <Button text="Salvar" onClick={HandleConfirm} />
      </footer>
    </Modal>
  );
}

export default ModalFastBuild;
