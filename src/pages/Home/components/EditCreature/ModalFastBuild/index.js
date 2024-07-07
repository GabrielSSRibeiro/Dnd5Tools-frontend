import React, { useState } from "react";

import { SYSTEM_TYPES } from "../../../../../constants/combatConstants";

import * as utils from "../../../../../utils";
import Select from "../../../../../components/Select";
import CheckInput from "../../../../../components/CheckInput";
import Button from "../../../../../components/Button";
import Modal from "../../../../../components/Modal";

import {
  ACTION_TEMPLATES,
  creatureRarities,
  creatureSizes,
  creatureTypes,
  ACTION_DETAILS,
  SIZE_DETAILS,
} from "../../../../../constants/creatureConstants";
import { GetActionFromTemplate } from "../../../../../helpers/creatureHelper";

import "./styles.css";

function ModalFastBuild({ systemType, creature, onClose }) {
  const [tempCreature, setTempCreature] = useState(utils.clone(creature));
  const [hasMeleeAction, setHasMeleeAction] = useState(true);
  const [hasRangedAction, setHasRangedAction] = useState(true);

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
    tempCreature.isDraft = true;
    const actionDetailsIndex = ACTION_DETAILS.findIndex((r) => r.rarity === tempCreature.rarity);
    const sizeDetails = SIZE_DETAILS.find((r) => r.size === tempCreature.size);
    tempCreature.armorClass = ACTION_DETAILS[Math.floor(actionDetailsIndex)].armorClass;
    tempCreature.movements.speed = sizeDetails.speed;

    if (hasMeleeAction) {
      if (actionDetailsIndex === 0) {
        tempCreature.actions.push(GetActionFromTemplate(ACTION_TEMPLATES.MEELE_LIGHT, tempCreature.rarity, tempCreature.size));
      }

      tempCreature.actions.push(GetActionFromTemplate(ACTION_TEMPLATES.MEELE, tempCreature.rarity, tempCreature.size));
      tempCreature.actions.push(GetActionFromTemplate(ACTION_TEMPLATES.MEELE_HEAVY, tempCreature.rarity, tempCreature.size));
    }

    if (hasRangedAction) {
      if (actionDetailsIndex === 0) {
        tempCreature.actions.push(GetActionFromTemplate(ACTION_TEMPLATES.RANGED_LIGHT, tempCreature.rarity, tempCreature.size));
      }

      tempCreature.actions.push(GetActionFromTemplate(ACTION_TEMPLATES.RANGED, tempCreature.rarity, tempCreature.size));
      tempCreature.actions.push(GetActionFromTemplate(ACTION_TEMPLATES.RANGED_HEAVY, tempCreature.rarity, tempCreature.size));
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
          optionDisplay={(o) => (systemType === SYSTEM_TYPES.DND_5E ? o.display : o.treasureDisplay)}
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
