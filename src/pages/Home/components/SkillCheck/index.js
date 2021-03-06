import React, { useState } from "react";
//  import api from "../../services/api";
import { getSkillCheck } from "./utils";
import {
  MIN_DIFICULTY,
  DEFAULT_DIFFICULTY,
  CHECK_DIFFICULTIES,
  DEFAULT_INTENSITY,
  DAMAGE_INTENSITIES,
  DEFAULT_CONDITION,
  CONDITION_DURATIONS,
  DEFAULT_CONDITION_DURATION,
} from "../../../../data/skillCheckConstants";
import { conditions } from "../../../../data/creatureConstants";

import Panel from "../../../../components/Panel";
import Select from "../../../../components/Select";
import SelectButton from "../../../../components/SelectButton";
import Button from "../../../../components/Button";
import ResultBox from "../../../../components/ResultBox";

import "./styles.css";

function SkillCheck({ resultText, level }) {
  const [hasResult, setHasResult] = useState(false);
  const [checkDifficulty, setCheckDifficulty] = useState(DEFAULT_DIFFICULTY);
  const [damageIntensity, setDamageIntensity] = useState(DEFAULT_INTENSITY);
  const [condition, setCondition] = useState(null);
  const [conditionDuration, setConditionDuration] = useState(DEFAULT_CONDITION_DURATION);

  const generatedSkillCheck = getSkillCheck(level, checkDifficulty, damageIntensity, condition, conditionDuration);

  function HandleSetCondition(value) {
    if (value === null) {
      setConditionDuration(DEFAULT_CONDITION_DURATION);
    }

    return setCondition(value);
  }

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  return (
    <div className="SkillCheck-container">
      {!hasResult ? (
        <>
          <section>
            <Panel title="Dificuldade" info={[{ text: `Dificuldade mínima: ${MIN_DIFICULTY}` }]}>
              <main className="panel-select">
                {CHECK_DIFFICULTIES.map((option) => (
                  <SelectButton
                    key={option}
                    isLarge={false}
                    isLong={false}
                    isSelected={checkDifficulty === option}
                    text={option}
                    onClick={() => setCheckDifficulty(option)}
                  />
                ))}
              </main>
            </Panel>
          </section>
          <section>
            <Panel title="Condição e Duração">
              <main className="panel-select condition">
                <Select
                  extraWidth={150}
                  value={condition}
                  onSelect={HandleSetCondition}
                  nothingSelected={DEFAULT_CONDITION}
                  options={conditions}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                />
                <Select
                  extraWidth={150}
                  value={conditionDuration}
                  onSelect={setConditionDuration}
                  nothingSelected={DEFAULT_CONDITION_DURATION}
                  options={CONDITION_DURATIONS}
                  isDisabled={condition === DEFAULT_CONDITION}
                />
              </main>
            </Panel>
          </section>
          <section>
            <Panel title="Intensidade do Dano">
              <main className="panel-select">
                {DAMAGE_INTENSITIES.map((option) => (
                  <SelectButton
                    key={option}
                    isLarge={false}
                    isLong={false}
                    isSelected={damageIntensity === option}
                    text={option}
                    onClick={() => setDamageIntensity(option)}
                  />
                ))}
              </main>
            </Panel>
          </section>
        </>
      ) : (
        <section className="result-tables">
          <ResultBox
            highlightTopRow={true}
            values={generatedSkillCheck.map((skillCheck) => ({
              label: null,
              top: skillCheck.value,
              bottom: skillCheck.name,
            }))}
          />
        </section>
      )}
      <footer>
        <Button text={!hasResult ? `Rodar ${resultText}` : "Rodar Novo"} onClick={() => setHasResult(!hasResult)} />
      </footer>
    </div>
  );
}

export default SkillCheck;
