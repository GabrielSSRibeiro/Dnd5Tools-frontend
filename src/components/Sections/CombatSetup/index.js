import React, { useState } from "react";
//  import api from "../../services/api";

import { SortArrayOfObjByProperty } from "../../../utils";
import { COMBAT_DIFICULTIES } from "../../../Tables/combat";

import Panel from "../../Panel";
import Button from "../../Button";
import Select from "../../Select";

import "./styles.css";

function CombatSetup({
  selectedCharacters,
  selectedCreatures,
  setSelectedCreatures,
  HandleSelectFromParty,
  HandleSelectFromBestiary,
  HandleGenerateCombat,
  resultText,
  level,
}) {
  const [combatDificulty, setCombatDificulty] = useState(null);

  const MAX_ALLOWED = 7;
  // const history = useHistory();

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  function HandleAddExtraOne(index) {
    let creature = { ...selectedCreatures[index] };

    //get creature base name
    let creatureNameArray = creature.name.split(" ");
    if (parseInt(creatureNameArray[creatureNameArray.length - 1])) {
      creatureNameArray.pop();
    }
    const baseName = creatureNameArray.join(" ");

    //get latest creature number
    let latestCreatureNameArray = selectedCreatures
      .filter((sc) => sc.name.includes(baseName))
      .pop()
      .name.split(" ");
    const creatureNumber = parseInt(latestCreatureNameArray[latestCreatureNameArray.length - 1]);

    if (creatureNumber) {
      latestCreatureNameArray.pop();
      latestCreatureNameArray.push(creatureNumber + 1);
    } else {
      latestCreatureNameArray.push("2");
    }
    creature.name = latestCreatureNameArray.join(" ");

    let creatures = [...selectedCreatures, creature];
    SortArrayOfObjByProperty(creatures, "name");

    setSelectedCreatures(creatures);
  }

  function HandleDelete(creature) {
    const creatures = selectedCreatures.filter((selectedCreature) => selectedCreature.name !== creature.name);

    setSelectedCreatures(creatures);
  }

  function HandleNPC(creature) {
    if (!creature.isNPC) {
      creature.isNPC = true;
    } else {
      creature.isNPC = !creature.isNPC;
    }

    const creatures = selectedCreatures.filter((selectedCreature) => selectedCreature.name !== creature.name);
    creatures.push(creature);

    setSelectedCreatures(creatures);
  }

  return (
    <div className="CombatSetup-container">
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
                selectedCreatures.map((creature, index) => (
                  <div className="creature-details">
                    <button onClick={() => HandleAddExtraOne(index)} className={selectedCreatures.length === MAX_ALLOWED ? "button-disabled" : ""}>
                      +1
                    </button>
                    <button className={creature.isNPC ? "toggle-npc" : "toggle-creature"} onClick={() => HandleNPC(creature)}>
                      {creature.isNPC ? <i class="fas fa-heart"></i> : <i class="fas fa-skull"></i>}
                    </button>
                    <div className="creature-name">
                      <h4>{creature.name}</h4>
                    </div>
                    <div className="creature-stats">
                      <h4>86 PV</h4>
                    </div>
                    <button onClick={() => HandleDelete(creature)}>
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
        <Select
          isLarge={true}
          extraWidth={150}
          value={combatDificulty ?? "DIficuldade do Combate"}
          onSelect={setCombatDificulty}
          dropUp={true}
          options={COMBAT_DIFICULTIES}
        />

        <Button
          text={`Rodar ${resultText}`}
          onClick={HandleGenerateCombat}
          isDisabled={selectedCharacters.length === 0 || selectedCreatures.length === 0}
        />
      </footer>
    </div>
  );
}

export default CombatSetup;
