import React, { useState } from "react";
import * as cc from "../../constants/combatConstants";
import { creatureXpThresholds } from "../../constants/creatureConstants";

import SelectButton from "../SelectButton";
import Button from "../Button";
import Modal from "../Modal";

import "./styles.css";

function ModalCalcXp({ level, onClose }) {
  const [difficulty, setDifficulty] = useState(cc.COMBAT_DIFFICULTIES.MEDIUM);
  const [result, setResult] = useState(null);

  function HandleChange(value) {
    setDifficulty(value);
    setResult(null);
  }

  function calcXp() {
    setResult(creatureXpThresholds[level - 1][difficulty]);
  }

  return (
    <Modal className="ModalCalcXp-container df" title={`Calcular XP`} onClickToClose={onClose}>
      <div className="df df-fd-c df-rg-25">
        <h3>Quao significativo foi o feito do grupo (nível {level})?</h3>
        <div className="df options">
          {cc.combatDifficulties.map((option) => (
            <SelectButton
              key={option.value}
              isSelected={difficulty === option.value}
              text={option.display}
              onClick={() => HandleChange(option.value)}
            />
          ))}
        </div>
        {result && <h3 className="result">{result} XP por personagem</h3>}
      </div>
      <div className="divider"></div>
      <Button text="Calcular" onClick={calcXp} isDisabled={result != null} />
    </Modal>
  );
}

export default ModalCalcXp;
