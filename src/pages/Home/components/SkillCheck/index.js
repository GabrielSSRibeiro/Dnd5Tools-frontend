import React, { useState } from "react";
//  import api from "../../services/api";
import { getSkillCheck } from "./utils";
import { MIN_DIFICULTY } from "../../../../data/skillCheckConstants";
import { conditions, conditionDurations, DAMAGE_INTENSITIES, damageIntensities, difficultyClasses } from "../../../../data/creatureConstants";

import Panel from "../../../../components/Panel";
import Modal from "../../../../components/Modal";
import Select from "../../../../components/Select";
import SelectButton from "../../../../components/SelectButton";
import Button from "../../../../components/Button";
import ResultBox from "../../../../components/ResultBox";

import "./styles.css";

function SkillCheck({ resultText, level }) {
  const [hasResult, setHasResult] = useState(false);
  const [checkDifficulty, setCheckDifficulty] = useState(DAMAGE_INTENSITIES.MEDIUM);
  const [damageIntensity, setDamageIntensity] = useState(null);
  const [condition, setCondition] = useState(null);
  const [conditionDuration, setConditionDuration] = useState(null);

  const generatedSkillCheck = getSkillCheck(level, checkDifficulty, damageIntensity, condition, conditionDuration);

  function HandleSetCondition(value) {
    if (value === null) {
      setConditionDuration(null);
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
      <section>
        <Panel title="Dificuldade" info={[{ text: `Dificuldade mínima: ${MIN_DIFICULTY}` }]}>
          <main className="panel-select">
            {difficultyClasses.map((option) => (
              <SelectButton
                key={option.value}
                isLarge={false}
                isLong={false}
                isSelected={checkDifficulty === option.value}
                text={option.display}
                onClick={() => setCheckDifficulty(option.value)}
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
              nothingSelected={"Nenhuma"}
              options={conditions}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
            <Select
              extraWidth={150}
              value={conditionDuration}
              onSelect={setConditionDuration}
              nothingSelected={"Nenhuma"}
              options={conditionDurations}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              isDisabled={!condition}
            />
          </main>
        </Panel>
      </section>
      <section>
        <Panel title="Intensidade do Dano">
          <main className="panel-select">
            {[{ display: "Nenhuma", value: null }, ...damageIntensities].map((option) => (
              <SelectButton
                key={option.value}
                isLarge={false}
                isLong={false}
                isSelected={damageIntensity === option.value}
                text={option.display}
                onClick={() => setDamageIntensity(option.value)}
              />
            ))}
          </main>
        </Panel>
      </section>
      {hasResult && (
        <Modal title="Teste" onClickToClose={() => setHasResult(!hasResult)} className="result-tables">
          <ResultBox
            highlightTopRow={true}
            values={generatedSkillCheck.map((skillCheck) => ({
              label: null,
              top: skillCheck.value,
              bottom: skillCheck.name,
            }))}
          />
        </Modal>
      )}
      <footer>
        <Button text={`Rodar ${resultText}`} onClick={() => setHasResult(!hasResult)} />
      </footer>
    </div>
  );
}

export default SkillCheck;
