import React, { useState } from "react";
//  import api from "../../services/api";
import { checkDificulties, damageIntensities } from "../../../tables";

import Panel from "../../Panel";
import SelectButton from "../../SelectButton";
import Button from "../../Button";

import "./styles.css";

function SkillCheck({ history }) {
  const [checkDificulty, setCheckDificulty] = useState("");
  const [damageIntensity, setDamageIntensity] = useState("");

  // const history = useHistory();

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  return (
    <div className="SkillCheck-container">
      <section>
        <Panel title="Dificuldade">
          <main className="panel-select">
            {checkDificulties.map((option) => (
              <SelectButton
                key={option}
                isLarge={false}
                isLong={false}
                isSelected={checkDificulty === option}
                text={option}
                onClick={() => setCheckDificulty(option)}
              />
            ))}
          </main>
        </Panel>
      </section>
      <section>
        <Panel title="Intensidade">
          <main className="panel-select">
            {damageIntensities.map((option) => (
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
      <footer>
        <Button text="Rodar Teste" onClick={() => {}} />
      </footer>
    </div>
  );
}

export default SkillCheck;
