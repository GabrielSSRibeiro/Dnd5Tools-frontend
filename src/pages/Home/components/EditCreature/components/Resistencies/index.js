import React from "react";

import { damageTypes, conditions } from "../../../../../../constants/creatureConstants";

import CheckInput from "../../../../../../components/CheckInput";
import SelectButton from "../../../../../../components/SelectButton";

import "./styles.css";

function Resistencies({ creature, setCreature }) {
  function setCreatureDamageEffectiveness(type, value) {
    creature.damagesEffectiveness.find((de) => de.type === type).value = value;
    setCreature({ ...creature });
  }

  function setCreatureConditionImmunity(value) {
    let conditionImmunity = creature.conditionImmunities.find((ci) => ci === value);
    if (conditionImmunity) {
      creature.conditionImmunities = creature.conditionImmunities.filter((ci) => ci !== value);
    } else {
      creature.conditionImmunities.push(value);
    }

    setCreature({ ...creature });
  }

  return (
    <div className="Resistencies-container">
      <div className="resistencies">
        <h2>Resistências e Vulnerabilidades</h2>
        <div className="damage-effectiveness-wrapper">
          {damageTypes.map((dt) => (
            <div key={dt.value} className="damage-effectiveness">
              <h4>{dt.display}</h4>
              <div className="damage-effectiveness-options">
                <div className="damage-effectiveness-divider"></div>
                {dt.damageEffectiveness.map((option) => (
                  <SelectButton
                    key={dt.value + "" + option.value}
                    isSelected={creature.damagesEffectiveness.find((de) => de.type === dt.value).value === option.value}
                    text={option.display}
                    onClick={() => setCreatureDamageEffectiveness(dt.value, option.value)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="conditions">
        <h2>Imune a Condições</h2>
        <div className="conditions-wrapper">
          {conditions.map((c) => (
            <>
              <div className="conditions-options">
                <CheckInput
                  key={c.value}
                  label={c.display}
                  onClick={() => setCreatureConditionImmunity(c.value)}
                  isSelected={creature.conditionImmunities.find((ci) => ci === c.value)}
                />
              </div>
              <div className="conditions-divider"></div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Resistencies;
