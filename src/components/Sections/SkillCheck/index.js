import React, { useState } from "react";
//  import api from "../../services/api";
import {
  DEFAULT_DIFFICULTY,
  CHECK_DIFFICULTIES,
  DEFAULT_INTENSITY,
  DAMAGE_INTENSITIES,
  DEFAULT_CONDITION,
  CONDITIONS,
  getSkillCheck,
} from "../../../Tables/skillCheck";

import Panel from "../../Panel";
import Select from "../../Select";
import SelectButton from "../../SelectButton";
import Button from "../../Button";
import ResultBox from "../../ResultBox";

import "./styles.css";

function SkillCheck({ resultText, level }) {
  const [hasResult, setHasResult] = useState(false);
  const [checkDifficulty, setCheckDifficulty] = useState(DEFAULT_DIFFICULTY);
  const [damageIntensity, setDamageIntensity] = useState(DEFAULT_INTENSITY);
  const [condition, setCondition] = useState(DEFAULT_CONDITION);

  const generatedSkillCheck = getSkillCheck(level, checkDifficulty, condition, damageIntensity);

  // const history = useHistory();

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
            <Panel title="Dificuldade">
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
            <Panel title="Condição">
              <main className="panel-select">
                <Select extraWidth={150} value={condition} onSelect={setCondition} options={CONDITIONS} />
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
        <Button text={!hasResult ? `Rodar ${resultText}` : "Rodar Novo"} onClick={() => (hasResult ? setHasResult(false) : setHasResult(true))} />
      </footer>
    </div>
  );
}

export default SkillCheck;