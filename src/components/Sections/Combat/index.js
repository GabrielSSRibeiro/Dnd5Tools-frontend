import React, { useState } from "react";
//  import api from "../../services/api";

import Panel from "../../Panel";
import Button from "../../Button";

import "./styles.css";

function Combat() {
  // const [characters, setCharacters] = useState(null);
  // const [creatures, setCreatures] = useState(null);
  // const history = useHistory();

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  return (
    <div className="Combat-container">
      <div>
        <section>
          <Panel title="Jogadores">
            <main className="panel-content">
              <Button text="Selecionar" onClick={() => {}} />
            </main>
          </Panel>
        </section>
        <section>
          <Panel title="Criaturas">
            <main className="panel-content">
              <Button text="Selecionar" onClick={() => {}} />
            </main>
          </Panel>
        </section>
      </div>
      <footer>
        <Button text="Rodar Encontro" onClick={() => {}} />
      </footer>
    </div>
  );
}

export default Combat;
