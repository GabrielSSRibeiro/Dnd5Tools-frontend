import React from "react";
//  import api from "../../services/api";

import Panel from "../../Panel";
import Button from "../../Button";

import "./styles.css";

function Combat({ selectedCharacters, selectedCreatures, HandleSelectFromParty, HandleSelectFromBestiary, HandleGenerateCombat, resultText, level }) {
  // const history = useHistory();

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  function HandleGenerate() {
    let creatures = selectedCreatures.map((selectedCreature) => selectedCreature);
    HandleGenerateCombat(creatures);
  }

  return (
    <div className="Combat-container">
      <div>
        <section>
          <Panel title="Jogadores">
            <div className="panel-content">
              {selectedCharacters && selectedCharacters.map((character) => <h4>{character}</h4>)}
              <footer style={{ marginTop: selectedCharacters.length > 0 ? 12.5 : 0 }}>
                <Button text="Selecionar" onClick={HandleSelectFromParty} />
              </footer>
            </div>
          </Panel>
        </section>
        <section>
          <Panel title="Criaturas">
            <div className="panel-content">
              {selectedCreatures && selectedCreatures.map((creature) => <h4>{creature}</h4>)}
              <footer style={{ marginTop: selectedCreatures.length > 0 ? 12.5 : 0 }}>
                <Button text="Selecionar" onClick={HandleSelectFromBestiary} />
              </footer>
            </div>
          </Panel>
        </section>
      </div>
      <footer>
        <Button text={`Rodar ${resultText}`} onClick={HandleGenerate} isDisabled={true} />
      </footer>
    </div>
  );
}

export default Combat;
