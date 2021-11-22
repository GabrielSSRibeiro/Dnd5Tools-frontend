import React, { useState } from "react";
//  import api from "../../services/api";

import OptionBox from "../../OptionBox";
import Button from "../../Button";

import "./styles.css";

function Treasure({ history }) {
  const [treasureType, setTreasureType] = useState("");
  const [treasureQuantity, setTreasureQuantity] = useState("");

  const treasureTypes = ["Peças de Ouro", "Material", "Equipamento"];
  const treasureQuantities = ["Pouco", "Médio", "Muito", "Bastante"];
  // const history = useHistory();

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  return (
    <div className="Treasure-container">
      <section>
        <OptionBox title="Tipo" options={treasureTypes} value={treasureType} setValue={setTreasureType} />
      </section>
      <section>
        <OptionBox title="Quantidade" options={treasureQuantities} value={treasureQuantity} setValue={setTreasureQuantity} />
      </section>
      <footer>
        <Button text="Rodar Tesouro" onClick={() => {}} />
      </footer>
    </div>
  );
}

export default Treasure;
