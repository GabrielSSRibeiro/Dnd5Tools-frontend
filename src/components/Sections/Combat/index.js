import React from "react";
//  import api from "../../services/api";

import { CREATURE_DIFICULTIES } from "../../../Tables/combat";

import Panel from "../../Panel";
import Button from "../../Button";
import Select from "../../Select";

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
        <section className="characters-container">
          <Panel title="Personagens">
            <div className="panel-content">
              {selectedCharacters &&
                selectedCharacters.map((character) => (
                  <div className="character-details">
                    <div className="character-name">
                      <h4>{character}</h4>
                    </div>
                  </div>
                ))}
              <footer style={{ marginTop: selectedCharacters.length > 0 ? 25 : 0 }}>
                <Button text="Selecionar" onClick={HandleSelectFromParty} />
              </footer>
            </div>
          </Panel>
        </section>
        <section className="creatures-container">
          <Panel title="Criaturas">
            <div className="panel-content">
              {selectedCreatures &&
                selectedCreatures.map((creature) => (
                  <div className="creature-details">
                    <button>+1</button>
                    <div className="creature-name">
                      <h4>{creature.name}</h4>
                    </div>
                    <Select extraWidth={50} value="DIficuldade" onSelect={() => {}} options={CREATURE_DIFICULTIES} />
                    <button onClick={() => {}}>
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              <footer style={{ marginTop: selectedCreatures.length > 0 ? 25 : 0 }}>
                <Button text="Selecionar" onClick={HandleSelectFromBestiary} />
              </footer>
            </div>
          </Panel>
        </section>
      </div>
      <footer>
        <Button
          text={`Rodar ${resultText}`}
          onClick={HandleGenerate}
          isDisabled={selectedCharacters.length === 0 || selectedCreatures.length === 0 || true}
        />
      </footer>
    </div>
  );
}

export default Combat;
