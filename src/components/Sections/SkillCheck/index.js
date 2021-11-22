import React, { useState } from "react";
//  import api from "../../services/api";

import OptionBox from "../../OptionBox";
import Button from "../../Button";

import "./styles.css";

function SkillCheck({ history }) {
  const [checkDificulty, setCheckDificulty] = useState("");
  const [damageIntensity, setDamageIntensity] = useState("");

  const treasureTypes = ["Peças de Ouro", "Material", "Equipamento"];
  const treasureQuantities = ["Pouco", "Médio", "Muito", "Bastante"];
  // const history = useHistory();

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  return (
    <div className="SkillCheck-container">
      <section>
        <OptionBox title="Dificuldade" options={treasureTypes} value={checkDificulty} setValue={setCheckDificulty} />
      </section>
      <section>
        <OptionBox title="Intensidade" options={treasureQuantities} value={damageIntensity} setValue={setDamageIntensity} />
      </section>
      <footer>
        <Button text="Rodar Teste" onClick={() => {}} />
      </footer>
    </div>
  );
}

export default SkillCheck;
