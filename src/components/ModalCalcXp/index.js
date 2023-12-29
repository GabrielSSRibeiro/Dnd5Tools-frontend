import React, { useState, useRef } from "react";
import * as creaC from "../../constants/creatureConstants";
import * as combC from "../../constants/combatConstants";
import { creatureXps } from "../../constants/creatureConstants";
import { GetAverageLevel } from "../../helpers/creatureHelper";

import SelectButton from "../SelectButton";
import Button from "../Button";
import Select from "../Select";
import Modal from "../Modal";

import "./styles.css";

function ModalCalcXp({ level, onClose }) {
  const splits = useRef([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [achievement, setAchievement] = useState(null);
  const [rarity, setRarity] = useState(null);
  const [times, setTimes] = useState(splits.current[0]);
  const [split, setSplit] = useState(splits.current[0]);
  const [result, setResult] = useState(null);

  function CalcXp() {
    const avgLvl = GetAverageLevel(rarity);
    const xp = creatureXps[avgLvl - 1] ?? creatureXps[creatureXps.length - 1];
    const multiplier = combC.GetCombatAchievement(achievement).multiplier;
    setResult(times * Math.round((xp * multiplier) / split));
  }

  function HandleChange(func) {
    setResult();
    func();
  }

  return (
    <Modal className="ModalCalcXp-container df" title={`Calcular XP`} onClickToClose={onClose}>
      <div className="df df-fd-c df-rg-25">
        <h4>Qual o feito?</h4>
        <div className="df options">
          {combC.combatAchievements.map((option) => (
            <SelectButton
              isLong={true}
              key={option.value}
              isSelected={achievement === option.value}
              text={option.display}
              onClick={() => HandleChange(() => setAchievement(option.value))}
            />
          ))}
        </div>
        <h4>Qual a raridade?</h4>
        <div className="df options">
          {creaC.creatureRarities.map((option) => (
            <SelectButton
              key={option.value}
              isSelected={rarity === option.value}
              text={option.treasureDisplay}
              onClick={() => HandleChange(() => setRarity(option.value))}
            />
          ))}
        </div>
        <h3 className="result">{result ? `${result} XP` : "-"}</h3>
      </div>
      <div className="divider"></div>
      <footer className="df df-jc-sb df-cg-10">
        <div className="df df-cg-10">
          <Select
            label="Multiplicar por"
            value={times}
            extraWidth={60}
            onSelect={(value) => HandleChange(() => setTimes(value))}
            options={splits.current}
            optionsAtATime={8}
          />
          <Select
            label="Dividir entre grupo de"
            value={split}
            extraWidth={60}
            onSelect={(value) => HandleChange(() => setSplit(value))}
            options={splits.current}
            optionsAtATime={8}
          />
        </div>
        <div className="df df-cg-20">
          <button className="button-simple" onClick={onClose}>
            Cancelar
          </button>
          <Button text="Calcular" isDisabled={!achievement || !rarity} onClick={CalcXp} />
        </div>
      </footer>
    </Modal>
  );
}

export default ModalCalcXp;
