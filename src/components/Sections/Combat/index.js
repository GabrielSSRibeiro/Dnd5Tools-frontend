import React, { useState } from "react";
//  import api from "../../services/api";

import Panel from "../../Panel";
import Button from "../../Button";

import "./styles.css";

function Combat({ resultText, level }) {
  const [group, setGroup] = useState(["Soiaz", "Foux", "Isaac"]);
  const [creatures, setCreatures] = useState(null);
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
            <div className="panel-content">
              {group && group.map((group) => <h4>{group}</h4>)}
              <footer style={group && { marginTop: 12.5 }}>
                <Button text="Selecionar" onClick={() => {}} />
              </footer>
            </div>
          </Panel>
        </section>
        <section>
          <Panel title="Criaturas">
            <div className="panel-content">
              {creatures && creatures.map((creature) => <h4>{creature}</h4>)}
              <footer style={creatures && { marginTop: 12.5 }}>
                <Button text="Selecionar" onClick={() => {}} />
              </footer>
            </div>
          </Panel>
        </section>
      </div>
      <footer>
        <Button text={`Rodar ${resultText}`} onClick={() => {}} />
      </footer>
    </div>
  );
}

export default Combat;
