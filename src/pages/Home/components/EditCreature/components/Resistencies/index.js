import React from "react";

import { damageTypes, conditions } from "../../../../../../data/creatureConstants";

import CheckInput from "../../../../../../components/CheckInput";
import SelectButton from "../../../../../../components/SelectButton";

import "./styles.css";

function Resistencies({ creature, setCreature }) {
  function setCreatureDamageEffectiveness(type, value) {
    creature.damagesEffectiveness.find((de) => de.type === type).value = value;
    setCreature({ ...creature });
  }

  function setCreatureConditionImmunity(type) {
    let conditionImmunity = creature.conditionImmunities.find((de) => de.type === type);
    conditionImmunity.value = !conditionImmunity.value;

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
                    key={option.value}
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
                  label={c.display}
                  onClick={() => setCreatureConditionImmunity(c.value)}
                  isSelected={creature.conditionImmunities.find((ci) => ci.type === c.value).value}
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
